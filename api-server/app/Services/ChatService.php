<?php
namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;

class ChatService
{
    protected ChatToolService $chatToolService;
    protected ChatContextService $chatContextService;

    /**
     * @param ChatToolService $chatToolService
     * @param ChatContextService $chatContextService
     */
    public function __construct(ChatToolService $chatToolService, ChatContextService $chatContextService)
    {
        $this->chatToolService = $chatToolService;
        $this->chatContextService = $chatContextService;
    }

    /**
     * Generate a chat response from the model.
     */
    public function getResponse(int $userId, array $userMessages, array $context, array $selectedTools = [])
    {
        // Log the chat request
        Log::info('Chat request received.', [
            'user_id' => $userId,
            'user_messages' => $userMessages,
            'selected_tools' => $selectedTools,
        ]);

        $model = env('GPT_MODEL', 'gpt-4o');

        // Generate system prompts with the initial context
        $messages = $this->generateSystemPrompts($context);

        // Append user messages
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

        // Log the API call
        Log::info('Sending request to OpenAI.', [
            'user_id' => $userId,
            'payload' => $payload,
        ]);

        try {
            $response = OpenAI::chat()->create($payload);

            // Log the API response
            Log::info('Received response from OpenAI.', [
                'user_id' => $userId,
                'response' => $response,
            ]);
        } catch (Exception $e) {
            Log::error('OpenAI model request failed.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 'An error occurred while processing your request. Please try again later.';
        }

        $executedToolCalls = [];
        $finalContent = $this->processToolCalls(
            $userId,
            $tools,
            $model,
            $messages,
            $response,
            $executedToolCalls,
            $userMessages
        );

        // Log the final response
        Log::info('Generated final response.', [
            'user_id' => $userId,
            'final_content' => $finalContent,
            'executed_tool_calls' => $executedToolCalls,
        ]);

        return [
            'response' => $finalContent,
            'executed_tool_calls' => $executedToolCalls,
        ];
    }

    /**
     * Generate system prompts with the given context.
     */
    protected function generateSystemPrompts(array $context): array
    {
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
            $systemPrompts[1]['content'] .= '';
        }
        if (isset($systemPrompts[2]['content'])) {
            $systemPrompts[2]['content'] .= json_encode($context['user_attributes'] ?? []);
        }
        if (isset($systemPrompts[3]['content'])) {
            $systemPrompts[3]['content'] .= json_encode($context['activities'] ?? []);
        }

        return $systemPrompts;
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
        array $userMessages
    ): string {
        while (true) {
            $choice = $response->choices[0];
            $toolCalls = $choice->message->toolCalls ?? [];

            if (empty($toolCalls)) {
                if (!isset($choice->message->content)) {
                    return 'No response generated. Please try again.';
                }
                return trim($choice->message->content);
            }

            foreach ($toolCalls as $toolCall) {
                $toolName = $toolCall->function->name;
                $arguments = json_decode($toolCall->function->arguments, true);

                // Log the tool execution
                Log::info('Executing tool.', [
                    'user_id' => $userId,
                    'tool_name' => $toolName,
                    'arguments' => $arguments,
                ]);

                $toolResult = $this->executeTool($userId, $toolName, $arguments);

                // Log the tool execution result
                Log::info('Tool execution completed.', [
                    'user_id' => $userId,
                    'tool_name' => $toolName,
                    'result' => $toolResult,
                ]);

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

                // Update context after tool execution
                $context = $this->chatContextService->getContext($userId);

                // Regenerate system prompts with updated context
                $systemPrompts = $this->generateSystemPrompts($context);

                // Rebuild messages with updated system prompts
                $nonSystemMessages = array_slice($messages, count($systemPrompts));
                $messages = array_merge($systemPrompts, $nonSystemMessages);

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

        // Log the follow-up API call
        Log::info('Sending follow-up request to OpenAI.', [
            'user_id' => $userId,
            'payload' => $payload,
        ]);

        try {
            $response = OpenAI::chat()->create($payload);

            // Log the follow-up API response
            Log::info('Received follow-up response from OpenAI.', [
                'user_id' => $userId,
                'response' => $response,
            ]);
            return $response;
        } catch (Exception $e) {
            Log::error('OpenAI request failed during follow-up.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

    /**
     * Execute the specified tool with given arguments.
     */
    protected function executeTool(int $userId, string $toolName, array $arguments): array
    {
        switch ($toolName) {
            case 'updateUserAttributes':
                $result = $this->chatToolService->updateUserAttributes($userId, $arguments);
                break;
            case 'deleteUserAttributes':
                $result = $this->chatToolService->deleteUserAttributes($userId, $arguments);
                break;
            case 'getActivities':
                $result = $this->chatToolService->getActivities($userId, $arguments);
                break;
            case 'updateActivities':
                $result = $this->chatToolService->updateActivities($userId, $arguments);
                break;
            case 'deleteActivities':
                $result = $this->chatToolService->deleteActivities($userId, $arguments);
                break;
            default:
                Log::warning('Unknown tool called.', [
                    'user_id' => $userId,
                    'tool_name' => $toolName,
                ]);
                return ['message' => 'Unknown tool name.'];
        }
        return $result;
    }
}
