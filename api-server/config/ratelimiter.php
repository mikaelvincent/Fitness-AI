<?php

return [
    'defaults' => [
        'max_attempts' => 60,
        'decay_seconds' => 60,
    ],

    'limiters' => [
        'global' => [
            'max_attempts' => 1000,
            'decay_seconds' => 60,
        ],
        'authentication' => [
            'max_attempts' => 5,
            'decay_seconds' => 60,
        ],
        'password_reset' => [
            'max_attempts' => 5,
            'decay_seconds' => 60,
        ],
        'registration' => [
            'max_attempts' => 5,
            'decay_seconds' => 60,
        ],
    ],
];
