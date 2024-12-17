<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Services\ChatService;
use App\Services\ChatContextService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;

class ChatController extends Controller
{
    protected ChatService $chatService;
    protected ChatContextService $chatContextService;

    /**
     * @param ChatService $chatService
     * @param ChatContextService $chatContextService
     */
    public function __construct(
        ChatService $chatService,
        ChatContextService $chatContextService
    ) {
        $this->chatService = $chatService;
        $this->chatContextService = $chatContextService;
    }

    /**
     * Handle chat requests.
     * @authenticated
     *
     * Expected request format:
     * {
     *   "messages": [
     *     {"role": "user", "content": "User query..."},
     *     {"role": "assistant", "content": "Previous assistant response"}
     *   ],
     *   "stream": true, // Optional: Enable streaming
     *   "tools": ["updateActivities"] // Optional: Specify tools
     * }
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function handle(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'messages' => ['required', 'array'],
            'messages.*.role' => ['required', 'string', 'in:user,assistant'],
            'messages.*.content' => ['required', 'string'],
            'stream' => ['sometimes', 'boolean'],
            'tools' => ['sometimes', 'array'],
            'tools.*' => ['string', 'in:updateUserAttributes,deleteUserAttributes,getActivities,updateActivities,deleteActivities'],
        ]);

        if ($validator->fails()) {
            Log::warning('Chat request validation failed.', [
                'user_id' => $request->user() ? $request->user()->id : null,
                'errors' => $validator->errors()->toArray()
            ]);

            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        Log::info('Received chat request.', [
            'user_id' => $request->user() ? $request->user()->id : null,
            'messages' => $validated['messages'],
            'stream' => $validated['stream'] ?? false,
            'tools' => $validated['tools'] ?? []
        ]);

        try {
            $context = $this->chatContextService->getContext($request->user()->id);
            $stream = $validated['stream'] ?? false;
            $tools = $validated['tools'] ?? [];
            $userMessages = $validated['messages'];

            $response = $this->chatService->getResponse(
                $request->user()->id,
                $userMessages,
                $context,
                $stream,
                $tools
            );

            if ($stream) {
                return response()->stream(function () use ($response) {
                    foreach ($response as $chunk) {
                        echo $chunk;
                        ob_flush();
                        flush();
                    }
                }, 200, [
                    'Content-Type' => 'text/event-stream',
                    'Cache-Control' => 'no-cache',
                    'Connection' => 'keep-alive',
                ]);
            }

            Log::info('Chat response generated successfully.', [
                'user_id' => $request->user()->id,
            ]);

            $executedToolCalls = $response['executed_tool_calls'] ?? [];
            $executedToolCalls = array_map(function ($call) {
                unset($call['result']);
                return $call;
            }, $executedToolCalls);

            return response()->json([
                'message' => 'Chat response generated successfully.',
                'data' => [
                    'response' => $response['response'] ?? null,
                    'executed_tool_calls' => $executedToolCalls
                ],
            ], 200);

        } catch (Exception $e) {
            Log::error('Chat request processing failed.', [
                'user_id' => $request->user() ? $request->user()->id : null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'An error occurred while processing your request. Please try again later.'
            ], 500);
        }
    }
}
