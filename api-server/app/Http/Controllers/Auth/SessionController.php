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
     *   "message": "Login successful. You are now authenticated.",
     *   "data": {
     *     "token": "example-token"
     *   }
     * }
     *
     * @response 401 {
     *   "message": "Invalid email or password provided."
     * }
     *
     * @response 422 {
     *   "message": "The two-factor authentication code is invalid."
     * }
     *
     * @response 429 {
     *   "message": "You have exceeded the maximum number of attempts. Please try again in 60 seconds.",
     *   "retry_after": 60
     * }
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $credentials = $request->only('email', 'password');

        /** @var User $user */
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password provided.',
            ], 401);
        }

        if ($user->two_factor_secret && $user->two_factor_confirmed_at) {
            $request->validate([
                'two_factor_code' => ['required', 'string'],
            ]);

            $twoFactorCode = $request->input('two_factor_code');
            $google2fa     = new \PragmaRX\Google2FA\Google2FA();

            try {
                $secretKey = decrypt($user->two_factor_secret);
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                return response()->json([
                    'message' => 'Invalid two-factor authentication secret.',
                ], 500);
            }

            // Verify the two-factor authentication code
            if (! $google2fa->verifyKey($secretKey, $twoFactorCode)) {
                // Check if the provided code matches a recovery code
                $recoveryCodes = [];
                if ($user->two_factor_recovery_codes) {
                    try {
                        $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);
                    } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                        return response()->json([
                            'message' => 'Invalid two-factor recovery codes.',
                        ], 500);
                    }
                }

                if (in_array($twoFactorCode, $recoveryCodes)) {
                    // Invalidate the used recovery code
                    $remainingCodes = array_diff($recoveryCodes, [$twoFactorCode]);
                    $user->forceFill([
                        'two_factor_recovery_codes' => encrypt(json_encode($remainingCodes)),
                    ])->save();
                } else {
                    return response()->json([
                        'message' => 'The two-factor authentication code is invalid.',
                    ], 422);
                }
            }
        }

        // Create token with expiration
        $tokenResult = $user->createToken('auth_token');
        $tokenResult->token->expires_at = now()->addMinutes(config('sanctum.expiration', 60));
        $tokenResult->token->save();
        $token = $tokenResult->plainTextToken;

        return response()->json([
            'message' => 'Login successful. You are now authenticated.',
            'data' => [
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
     *   "message": "You have been successfully logged out."
     * }
     *
     * @response 429 {
     *   "message": "You have exceeded the maximum number of attempts. Please try again in 60 seconds.",
     *   "retry_after": 60
     * }
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'You have been successfully logged out.',
        ], 200);
    }
}
