<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;
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
     * If a tool call is requested, execute the tool and provide its result.
     * Supports optional streaming and tool selection.
     *
     * @param int $userId
     * @param array $userMessages Array of messages [{role: user|assistant, content: string}, ...]
     * @param array $context
     * @param bool $stream
     * @param array $selectedTools
     * @return string|iterable
     */
    public function getResponse(int $userId, array $userMessages, array $context, bool $stream = false, array $selectedTools = [])
    {
        $model = env('GPT_MODEL', 'gpt-4o');
        $fallbackModel = env('GPT_FALLBACK_MODEL', 'gpt-3.5-turbo');

        // System context messages
        $messages = [
            [
                'role' => 'system',
                'content' => 'You are a helpful assistant. Use the provided context to answer user queries.',
            ],
            [
                'role' => 'system',
                'content' => 'User Attributes: ' . json_encode($context['user_attributes']),
            ],
            [
                'role' => 'system',
                'content' => 'Recent Activities: ' . json_encode($context['activities']),
            ],
        ];

        // Append the provided messages to the message array
        foreach ($userMessages as $msg) {
            $messages[] = [
                'role' => $msg['role'],
                'content' => $msg['content'],
            ];
        }

        // Define available tools (excluding getUserAttributes as requested)
        $allTools = [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'updateUserAttributes',
                    'description' => 'Add or update the authenticated user attributes',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'attributes' => [
                                'type' => 'object',
                                'additionalProperties' => ['type' => 'string']
                            ]
                        ],
                        'required' => ['attributes']
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'deleteUserAttributes',
                    'description' => 'Remove specified attributes from the authenticated user',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'keys' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'string'
                                ]
                            ]
                        ],
                        'required' => ['keys']
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'getActivities',
                    'description' => 'Retrieve the authenticated user activities with optional filtering',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'from_date' => [
                                'type' => 'string',
                                'format' => 'date'
                            ],
                            'to_date' => [
                                'type' => 'string',
                                'format' => 'date'
                            ]
                        ],
                        'required' => []
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'updateActivities',
                    'description' => 'Add or update the authenticated user activities',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'activities' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object'
                                ]
                            ]
                        ],
                        'required' => ['activities']
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'deleteActivities',
                    'description' => 'Remove specified activities from the authenticated user',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'activityIds' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'integer'
                                ]
                            ]
                        ],
                        'required' => ['activityIds']
                    ],
                ],
            ],
        ];

        // Filter tools based on selectedTools
        $tools = [];
        if (!empty($selectedTools)) {
            foreach ($allTools as $tool) {
                if (in_array($tool['function']['name'], $selectedTools)) {
                    $tools[] = $tool;
                }
            }
        }

        // Initial attempt with the primary model
        try {
            if ($stream) {
                $response = OpenAI::chat()->createStreamed([
                    'model' => $model,
                    'messages' => $messages,
                    'tools' => $tools,
                ]);
            } else {
                $response = OpenAI::chat()->create([
                    'model' => $model,
                    'messages' => $messages,
                    'tools' => $tools,
                ]);
            }
        } catch (Exception $e) {
            Log::error('OpenAI request failed: ' . $e->getMessage());
            // Attempt fallback model
            try {
                if ($stream) {
                    $response = OpenAI::chat()->createStreamed([
                        'model' => $fallbackModel,
                        'messages' => $messages,
                        'tools' => $tools,
                    ]);
                } else {
                    $response = OpenAI::chat()->create([
                        'model' => $fallbackModel,
                        'messages' => $messages,
                        'tools' => $tools,
                    ]);
                }
            } catch (Exception $fallbackException) {
                Log::error('Fallback model request failed: ' . $fallbackException->getMessage());
                return 'An error occurred while processing your request. Please try again later.';
            }
        }

        // Handle streaming response
        if ($stream) {
            foreach ($response as $chunk) {
                yield $chunk;
            }
            return;
        }

        // Check for tool calls
        $choice = $response->choices[0];
        if (!empty($choice->message->toolCalls)) {
            $toolCall = $choice->message->toolCalls[0];
            $toolName = $toolCall->function->name;
            $arguments = json_decode($toolCall->function->arguments, true);

            // Execute the tool
            $toolResult = $this->executeTool($userId, $toolName, $arguments);

            // Send the tool result back to the model
            $messages[] = [
                'role' => 'tool',
                'name' => $toolName,
                'content' => json_encode($toolResult),
            ];

            try {
                if ($stream) {
                    $followUpResponse = OpenAI::chat()->createStreamed([
                        'model' => $model,
                        'messages' => $messages,
                        'tools' => $tools,
                    ]);
                } else {
                    $followUpResponse = OpenAI::chat()->create([
                        'model' => $model,
                        'messages' => $messages,
                        'tools' => $tools,
                    ]);
                }
            } catch (Exception $e) {
                Log::error('OpenAI follow-up request failed: ' . $e->getMessage());
                return 'An error occurred while processing your request. Please try again later.';
            }

            if (!isset($followUpResponse->choices[0]->message->content)) {
                return 'No response generated. Please try again.';
            }

            return trim($followUpResponse->choices[0]->message->content);
        }

        if (!isset($choice->message->content)) {
            return 'No response generated. Please try again.';
        }

        return trim($choice->message->content);
    }

    /**
     * Execute a tool based on the provided name and arguments.
     *
     * @param int $userId
     * @param string $toolName
     * @param array $arguments
     * @return array
     */
    protected function executeTool(int $userId, string $toolName, array $arguments): array
    {
        switch ($toolName) {
            case 'updateUserAttributes':
                return $this->chatToolService->updateUserAttributes($userId, $arguments['attributes']);

            case 'deleteUserAttributes':
                return $this->chatToolService->deleteUserAttributes($userId, $arguments['keys']);

            case 'getActivities':
                $filters = [];
                if (isset($arguments['from_date'])) {
                    $filters['from_date'] = $arguments['from_date'];
                }
                if (isset($arguments['to_date'])) {
                    $filters['to_date'] = $arguments['to_date'];
                }
                return $this->chatToolService->getActivities($userId, $filters);

            case 'updateActivities':
                return $this->chatToolService->updateActivities($userId, $arguments['activities']);

            case 'deleteActivities':
                return $this->chatToolService->deleteActivities($userId, $arguments['activityIds']);

            default:
                return ['message' => 'Tool not recognized.'];
        }
    }
}
