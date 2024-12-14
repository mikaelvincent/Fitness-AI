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

        // System messages provide the assistant with context, encouraging user detail for better personalization.
        $messages = [
            [
                'role' => 'system',
                'content' => 'You are "Genie," a helpful fitness assistant for GymGenie. Utilize the provided context (user attributes, recent activities) to tailor personalized suggestions and respond to user inquiries. Gently encourage users to share more details (such as age, weight, preferences, location, or available equipment) if it can help improve the quality of your advice. Avoid being intrusive or repetitive. Always maintain a helpful and professional tone.',
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

        foreach ($userMessages as $msg) {
            $messages[] = [
                'role' => $msg['role'],
                'content' => $msg['content'],
            ];
        }

        // Tool definitions with comprehensive descriptions.
        $allTools = [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'updateUserAttributes',
                    'description' => 'Add or update user attributes. This tool accepts a set of key-value pairs representing user characteristics (e.g., weight, preferred workouts, dietary restrictions). By sharing more personal details, users can receive more tailored activity suggestions, nutritional guidance, or motivational tips.',
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
                    'description' => 'Remove specified user attributes. Provide an array of attribute keys that should be removed from the user’s profile. This can help the user keep their profile accurate and up-to-date as their preferences or conditions change.',
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
                    'description' => 'Retrieve activities based on optional date filters (from_date, to_date). This helps in understanding the user’s recent fitness routine, progress, and preferences. Data from these activities can inform better workout suggestions, progression plans, or modifications to improve overall fitness outcomes.',
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
                    'description' => 'Add or update user activities. This tool accepts an array of activity objects (e.g., running, bench press) along with their details (date, name, completion status). By keeping activities updated, the user can track progress, build routines, or receive more accurate and personalized suggestions for future workouts or improvements.',
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
                    'description' => 'Remove specified activities by their IDs. This tool helps maintain an accurate and current log of the user’s activity history, removing outdated or incorrect entries for better long-term planning and analysis of the user’s fitness journey.',
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

        $tools = [];
        if (!empty($selectedTools)) {
            foreach ($allTools as $tool) {
                if (in_array($tool['function']['name'], $selectedTools)) {
                    $tools[] = $tool;
                }
            }
        }

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
            Log::error('OpenAI primary model request failed.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

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

        if ($stream) {
            return $response;
        }

        $choice = $response->choices[0];
        if (!empty($choice->message->toolCalls)) {
            $toolCall = $choice->message->toolCalls[0];
            $toolName = $toolCall->function->name;
            $arguments = json_decode($toolCall->function->arguments, true);

            Log::info('Executing tool call.', [
                'user_id' => $userId,
                'tool_name' => $toolName,
                'arguments' => $arguments
            ]);

            $toolResult = $this->executeTool($userId, $toolName, $arguments);

            $messages[] = [
                'role' => 'tool',
                'name' => $toolName,
                'content' => json_encode($toolResult),
            ];

            try {
                if (!isset($toolResult['message'])) {
                    $toolResult['message'] = 'Tool call completed.';
                }

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

                if (!isset($followUpResponse->choices[0]->message->content)) {
                    return 'No response generated. Please try again.';
                }

                Log::info('Response generated after tool call.', [
                    'user_id' => $userId,
                ]);

                return trim($followUpResponse->choices[0]->message->content);

            } catch (Exception $e) {
                Log::error('OpenAI follow-up request after tool call failed.', [
                    'user_id' => $userId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                return 'An error occurred while processing your request. Please try again later.';
            }
        }

        if (!isset($choice->message->content)) {
            return 'No response generated. Please try again.';
        }

        Log::info('Response generated successfully without tool calls.', [
            'user_id' => $userId,
        ]);

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
                Log::warning('Tool not recognized.', [
                    'user_id' => $userId,
                    'tool_name' => $toolName
                ]);
                return ['message' => 'Tool not recognized.'];
        }
    }
}
