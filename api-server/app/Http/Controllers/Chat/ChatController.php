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
     *   "message": "User query..."
     * }
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $context = $this->chatContextService->getContext($request->user()->id);
        $response = $this->chatService->getResponse($validator->validated()['message'], $context);

        return response()->json([
            'message' => 'Chat response generated successfully.',
            'data' => [
                'response' => $response,
            ],
        ], 200);
    }
}
