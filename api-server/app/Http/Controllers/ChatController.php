<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
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

        try {
            $response = OpenAI::chat()->create([
                'model' => $model,
                'messages' => $validated['messages'],
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
