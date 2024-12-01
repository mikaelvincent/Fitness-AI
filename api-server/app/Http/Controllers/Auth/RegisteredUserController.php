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

class RegisteredUserController extends Controller
{
    /**
     * Initiate the registration process with email only.
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
     * Validate the registration token.
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
     * Complete the user registration by providing name and password.
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
