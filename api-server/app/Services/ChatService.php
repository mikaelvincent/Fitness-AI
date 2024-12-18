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
    public function getResponse(int $userId, array $userMessages, array $context, array $selectedTools = [])
    {
        $model = env('GPT_MODEL', 'gpt-4o');

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

        // Include tools if any are selected
        if (!empty($tools)) {
            $payload['tools'] = $tools;
        }

        try {
            $response = OpenAI::chat()->create($payload);
        } catch (Exception $e) {
            Log::error('OpenAI model request failed.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 'An error occurred while processing your request. Please try again later.';
        }

        $executedToolCalls = [];
        $finalContent = $this->processToolCalls($userId, $tools, $model, $messages, $response, $executedToolCalls);

        return [
            'response' => $finalContent,
            'executed_tool_calls' => $executedToolCalls,
        ];
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
        array &$executedToolCalls
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
                    'arguments' => $arguments,
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

                $response = $this->safeOpenAIRequest($userId, $model, $messages, $tools);
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
        array $messages,
        array $tools
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
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }
}
