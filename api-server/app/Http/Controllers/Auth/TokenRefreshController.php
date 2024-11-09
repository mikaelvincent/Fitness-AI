<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TokenRefreshController extends Controller
{
    /**
     * Refresh the user's authentication token.
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
     *
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Revoke the current token to prevent misuse
        $currentToken = $user->currentAccessToken();
        if ($currentToken) {
            $currentToken->delete();
        }

        // Create a new token
        $newToken = $user->createToken("auth_token")->plainTextToken;

        return response()->json(
            [
                "message" => "Token refreshed successfully.",
                "data" => [
                    "token" => $newToken,
                ],
            ],
            200
        );
    }
}
