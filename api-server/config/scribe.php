<?php

use Knuckles\Scribe\Extracting\Strategies;

return [
    "title" => null,
    "description" => "",
    "base_url" => null,

    "routes" => [
        [
            "match" => [
                "prefixes" => ["api/*"],
                "domains" => ["*"],
                "versions" => ["v1"],
            ],
            "include" => [],
            "exclude" => [],
        ],
    ],

    "type" => "static",
    "theme" => "default",

    "static" => [
        "output_path" => "../docs/api-server/docs",
    ],

    "laravel" => [
        "add_routes" => true,
        "docs_url" => "/docs",
        "assets_directory" => null,
        "middleware" => [],
    ],

    "external" => [
        "html_attributes" => [],
    ],

    "try_it_out" => [
        "enabled" => true,
        "base_url" => null,
        "use_csrf" => false,
        "csrf_url" => "/sanctum/csrf-cookie",
    ],

    "auth" => [
        "enabled" => false,
        "default" => false,
        "in" => "bearer",
        "name" => "key",
        "use_value" => env("SCRIBE_AUTH_KEY"),
        "placeholder" => "{YOUR_AUTH_KEY}",
        "extra_info" =>
            "You can retrieve your token by visiting your dashboard and clicking <b>Generate API token</b>.",
    ],

    "intro_text" => <<<INTRO
This documentation provides information you need to work with our API.

<aside>As you scroll, code examples in various programming languages are displayed on the right (or as part of the content on mobile). You can switch languages with the tabs at the top right (or from the nav menu on mobile).</aside>
INTRO
    ,
    "example_languages" => ["bash", "javascript"],

    "postman" => [
        "enabled" => true,
        "overrides" => [],
    ],

    "openapi" => [
        "enabled" => true,
        "overrides" => [],
    ],

    "groups" => [
        "default" => "Endpoints",
        "order" => [],
    ],

    "logo" => false,
    "last_updated" => null,

    "examples" => [
        "faker_seed" => null,
        "models_source" => ["factoryCreate", "factoryMake", "databaseFirst"],
    ],

    "strategies" => [
        "metadata" => [
            Strategies\Metadata\GetFromDocBlocks::class,
            Strategies\Metadata\GetFromMetadataAttributes::class,
        ],
        "urlParameters" => [
            Strategies\UrlParameters\GetFromLaravelAPI::class,
            Strategies\UrlParameters\GetFromUrlParamAttribute::class,
            Strategies\UrlParameters\GetFromUrlParamTag::class,
        ],
        "queryParameters" => [
            Strategies\QueryParameters\GetFromFormRequest::class,
            Strategies\QueryParameters\GetFromInlineValidator::class,
            Strategies\QueryParameters\GetFromQueryParamAttribute::class,
            Strategies\QueryParameters\GetFromQueryParamTag::class,
        ],
        "headers" => [
            Strategies\Headers\GetFromHeaderAttribute::class,
            Strategies\Headers\GetFromHeaderTag::class,
            [
                "override",
                [
                    "Content-Type" => "application/json",
                    "Accept" => "application/json",
                ],
            ],
        ],
        "bodyParameters" => [
            Strategies\BodyParameters\GetFromFormRequest::class,
            Strategies\BodyParameters\GetFromInlineValidator::class,
            Strategies\BodyParameters\GetFromBodyParamAttribute::class,
            Strategies\BodyParameters\GetFromBodyParamTag::class,
        ],
        "responses" => [
            Strategies\Responses\UseResponseAttributes::class,
            Strategies\Responses\UseTransformerTags::class,
            Strategies\Responses\UseApiResourceTags::class,
            Strategies\Responses\UseResponseTag::class,
            Strategies\Responses\UseResponseFileTag::class,
            [
                Strategies\Responses\ResponseCalls::class,
                [
                    "only" => ["GET *"],
                    "config" => [
                        "app.debug" => false,
                    ],
                ],
            ],
        ],
        "responseFields" => [
            Strategies\ResponseFields\GetFromResponseFieldAttribute::class,
            Strategies\ResponseFields\GetFromResponseFieldTag::class,
        ],
    ],

    "database_connections_to_transact" => [config("database.default")],
    "fractal" => [
        "serializer" => null,
    ],

    "routeMatcher" => \Knuckles\Scribe\Matching\RouteMatcher::class,
];
