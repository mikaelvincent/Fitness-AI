<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Handles token refresh operations.
 */
class TokenController extends Controller
{
    /**
     * Refresh the authentication token.
     *
     * Revokes the current token and issues a new one.
     *
     * @group Authentication
     * @authenticated
     *
     * @response 200 {
     *   "message": "Your authentication token has been refreshed successfully.",
     *   "data": {
     *     "token": "new-example-token"
     *   }
     * }
     * 
     * @response 429 {
     *   "message": "You have exceeded the maximum number of attempts. Please try again in 60 seconds.",
     *   "retry_after": 60
     * }
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();
        $newToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Your authentication token has been refreshed successfully.',
            'data' => [
                'token' => $newToken,
            ],
        ], 200);
    }
}
