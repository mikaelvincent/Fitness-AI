<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RegistrationToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use App\Notifications\RegistrationTokenNotification;

class RegisteredUserController extends Controller
{
    /**
     * Initiate the registration process with email only.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address.
     *
     * @response 200 {
     *   "message": "Registration initiated successfully."
     * }
     *
     * @response 422 {
     *   "message": "Registration initiation failed.",
     *   "errors": {
     *     "email": [
     *       "The email has already been taken."
     *     ]
     *   }
     * }
     *
     * @response 500 {
     *   "message": "Failed to send verification email."
     * }
     */
    public function initiate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'message' => 'Registration initiation failed.',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        // Generate a unique token
        $token = Str::random(60);

        // Store the token securely in the database
        RegistrationToken::updateOrCreate(
            ['email' => $request->email],
            [
                'token' => hash('sha256', $token),
                'expires_at' => now()->addHour(),
            ]
        );

        try {
            // Send the verification email
            Notification::route('mail', $request->email)
                ->notify(new RegistrationTokenNotification($token));
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Failed to send verification email.',
                ],
                500
            );
        }

        return response()->json(
            [
                'message' => 'Registration initiated successfully.',
            ],
            200
        );
    }

    /**
     * Resend the registration verification email.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address.
     *
     * @response 200 {
     *   "message": "Verification email resent successfully."
     * }
     *
     * @response 404 {
     *   "message": "Registration token not found."
     * }
     *
     * @response 429 {
     *   "message": "Too many resend attempts. Please try again later."
     * }
     *
     * @response 500 {
     *   "message": "Failed to resend verification email."
     * }
     */
    public function resend(Request $request)
    {
        $email = $request->input('email');

        $validator = Validator::make($request->all(), [
            'email' => [
                'required',
                'email',
                'string',
                'max:255',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'message' => 'Invalid email address.',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        $throttleKey = 'resend_verification_email:' . Str::lower($email) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json(
                [
                    'message' => 'Too many resend attempts. Please try again in ' . $seconds . ' seconds.',
                    'retry_after' => $seconds,
                ],
                429
            );
        }

        $registrationToken = RegistrationToken::where('email', $email)->first();

        if (!$registrationToken) {
            return response()->json(
                [
                    'message' => 'Registration token not found.',
                ],
                404
            );
        }

        // Generate a new token
        $token = Str::random(60);

        // Update the token's expiration time
        $registrationToken->update([
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
        ]);

        try {
            // Send the verification email
            Notification::route('mail', $email)
                ->notify(new RegistrationTokenNotification($token));
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Failed to resend verification email.',
                ],
                500
            );
        }

        RateLimiter::hit($throttleKey, 60);

        return response()->json(
            [
                'message' => 'Verification email resent successfully.',
            ],
            200
        );
    }

    /**
     * Validate the registration token.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam token string required The registration token.
     *
     * @response 200 {
     *   "message": "Token is valid.",
     *   "data": {
     *     "status": "valid",
     *     "expires_in": 3600
     *   }
     * }
     *
     * @response 400 {
     *   "message": "Token is invalid or has expired.",
     *   "data": {
     *     "status": "expired"
     *   }
     * }
     *
     * @response 422 {
     *   "message": "Validation failed.",
     *   "errors": {
     *     "token": [
     *       "The token field is required."
     *     ]
     *   }
     * }
     */
    public function validateToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        $hashedToken = hash('sha256', $request->token);
        $registrationToken = RegistrationToken::where('token', $hashedToken)->first();

        if (!$registrationToken) {
            return response()->json(
                [
                    'message' => 'Token is invalid or has expired.',
                    'data' => ['status' => 'invalid'],
                ],
                400
            );
        }

        if ($registrationToken->isExpired()) {
            return response()->json(
                [
                    'message' => 'Token is invalid or has expired.',
                    'data' => ['status' => 'expired'],
                ],
                400
            );
        }

        $expiresIn = $registrationToken->timeUntilExpiration();

        return response()->json(
            [
                'message' => 'Token is valid.',
                'data' => [
                    'status' => 'valid',
                    'expires_in' => $expiresIn,
                ],
            ],
            200
        );
    }
}
