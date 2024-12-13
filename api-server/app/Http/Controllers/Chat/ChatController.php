<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Services\ChatContextService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class ChatController extends Controller
{
    protected ChatContextService $chatContextService;

    public function __construct(ChatContextService $chatContextService)
    {
        $this->chatContextService = $chatContextService;
    }

    /**
     * Handle a chat request to the chatbot endpoint.
     * Expects a JSON payload:
     * {
     *   "messages": [
     *     {"role": "user", "content": "Your message here"}
     *   ]
     * }
     *
     * Returns:
     * {
     *   "data": {
     *     "messages": [
     *       {"role": "assistant", "content": "Response content"}
     *     ]
     *   }
     * }
     */
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'messages' => 'required|array|min:1',
            'messages.*.role' => 'required|string',
            'messages.*.content' => 'required|string',
        ]);

        // Retrieve model from environment-driven configuration
        $model = config('openai.default_model', 'gpt-4o');

        // Retrieve context for the authenticated user
        $userId = $request->user()->id;
        $context = $this->chatContextService->getContextForUser($userId);

        // Attach context as system message
        $systemMessage = [
            'role' => 'system',
            'content' => 'User context: ' . json_encode($context),
        ];

        $messages = array_merge([$systemMessage], $validated['messages']);

        try {
            $response = OpenAI::chat()->create([
                'model' => $model,
                'messages' => $messages,
            ]);

            return response()->json([
                'data' => [
                    'messages' => [
                        [
                            'role' => 'assistant',
                            'content' => $response->choices[0]->message->content
                        ]
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('OpenAI chat request failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Chat request failed.',
                'error' => 'Unable to retrieve a response from the model.'
            ], 500);
        }
    }
}
