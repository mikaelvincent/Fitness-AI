<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * Handles user authentication sessions.
 */
class SessionController extends Controller
{
    /**
     * Authenticate the user and issue a token.
     *
     * Validates user credentials and issues a new API token. Requires a valid two-factor authentication code if enabled.
     *
     * @group Authentication
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address. Example: user@example.com
     * @bodyParam password string required The user's password.
     * @bodyParam two_factor_code string The two-factor authentication code if enabled.
     *
     * @response 200 {
     *   "message": "Login successful.",
     *   "data": {
     *     "user": {...},
     *     "token": "example-token"
     *   }
     * }
     *
     * @response 401 {
     *   "message": "Invalid credentials."
     * }
     *
     * @response 429 {
     *   "message": "Too many requests. Please try again later.",
     *   "retry_after": 60
     * }
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $credentials = $request->only('email', 'password');

        /** @var User $user */
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        if ($user->two_factor_secret && $user->two_factor_confirmed_at) {
            $request->validate([
                'two_factor_code' => ['required', 'string'],
            ]);

            $google2fa = new \PragmaRX\Google2FA\Google2FA();
            $secretKey = decrypt($user->two_factor_secret);

            if (!$google2fa->verifyKey($secretKey, $request->two_factor_code)) {
                return response()->json([
                    'message' => 'Invalid two-factor authentication code.',
                ], 422);
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'data' => [
                'user' => $user->only(['id', 'name', 'email', 'email_verified_at']),
                'token' => $token,
            ],
        ], 200);
    }

    /**
     * Logout the authenticated user.
     *
     * Revokes the user's current authentication token.
     *
     * @group Authentication
     * @authenticated
     *
     * @response 200 {
     *   "message": "Logout successful."
     * }
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful.',
        ], 200);
    }
}
