<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming login request.
     *
     * @group Authentication
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address.
     * @bodyParam password string required The user's password.
     * @bodyParam two_factor_code string The two-factor authentication code (if applicable).
     *
     * @response 200 {
     *   "message": "Login successful.",
     *   "data": {
     *     "user": {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john@example.com",
     *       "email_verified_at": "2023-10-01T12:34:56.000000Z"
     *     },
     *     "token": "example-token"
     *   }
     * }
     *
     * @response 401 {
     *   "message": "Invalid credentials."
     * }
     *
     * @response 403 {
     *   "message": "Email address is not verified."
     * }
     *
     * @response 422 {
     *   "message": "Invalid two-factor authentication code."
     * }
     *
     * @response 429 {
     *   "message": "Too many login attempts. Please try again in {retry_after} seconds.",
     *   "retry_after": 60
     * }
     */
    public function store(Request $request)
    {
        $request->validate([
            "email" => ["required", "email"],
            "password" => ["required"],
        ]);

        $throttleKey =
            Str::lower($request->input("email")) . "|" . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json(
                [
                    "message" =>
                        "Too many login attempts. Please try again in " .
                        $seconds .
                        " seconds.",
                    "retry_after" => $seconds,
                ],
                429
            );
        }

        $credentials = $request->only("email", "password");

        /** @var User $user */
        $user = User::where("email", $credentials["email"])->first();

        if (!$user || !Hash::check($credentials["password"], $user->password)) {
            RateLimiter::hit($throttleKey);
            return response()->json(
                [
                    "message" => "Invalid credentials.",
                ],
                401
            );
        }

        // Check if the user's email is verified
        if (!$user->hasVerifiedEmail()) {
            RateLimiter::clear($throttleKey);
            return response()->json(
                [
                    "message" => "Email address is not verified.",
                ],
                403
            );
        }

        // Check if two-factor authentication is enabled and confirmed
        if ($user->two_factor_secret && $user->two_factor_confirmed_at) {
            $request->validate([
                "two_factor_code" => ["required", "string"],
            ]);

            $google2fa = new Google2FA();
            $secretKey = decrypt($user->two_factor_secret);

            $valid = $google2fa->verifyKey(
                $secretKey,
                $request->two_factor_code
            );

            if (!$valid) {
                RateLimiter::hit($throttleKey);
                return response()->json(
                    [
                        "message" => "Invalid two-factor authentication code.",
                    ],
                    422
                );
            }
        }

        RateLimiter::clear($throttleKey);

        // Create a new API token for the user
        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json(
            [
                "message" => "Login successful.",
                "data" => [
                    "user" => [
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "email_verified_at" => $user->email_verified_at,
                    ],
                    "token" => $token,
                ],
            ],
            200
        );
    }

    /**
     * Handle an incoming logout request.
     *
     * @group Authentication
     * @authenticated
     *
     * @response 200 {
     *   "message": "Logout successful."
     * }
     */
    public function destroy(Request $request)
    {
        $request
            ->user()
            ->currentAccessToken()
            ->delete();

        return response()->json(
            [
                "message" => "Logout successful.",
            ],
            200
        );
    }
}