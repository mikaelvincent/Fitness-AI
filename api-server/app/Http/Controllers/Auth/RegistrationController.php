<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RegistrationToken;
use App\Notifications\RegistrationTokenNotification;
use App\Services\UserAttributeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

/**
 * Handles user registration processes.
 */
class RegistrationController extends Controller
{
    protected UserAttributeService $attributeService;

    /**
     * Constructor.
     *
     * @param UserAttributeService $attributeService
     */
    public function __construct(UserAttributeService $attributeService)
    {
        $this->attributeService = $attributeService;
    }

    /**
     * Initiate the registration process.
     *
     * Generates a registration token and sends a verification email.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address.
     * @bodyParam user_attributes object optional Key-value pairs of user attributes.
     *
     * @response 200 {
     *   "message": "Registration process has been initiated. Please check your email for further instructions."
     * }
     *
     * @response 429 {
     *   "message": "You have exceeded the maximum number of attempts. Please try again in 60 seconds.",
     *   "retry_after": 60
     * }
     */
    public function initiate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'unique:users'],
            'user_attributes' => ['nullable', 'array'],
            'user_attributes.*' => ['string', 'max:255'],
        ]);

        $validator->after(function ($validator) use ($request) {
            $attributes = $request->input('user_attributes');
            if (is_array($attributes)) {
                foreach ($attributes as $key => $value) {
                    if (!is_string($key)) {
                        $validator->errors()->add('user_attributes', 'All attribute keys must be strings.');
                        break;
                    }
                    if (mb_strlen($key) > 255) {
                        $validator->errors()->add('user_attributes.' . $key, 'Attribute keys may not be greater than 255 characters.');
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $token = Str::random(60);

        RegistrationToken::updateOrCreate(
            ['email' => $request->email],
            [
                'token' => hash('sha256', $token),
                'expires_at' => now()->addHour(),
                'user_attributes' => $request->input('user_attributes'),
            ]
        );

        Notification::route('mail', $request->email)
            ->notify(new RegistrationTokenNotification($token));

        return response()->json([
            'message' => 'Registration process has been initiated. Please check your email for further instructions.',
        ], 200);
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
     *   "message": "A new verification email has been sent to your address."
     * }
     *
     * @response 429 {
     *   "message": "You have exceeded the maximum number of attempts. Please try again in 60 seconds.",
     *   "retry_after": 60
     * }
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $registrationToken = RegistrationToken::where('email', $request->email)->firstOrFail();

        $registrationToken->update([
            'expires_at' => now()->addHour(),
        ]);

        Notification::route('mail', $request->email)
            ->notify(new RegistrationTokenNotification($registrationToken->token));

        return response()->json([
            'message' => 'A new verification email has been sent to your address.',
        ], 200);
    }

    /**
     * Validate the registration token.
     *
     * Checks if the provided token is valid or has expired.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam token string required The registration token.
     *
     * @response 200 {
     *   "message": "The registration token is valid.",
     *   "data": {
     *     "expires_in": 3600
     *   }
     * }
     *
     * @response 400 {
     *   "message": "The registration token is invalid or has expired."
     * }
     *
     * @response 429 {
     *   "message": "You have exceeded the maximum number of attempts. Please try again in 60 seconds.",
     *   "retry_after": 60
     * }
     */
    public function validateToken(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
        ]);

        $hashedToken = hash('sha256', $request->token);
        $registrationToken = RegistrationToken::where('token', $hashedToken)->firstOrFail();

        if ($registrationToken->isExpired()) {
            return response()->json([
                'message' => 'The registration token is invalid or has expired.',
            ], 400);
        }

        return response()->json([
            'message' => 'The registration token is valid.',
            'data' => [
                'expires_in' => $registrationToken->timeUntilExpiration(),
            ],
        ], 200);
    }

    /**
     * Complete the registration by creating a new user.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam token string required The registration token.
     * @bodyParam name string required The user's full name.
     * @bodyParam password string required The user's password.
     * @bodyParam password_confirmation string required Confirmation of the password.
     *
     * @response 201 {
     *   "message": "Registration completed successfully. Welcome aboard!",
     *   "data": {
     *     "token": "example-token"
     *   }
     * }
     *
     * @response 400 {
     *   "message": "The registration token provided is invalid or has expired."
     * }
     *
     * @response 429 {
     *   "message": "You have exceeded the maximum number of attempts. Please try again in 60 seconds.",
     *   "retry_after": 60
     * }
     */
    public function complete(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $hashedToken = hash('sha256', $request->token);
        $registrationToken = RegistrationToken::where('token', $hashedToken)->firstOrFail();

        if ($registrationToken->isExpired()) {
            return response()->json([
                'message' => 'The registration token provided is invalid or has expired.',
            ], 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $registrationToken->email,
            'password' => Hash::make($request->password),
        ]);

        if (!empty($registrationToken->user_attributes)) {
            $this->attributeService->updateAttributes($user->id, $registrationToken->user_attributes);
        }

        $registrationToken->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration completed successfully. Welcome aboard!',
            'data' => [
                'token' => $token,
            ],
        ], 201);
    }
}
