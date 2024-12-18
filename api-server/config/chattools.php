<?php
return [
    [
        'type' => 'function',
        'function' => [
            'name' => 'updateUserAttributes',
            'description' => 'Adds or updates user attributes to enhance chat responses and personalized recommendations. These attributes serve as context in future interactions. Include any information about the user, even if not immediately relevant, including opinions or observations about the user. Strive to keep the user attributes updated by adding and updating as much pertinent information as possible. Avoid making repetitive or redundant updates.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'attributes' => [
                        'type' => 'object',
                        'description' => 'An object containing key-value pairs of attributes to update or add. Both keys (attribute name) and values should be strings. For example: {"age": "30", "Fitness Level": "intermediate", "Preferred Exercises": "yoga, cycling", "Current Illnesses": "dengue fever since first week of November 2024, last updated 2024-11-16"}. Ensure keys and values are in a user-friendly format; they will be displayed without additional validation.',
                        'additionalProperties' => [
                            'type' => 'string',
                        ],
                    ],
                ],
                'required' => ['attributes'],
                'additionalProperties' => false,
            ],
        ],
    ],
    [
        'type' => 'function',
        'function' => [
            'name' => 'deleteUserAttributes',
            'description' => 'Removes specific attributes from the user\'s profile. Regularly delete outdated or inaccurate information to keep user attributes current, especially if not replaced with new data.',
            'strict' => true,
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'keys' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'string',
                        ],
                        'description' => 'An array of attribute keys (strings) to remove. Each key should correspond to an existing user attribute.',
                    ],
                ],
                'required' => ['keys'],
                'additionalProperties' => false,
            ],
        ],
    ],
    [
        'type' => 'function',
        'function' => [
            'name' => 'getActivities',
            'description' => 'Retrieves the user\'s activities over a specified date range. Use this to access additional context beyond the current interaction.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'from_date' => [
                        'type' => ['string', 'null'],
                        'format' => 'date',
                        'description' => 'Start date (inclusive) in YYYY-MM-DD format. If provided, only activities on or after this date are returned.',
                    ],
                    'to_date' => [
                        'type' => ['string', 'null'],
                        'format' => 'date',
                        'description' => 'End date (inclusive) in YYYY-MM-DD format. If provided, only activities on or before this date are returned.',
                    ],
                ],
                'required' => [],
                'additionalProperties' => false,
            ],
        ],
    ],
    [
        'type' => 'function',
        'function' => [
            'name' => 'updateActivities',
            'description' => 'Adds new activities or updates existing ones in the user\'s activity log. Supports nested activities for better organization. Activities can represent tasks or groups via nesting. Lean towards creating nested structures by breaking down activities into specific, non-divisible tasks. Always confirm with the user before proceeding to call this tool unless explicitly instructed. Modifying an activity\'s date or completion status within a hierarchy may impact related parent or child activities. Multiple consecutive tool calls are allowed and are necessary to create nested structures.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'activities' => [
                        'type' => 'array',
                        'description' => 'An array of activity objects to add or update.',
                        'items' => [
                            'type' => 'object',
                            'properties' => [
                                'id' => [
                                    'type' => ['integer', 'null'],
                                    'description' => 'If provided, updates the activity with this ID; otherwise, a new activity is created.',
                                ],
                                'date' => [
                                    'type' => 'string',
                                    'format' => 'date',
                                    'description' => 'The date of the activity in YYYY-MM-DD format.',
                                ],
                                'parent_id' => [
                                    'type' => ['integer', 'null'],
                                    'description' => 'The ID of a parent activity if this activity is part of a hierarchy.',
                                ],
                                'position' => [
                                    'type' => ['integer', 'null'],
                                    'description' => 'The position/order of this activity relative to siblings.',
                                ],
                                'name' => [
                                    'type' => 'string',
                                    'description' => 'A short descriptive name for the activity, e.g., "Yoga Session".',
                                ],
                                'description' => [
                                    'type' => ['string', 'null'],
                                    'description' => 'A short description or purpose of the activity, such as "A scenic walk at the park" or "To elevate your heart rate".',
                                ],
                                'notes' => [
                                    'type' => ['string', 'null'],
                                    'description' => 'Additional comments or notes about the activity, usable for any purpose by the user or assistant. Can include specific details, instructions, or personal reflections.',
                                ],
                                'metrics' => [
                                    'type' => ['object', 'null'],
                                    'description' => 'Key-value pairs containing activity-specific metrics. Both keys and values are strings. For example: {"repetitions": "20", "sets": "3"}.',
                                    'additionalProperties' => [
                                        'type' => 'string',
                                    ],
                                ],
                                'completed' => [
                                    'type' => ['boolean', 'null'],
                                    'description' => 'Indicates if the activity is completed.',
                                ],
                            ],
                            'required' => ['date', 'name'],
                            'additionalProperties' => false,
                        ],
                    ],
                ],
                'required' => ['activities'],
                'additionalProperties' => false,
            ],
        ],
    ],
    [
        'type' => 'function',
        'function' => [
            'name' => 'deleteActivities',
            'description' => 'Removes specified activities from the user\'s activity log. Deleting an activity will also remove any sub-activities nested within it. Always confirm with the user before proceeding unless explicitly instructed to delete activities.',
            'strict' => true,
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'activityIds' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'integer',
                        ],
                        'description' => 'An array of activity IDs (integers) to remove.',
                    ],
                ],
                'required' => ['activityIds'],
                'additionalProperties' => false,
            ],
        ],
    ],
];
