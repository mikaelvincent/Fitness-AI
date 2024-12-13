<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Services\ChatService;
use App\Services\ChatContextService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
     *
     * Expected request format:
     * {
     *   "message": "User query...",
     *   "stream": true, // Optional: Enable streaming
     *   "tools": ["getUserAttributes", "updateActivities"] // Optional: Specify tools
     * }
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => ['required', 'string'],
            'stream' => ['sometimes', 'boolean'],
            'tools' => ['sometimes', 'array'],
            'tools.*' => ['string', 'in:getUserAttributes,updateUserAttributes,deleteUserAttributes,getActivities,updateActivities,deleteActivities'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        $context = $this->chatContextService->getContext($request->user()->id);
        $stream = $validated['stream'] ?? false;
        $tools = $validated['tools'] ?? [];

        $response = $this->chatService->getResponse(
            $request->user()->id,
            $validated['message'],
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

        return response()->json([
            'message' => 'Chat response generated successfully.',
            'data' => [
                'response' => $response,
            ],
        ], 200);
    }
}
