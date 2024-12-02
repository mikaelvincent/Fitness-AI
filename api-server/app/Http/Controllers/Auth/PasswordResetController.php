<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

/**
 * Handles password reset requests and operations.
 */
class PasswordResetController extends Controller
{
    /**
     * Send a password reset link to the user's email.
     *
     * Initiates the password reset process by emailing a reset link to the user.
     * A generic response is returned regardless of whether the email exists.
     * Additional rate limiting is applied to prevent abuse.
     *
     * @group Password Management
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address. Example: user@example.com
     *
     * @response 200 {
     *   "message": "If your email exists in our system, a password reset link has been sent."
     * }
     *
     * @response 422 {
     *   "message": "Unable to send password reset link.",
     *   "errors": {
     *     "email": ["The email field is required.", "The email must be a valid email address."]
     *   }
     * }
     *
     * @response 429 {
     *   "message": "Too many attempts. Please try again in {retry_after} seconds.",
     *   "retry_after": 60
     * }
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function sendResetLinkEmail(Request $request)
    {
        $email = Str::lower($request->input('email'));
        $throttleKey = 'password_reset:' . $email . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json(
                [
                    'message' => 'Too many attempts. Please try again in ' . $seconds . ' seconds.',
                    'retry_after' => $seconds,
                ],
                429
            );
        }

        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json(
                [
                    'message' => 'Unable to send password reset link.',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        // Attempt to send the password reset link
        Password::sendResetLink(['email' => $email]);

        RateLimiter::hit($throttleKey, 60);

        return response()->json(
            [
                'message' => 'If your email exists in our system, a password reset link has been sent.',
            ],
            200
        );
    }

    /**
     * Reset the user's password using the provided token.
     *
     * Validates the token and updates the user's password. Rate limiting is applied to prevent abuse.
     *
     * @group Password Management
     * @unauthenticated
     *
     * @bodyParam token string required The password reset token.
     * @bodyParam email string required The user's email address. Example: user@example.com
     * @bodyParam password string required The new password.
     * @bodyParam password_confirmation string required Confirmation of the new password.
     *
     * @response 200 {
     *   "message": "Password reset successful."
     * }
     *
     * @response 400 {
     *   "message": "Invalid token or email."
     * }
     *
     * @response 422 {
     *   "message": "Unable to reset password.",
     *   "errors": {
     *     "email": ["The email field is required.", "The email must be a valid email address."],
     *     "password": ["The password must be at least 8 characters."]
     *   }
     * }
     *
     * @response 429 {
     *   "message": "Too many attempts. Please try again in {retry_after} seconds.",
     *   "retry_after": 60
     * }
     */
    public function reset(Request $request)
    {
        $throttleKey = 'reset_password:' . Str::lower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json(
                [
                    'message' => 'Too many attempts. Please try again in ' . $seconds . ' seconds.',
                    'retry_after' => $seconds,
                ],
                429
            );
        }

        $validator = Validator::make($request->all(), [
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => [
                'required',
                'confirmed',
                \Illuminate\Validation\Rules\Password::defaults(),
            ],
            'password_confirmation' => ['required'],
        ]);

        if ($validator->fails()) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json(
                [
                    'message' => 'Unable to reset password.',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            RateLimiter::clear($throttleKey);
            return response()->json(
                [
                    'message' => 'Password reset successful.',
                ],
                200
            );
        }

        RateLimiter::hit($throttleKey, 60);

        return response()->json(
            [
                'message' => 'Invalid token or email.',
            ],
            400
        );
    }
}
