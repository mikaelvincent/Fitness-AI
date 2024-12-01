<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RegistrationToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rules\Password;
use App\Notifications\RegistrationTokenNotification;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class RegisteredUserController extends Controller
{
    /**
     * Initiate the registration process by accepting the user's email.
     *
     * Generates a registration token and sends a verification email containing the token.
     * The token is valid for 1 hour.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address. Example: user@example.com
     *
     * @response 200 {
     *   "message": "Registration initiated successfully."
     * }
     *
     * @response 422 {
     *   "message": "Registration initiation failed.",
     *   "errors": {
     *     "email": ["The email has already been taken."]
     *   }
     * }
     *
     * @response 429 {
     *   "message": "Too many attempts. Please try again in {retry_after} seconds.",
     *   "retry_after": 60
     * }
     */
    public function initiate(Request $request)
    {
        $email = $request->input('email');

        $throttleKey = 'registration_initiate:' . Str::lower($email) . '|' . $request->ip();

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
            ['email' => $email],
            [
                'token' => hash('sha256', $token),
                'expires_at' => now()->addHour(),
            ]
        );

        try {
            // Send the verification email
            Notification::route('mail', $email)
                ->notify(new RegistrationTokenNotification($token));
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Failed to send verification email.',
                ],
                500
            );
        }

        RateLimiter::hit($throttleKey, 60);

        return response()->json(
            [
                'message' => 'Registration initiated successfully.',
            ],
            200
        );
    }

    /**
     * Resend the verification email containing the registration token.
     *
     * Allows users to resend the verification email. Rate limiting is applied to prevent abuse.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address. Example: user@example.com
     *
     * @response 200 {
     *   "message": "Verification email resent successfully."
     * }
     *
     * @response 422 {
     *   "message": "Resend failed.",
     *   "errors": {
     *     "email": ["The email field is required."]
     *   }
     * }
     *
     * @response 429 {
     *   "message": "Too many attempts. Please try again in {retry_after} seconds.",
     *   "retry_after": 60
     * }
     */
    public function resend(Request $request)
    {
        $email = $request->input('email');

        $throttleKey = 'registration_resend:' . Str::lower($email) . '|' . $request->ip();

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
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'message' => 'Resend failed.',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        $registrationToken = RegistrationToken::where('email', $email)->first();

        if (!$registrationToken) {
            return response()->json(
                [
                    'message' => 'No registration token found for this email.',
                ],
                404
            );
        }

        // Update the token's expiration time
        $registrationToken->update([
            'expires_at' => now()->addHour(),
        ]);

        try {
            // Resend the verification email
            Notification::route('mail', $email)
                ->notify(new RegistrationTokenNotification($registrationToken->token));
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
     * Validate the registration token and return its status.
     *
     * Checks if the provided token is valid or has expired, and returns the remaining time until expiration.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam token string required The registration token to validate.
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
     *     "status": "invalid"
     *   }
     * }
     *
     * @response 422 {
     *   "message": "Validation failed.",
     *   "errors": {
     *     "token": ["The token field is required."]
     *   }
     * }
     */
    public function validateToken(Request $request)
    {
        $throttleKey = 'validate_registration_token:' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 10)) {
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

        if (!$registrationToken || $registrationToken->isExpired()) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json(
                [
                    'message' => 'Token is invalid or has expired.',
                    'data' => ['status' => 'invalid'],
                ],
                400
            );
        }

        $expiresIn = $registrationToken->timeUntilExpiration();

        RateLimiter::hit($throttleKey, 60);

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

    /**
     * Complete the registration by creating a new user account.
     *
     * Validates the registration token and creates a new user with the provided name and password.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam token string required The registration token provided via email.
     * @bodyParam name string required The user's full name. Example: John Doe
     * @bodyParam password string required The user's password.
     * @bodyParam password_confirmation string required Confirmation of the password.
     *
     * @response 201 {
     *   "message": "Registration completed successfully.",
     *   "data": {
     *     "user": {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "user@example.com",
     *       "email_verified_at": "2024-12-02T12:00:00.000000Z"
     *     },
     *     "token": "example-token"
     *   }
     * }
     *
     * @response 400 {
     *   "message": "Invalid or expired registration token."
     * }
     *
     * @response 422 {
     *   "message": "Registration failed.",
     *   "errors": {
     *     "name": ["The name field is required."]
     *   }
     * }
     *
     * @response 429 {
     *   "message": "Too many attempts. Please try again in {retry_after} seconds.",
     *   "retry_after": 60
     * }
     */
    public function store(Request $request)
    {
        $throttleKey = 'complete_registration:' . $request->ip();

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
            'token' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'message' => 'Registration failed.',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        $hashedToken = hash('sha256', $request->input('token'));
        $registrationToken = RegistrationToken::where('token', $hashedToken)->first();

        if (!$registrationToken || $registrationToken->isExpired()) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json(
                [
                    'message' => 'Invalid or expired registration token.',
                ],
                400
            );
        }

        if (User::where('email', $registrationToken->email)->exists()) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json(
                [
                    'message' => 'User already registered with this email.',
                ],
                400
            );
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $registrationToken->email,
            'password' => Hash::make($request->input('password')),
            'email_verified_at' => now(),
        ]);

        $registrationToken->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        RateLimiter::clear($throttleKey);

        return response()->json(
            [
                'message' => 'Registration completed successfully.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'email_verified_at' => $user->email_verified_at,
                    ],
                    'token' => $token,
                ],
            ],
            201
        );
    }
}
