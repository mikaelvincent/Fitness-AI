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
     *   "message": "Token refreshed successfully.",
     *   "data": {
     *     "token": "new-example-token"
     *   }
     * }
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();
        $newToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Token refreshed successfully.',
            'data' => [
                'token' => $newToken,
            ],
        ], 200);
    }
}
