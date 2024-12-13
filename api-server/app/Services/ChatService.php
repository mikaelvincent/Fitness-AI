<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;
use Exception;

class ChatService
{
    /**
     * Generate a chat response from the model.
     *
     * @param string $message
     * @param array $context
     * @return string
     */
    public function getResponse(string $message, array $context): string
    {
        $model = env('GPT_MODEL', 'gpt-4o');
        $fallbackModel = env('GPT_FALLBACK_MODEL', 'gpt-3.5-turbo');

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
            [
                'role' => 'user',
                'content' => $message,
            ],
        ];

        try {
            $response = OpenAI::chat()->create([
                'model' => $model,
                'messages' => $messages,
            ]);
        } catch (Exception $e) {
            Log::error('OpenAI request failed: ' . $e->getMessage());

            // Attempt fallback model
            try {
                $response = OpenAI::chat()->create([
                    'model' => $fallbackModel,
                    'messages' => $messages,
                ]);
            } catch (Exception $fallbackException) {
                Log::error('Fallback model request failed: ' . $fallbackException->getMessage());
                return 'An error occurred while processing your request. Please try again later.';
            }
        }

        if (!isset($response->choices[0]->message->content)) {
            return 'No response generated. Please try again.';
        }

        return trim($response->choices[0]->message->content);
    }
}
