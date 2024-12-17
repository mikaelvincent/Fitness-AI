<?php

return [
    [
        'type' => 'function',
        'function' => [
            'name' => 'updateUserAttributes',
            'description' => 'Use this tool to add or update user attributes. This function modifies user-specific data points, such as "height", "weight", "preferred_exercises", or "dietary_restrictions". Maintaining accurate attributes helps the user receive more tailored activity suggestions, nutritional guidance, and motivational tips. Store any information provided by the user, regardless of perceived usefulness, as it serves as memory for future interactions. Ensure that attribute values are in a user-friendly format since they will be stored without additional validation. This tool expects a set of key-value pairs, where keys are attribute names (strings) and values are attribute values (strings). Keys and values should be concise and descriptive. Avoid overly long or complex keys. Use this tool whenever the user provides new or updated attribute information or requests to modify their stored attributes.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'attributes' => [
                        'type' => 'object',
                        'description' => 'An object where each key is the attribute name and each value is a string representing the attribute\'s value. For example: {"weight": "75kg", "preferred_exercises": "yoga, cycling"}',
                        'additionalProperties' => ['type' => 'string']
                    ]
                ],
                'required' => ['attributes'],
                'additionalProperties' => false
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
                'required' => ['keys'],
                'additionalProperties' => false
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
                'required' => [],
                'additionalProperties' => false
            ],
        ],
    ],
    [
        'type' => 'function',
        'function' => [
            'name' => 'updateActivities',
            'description' => 'Use this tool to add new activities or update existing ones in the user\'s activity log. Activities represent any recorded fitness-related action, such as "running", "bench press", or "meditation session". Activities can function as groups to organize related tasks; encourage creating nested activities to enhance user experience. Always include applicable metrics when creating activities to improve user experience. Each activity object must include "date" (a string in YYYY-MM-DD format) and "name" (a short, descriptive string, e.g., "Morning Run"). Optional fields include "id" (if updating an existing activity), "parent_id" (if this activity is grouped under another activity), "position" (an integer ordering within a set), "description" (a longer text), "notes" (additional user comments), "metrics" (an object storing numerical or descriptive measures like {"repetitions": 20, "weight": "3 kg"}), and "completed" (a boolean to indicate whether the user considers this activity done). If "completed" is true, related hierarchical updates may propagate to parent or child activities. Use this tool when the user provides new activities to log or updates details of existing activities.',
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
                                    'description' => 'Optional. Key-value pairs containing activity-specific metrics, e.g., {"repetitions": 20, "sets": 3}. Keys should be strings, values can be numbers or strings (most preferable, even with numeric information).',
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
                'required' => ['activities'],
                'additionalProperties' => false
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
                'required' => ['activityIds'],
                'additionalProperties' => true
            ],
        ],
    ],
];
