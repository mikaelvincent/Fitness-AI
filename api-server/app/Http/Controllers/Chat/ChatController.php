<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessChatRequest;
use App\Services\ChatContextService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Exception;

class ChatController extends Controller
{
    protected ChatContextService $chatContextService;

    /**
     * Constructor.
     */
    public function __construct(ChatContextService $chatContextService)
    {
        $this->chatContextService = $chatContextService;
    }

    /**
     * Handle chat requests.
     * @authenticated
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
                'user_id' => $request->user()->id ?? null,
                'errors' => $validator->errors()->toArray(),
            ]);

            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        try {
            $context = $this->chatContextService->getContext($request->user()->id);
            $stream = $validated['stream'] ?? false;
            $tools = $validated['tools'] ?? [];
            $userMessages = $validated['messages'];

            // Dispatch the job to process the chat request asynchronously
            ProcessChatRequest::dispatch(
                $request->user()->id,
                $userMessages,
                $context,
                $stream,
                $tools
            );

            // Return an immediate response indicating that processing has started
            return response()->json([
                'message' => 'Your request is being processed.',
            ], 202);
        } catch (Exception $e) {
            Log::error('Chat request processing failed.', [
                'user_id' => $request->user()->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'An error occurred while processing your request. Please try again later.',
            ], 500);
        }
    }

    /**
     * Retrieve the chat response for the authenticated user.
     * @authenticated
     */
    public function getResponse(Request $request)
    {
        $userId = $request->user()->id;
        $response = Cache::get("chat_response_{$userId}");

        if ($response) {
            // Remove the response from cache after retrieval
            Cache::forget("chat_response_{$userId}");

            return response()->json([
                'message' => 'Chat response retrieved successfully.',
                'data' => $response,
            ], 200);
        }

        return response()->json([
            'message' => 'Your response is not ready yet.',
        ], 202);
    }
}
