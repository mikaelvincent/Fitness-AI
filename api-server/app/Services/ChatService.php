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
     *
     * This method communicates with the configured language model (e.g., GPT-4o) to generate a response
     * based on user messages and contextual data. It can optionally stream responses and call predefined tools.
     * If a tool call is requested by the model, this method executes the tool and then prompts the model again
     * for a follow-up response.
     *
     * @param int $userId The authenticated user's ID.
     * @param array $userMessages A list of messages sent by the user and/or assistant. Each element is an associative array:
     *                            [
     *                              'role' => 'user'|'assistant',
     *                              'content' => string
     *                            ]
     * @param array $context Contextual data (user attributes and recent activities) retrieved by ChatContextService.
     * @param bool $stream If true, enables streaming responses.
     * @param array $selectedTools A list of tool names that the assistant can use.
     *
     * @return string|iterable The response from the model, or an iterable if streaming is enabled.
     */
    public function getResponse(int $userId, array $userMessages, array $context, bool $stream = false, array $selectedTools = [])
    {
        $model = env('GPT_MODEL', 'gpt-4o');
        $fallbackModel = env('GPT_FALLBACK_MODEL', 'gpt-3.5-turbo');

        // System messages to provide context.
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

        /**
         * Refined tool definitions:
         *
         * These tools are available for the assistant to perform certain actions on behalf of the user.
         * Each tool has a "function" definition that includes:
         * - name: The tool's identifier.
         * - description: A detailed explanation of what the tool does, when it should be used, and how it behaves.
         * - parameters: The schema defining the expected input parameters for the tool. This includes the types, formats,
         *   and requirements of each parameter. These parameters dictate what data the assistant can and should provide
         *   when invoking the tool.
         *
         * The tools manage user attributes and activities, enabling the assistant to help the user update their profile,
         * view and record their fitness activities, and maintain an accurate fitness log.
         */

        $allTools = [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'updateUserAttributes',
                    'description' => 'Use this tool to add or update user attributes. This function modifies user-specific data points, such as "height", "weight", "preferred_exercises", or "dietary_restrictions". Maintaining accurate attributes helps the user receive more tailored activity suggestions, nutritional guidance, and motivational tips. For example, if the user shares their new weight or dietary preference, these attributes can be updated to refine future suggestions. This tool expects a set of key-value pairs, where keys are attribute names (strings) and values are attribute values (strings). Keys and values should be concise and descriptive. Avoid overly long or complex keys. Use this tool whenever the user provides new or updated attribute information, or requests to modify their stored attributes.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'attributes' => [
                                'type' => 'object',
                                'description' => 'An object where each key is the attribute name and each value is a string representing the attribute\'s value. For example: {"weight": "75kg", "preferred_exercises": "yoga, cycling"}',
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
                    'description' => 'Use this tool to remove specific attributes from the user\'s profile. This may be needed when the user wants to clear outdated or irrelevant information. For instance, if a user previously stored a "temporary_injury" attribute but has now recovered, you can remove it. The tool expects an array of attribute keys (strings) to be deleted. Upon completion, these attributes no longer appear in the user\'s profile.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'keys' => [
                                'type' => 'array',
                                'description' => 'A list of attribute keys to remove. Each key should be a string that corresponds to an existing user attribute.',
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
                    'description' => 'Use this tool to retrieve the user\'s activities over a specified period. This helps review the user\'s recent fitness routines, progress, and patterns. You may specify optional "from_date" and "to_date" parameters to filter results. If no dates are provided, the tool returns activities covering the entire available record. Activities are objects representing entries such as exercises or health-related tasks, each with properties: "id" (int), "date" (string, YYYY-MM-DD), "parent_id" (int or null, indicating hierarchy), "position" (int, ordering in a list), "name" (string), "description" (string), "notes" (string), "metrics" (object with custom metrics like repetitions, duration, etc.), and "completed" (bool). Use this tool to understand the user\'s past three months of activities or to narrow down activities by date to provide relevant suggestions.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'from_date' => [
                                'type' => 'string',
                                'format' => 'date',
                                'description' => 'Optional. Start date (inclusive) in YYYY-MM-DD format. If provided, only activities on or after this date are returned.'
                            ],
                            'to_date' => [
                                'type' => 'string',
                                'format' => 'date',
                                'description' => 'Optional. End date (inclusive) in YYYY-MM-DD format. If provided, only activities on or before this date are returned.'
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
                    'description' => 'Use this tool to add new activities or update existing ones in the user\'s activity log. Activities represent any recorded fitness-related action, such as "running", "bench press", or "meditation session". Each activity object must include "date" (a string in YYYY-MM-DD format) and "name" (a short, descriptive string, e.g., "Morning Run"). Optional fields include "id" (if updating an existing activity), "parent_id" (if this activity is grouped under another activity), "position" (an integer ordering within a set), "description" (a longer text), "notes" (additional user comments), "metrics" (an object storing numerical or descriptive measures like {"distance_km": 5, "duration_min": 30}), and "completed" (a boolean to indicate whether the user considers this activity done). If "completed" is true, related hierarchical updates may propagate to parent or child activities. Use this tool when the user provides new activities to log or updates details of existing activities.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'activities' => [
                                'type' => 'array',
                                'description' => 'An array of activity objects, each representing an activity to add or update.',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'id' => [
                                            'type' => 'integer',
                                            'description' => 'Optional. If provided, updates the activity with this ID; otherwise, a new activity is created.'
                                        ],
                                        'date' => [
                                            'type' => 'string',
                                            'description' => 'Required. The date of the activity in YYYY-MM-DD format.'
                                        ],
                                        'parent_id' => [
                                            'type' => ['integer', 'null'],
                                            'description' => 'Optional. The ID of a parent activity if this activity is part of a hierarchical structure. Use null if there is no parent.'
                                        ],
                                        'position' => [
                                            'type' => ['integer', 'null'],
                                            'description' => 'Optional. The position/order of this activity relative to siblings.'
                                        ],
                                        'name' => [
                                            'type' => 'string',
                                            'description' => 'Required. A short descriptive name for the activity, e.g., "Yoga Session".'
                                        ],
                                        'description' => [
                                            'type' => ['string', 'null'],
                                            'description' => 'Optional. A longer explanation of the activity, e.g., "Morning routine focusing on stretching."'
                                        ],
                                        'notes' => [
                                            'type' => ['string', 'null'],
                                            'description' => 'Optional. Additional user comments or notes about the activity.'
                                        ],
                                        'metrics' => [
                                            'type' => ['object', 'null'],
                                            'description' => 'Optional. Key-value pairs containing activity-specific metrics, e.g., {"repetitions": 20, "sets": 3}. Keys should be strings, values can be strings or numbers.',
                                            'additionalProperties' => true
                                        ],
                                        'completed' => [
                                            'type' => ['boolean', 'null'],
                                            'description' => 'Optional. Indicates if the activity is completed. If true, completion may propagate up or down the activity hierarchy.'
                                        ]
                                    ],
                                    'required' => ['date', 'name']
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
                    'description' => 'Use this tool to remove specified activities from the user\'s log. The user might remove activities that are mistakenly logged, duplicated, or no longer relevant. Provide an array of activity IDs to be deleted. Once deleted, these activities will not appear in future activity retrievals.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'activityIds' => [
                                'type' => 'array',
                                'description' => 'A list of integers representing the IDs of the activities to remove.',
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
     * Execute a specific tool based on provided arguments.
     *
     * @param int $userId The ID of the current user.
     * @param string $toolName The name of the tool to be executed.
     * @param array $arguments The arguments to pass to the tool.
     *
     * @return array The result returned by the executed tool.
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
