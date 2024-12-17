<?php
namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;

class ChatService
{
    protected ChatToolService $chatToolService;

    /**
     * @param ChatToolService $chatToolService
     */
    public function __construct(ChatToolService $chatToolService)
    {
        $this->chatToolService = $chatToolService;
    }

    /**
     * Generate a chat response from the model.
     */
    public function getResponse(int $userId, array $userMessages, array $context, bool $stream = false, array $selectedTools = [])
    {
        $model = env('GPT_MODEL', 'gpt-4o');
        $fallbackModel = env('GPT_FALLBACK_MODEL', 'gpt-3.5-turbo');

        // Load system prompts from config
        $systemPrompts = config('chatprompts.assistant_intro', []);

        // Replace placeholders with dynamic values
        $todayDate = Carbon::now()->format('F j, Y');
        foreach ($systemPrompts as &$prompt) {
            if (isset($prompt['content'])) {
                $prompt['content'] = str_replace('{{today_date}}', $todayDate, $prompt['content']);
            }
        }
        unset($prompt);

        // Append the user attributes and activities data
        if (isset($systemPrompts[1]['content'])) {
            $systemPrompts[1]['content'] .= json_encode($context['user_attributes']);
        }
        if (isset($systemPrompts[2]['content'])) {
            $systemPrompts[2]['content'] .= json_encode($context['activities']);
        }

        $messages = $systemPrompts;
        foreach ($userMessages as $msg) {
            $messages[] = [
                'role' => $msg['role'],
                'content' => $msg['content'],
            ];
        }

        // Load tool definitions from config
        $allTools = config('chattools', []);
        $tools = [];
        if (!empty($selectedTools)) {
            foreach ($allTools as $tool) {
                if (in_array($tool['function']['name'], $selectedTools)) {
                    $tools[] = $tool;
                }
            }
        }

        // Build request payload
        $payload = [
            'model' => $model,
            'messages' => $messages,
        ];

        // Only include tools if not empty
        if (!empty($tools)) {
            $payload['tools'] = $tools;
        }

        // For initial request, streaming may not be supported by some configurations;
        // if stream is requested, handle gracefully without causing errors.
        try {
            $response = OpenAI::chat()->create($payload);
        } catch (Exception $e) {
            Log::error('OpenAI primary model request failed.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Attempt fallback model
            $payload['model'] = $fallbackModel;
            try {
                $response = OpenAI::chat()->create($payload);
                Log::info('Fallback model used successfully.', [
                    'user_id' => $userId
                ]);
            } catch (Exception $fallbackException) {
                Log::error('Fallback model request failed.', [
                    'user_id' => $userId,
                    'error' => $fallbackException->getMessage(),
                    'trace' => $fallbackException->getTraceAsString()
                ]);
                return 'An error occurred while processing your request. Please try again later.';
            }
        }

        $executedToolCalls = [];
        $finalContent = $this->processToolCalls($userId, $tools, $model, $messages, $response, $executedToolCalls, $fallbackModel, $stream);

        // If stream is requested, we will simulate streaming the final result.
        if ($stream) {
            return (function () use ($finalContent) {
                yield $finalContent;
            })();
        }

        return [
            'response' => $finalContent,
            'executed_tool_calls' => $executedToolCalls
        ];
    }

    /**
     * Execute a tool call.
     */
    protected function executeTool(int $userId, string $toolName, array $arguments): array
    {
        switch ($toolName) {
            case 'updateUserAttributes':
                return $this->chatToolService->updateUserAttributes($userId, $arguments);

            case 'deleteUserAttributes':
                return $this->chatToolService->deleteUserAttributes($userId, $arguments);

            case 'getActivities':
                return $this->chatToolService->getActivities($userId, $arguments);

            case 'updateActivities':
                return $this->chatToolService->updateActivities($userId, $arguments);

            case 'deleteActivities':
                return $this->chatToolService->deleteActivities($userId, $arguments);

            default:
                Log::warning('Tool not recognized.', [
                    'user_id' => $userId,
                    'tool_name' => $toolName
                ]);
                return ['message' => 'Tool not recognized.'];
        }
    }

    /**
     * Handle multiple tool calls if any, and ensure a final response.
     */
    protected function processToolCalls(
        int $userId,
        array $tools,
        string $model,
        array &$messages,
        $response,
        array &$executedToolCalls,
        string $fallbackModel,
        bool $stream
    ): string {
        while (true) {
            $choice = $response->choices[0];
            $toolCalls = $choice->message->toolCalls ?? [];

            if (empty($toolCalls)) {
                if (!isset($choice->message->content)) {
                    return 'No response generated. Please try again.';
                }

                Log::info('Response generated successfully without further tool calls.', [
                    'user_id' => $userId,
                ]);

                return trim($choice->message->content);
            }

            foreach ($toolCalls as $toolCall) {
                $toolName = $toolCall->function->name;
                $arguments = json_decode($toolCall->function->arguments, true);

                Log::info('Executing tool call.', [
                    'user_id' => $userId,
                    'tool_name' => $toolName,
                    'arguments' => $arguments
                ]);

                $toolResult = $this->executeTool($userId, $toolName, $arguments);
                $executedToolCalls[] = [
                    'tool_name' => $toolName,
                    'arguments' => $arguments,
                    'result' => $toolResult,
                ];

                $messages[] = [
                    'role' => 'function',
                    'name' => $toolName,
                    'content' => json_encode($toolResult),
                ];

                $response = $this->safeOpenAIRequest($userId, $model, $fallbackModel, $messages, $tools, $stream);
                if (!$response) {
                    return 'An error occurred while processing your request. Please try again later.';
                }
            }
        }
    }

    /**
     * Safely request a follow-up response from OpenAI.
     */
    protected function safeOpenAIRequest(
        int $userId,
        string $model,
        string $fallbackModel,
        array $messages,
        array $tools,
        bool $stream
    ) {
        $payload = [
            'model' => $model,
            'messages' => $messages,
        ];

        if (!empty($tools)) {
            $payload['tools'] = $tools;
        }

        try {
            return OpenAI::chat()->create($payload);
        } catch (Exception $e) {
            Log::error('OpenAI request failed during follow-up.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Attempt fallback model
            $payload['model'] = $fallbackModel;
            try {
                return OpenAI::chat()->create($payload);
            } catch (Exception $fallbackException) {
                Log::error('Fallback model request failed during follow-up.', [
                    'user_id' => $userId,
                    'error' => $fallbackException->getMessage(),
                    'trace' => $fallbackException->getTraceAsString()
                ]);

                return null;
            }
        }
    }
}
