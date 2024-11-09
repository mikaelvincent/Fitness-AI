<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @group Registration
     * @unauthenticated
     *
     * @bodyParam name string required The user's full name.
     * @bodyParam email string required The user's email address.
     * @bodyParam password string required The user's password.
     * @bodyParam password_confirmation string required Confirmation of the user's password.
     *
     * @response 201 {
     *   "message": "Registration successful.",
     *   "data": {
     *     "user": {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john@example.com",
     *       "created_at": "2023-10-01T12:34:56.000000Z",
     *       "updated_at": "2023-10-01T12:34:56.000000Z"
     *     },
     *     "token": "example-token"
     *   }
     * }
     *
     * @response 422 {
     *   "message": "Registration failed.",
     *   "errors": {
     *     "email": [
     *       "The email has already been taken."
     *     ]
     *   }
     * }
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => ["required", "string", "max:255"],
            "email" => [
                "required",
                "string",
                "email",
                "max:255",
                "unique:users",
            ],
            "password" => ["required", "confirmed", Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    "message" => "Registration failed.",
                    "errors" => $validator->errors(),
                ],
                422
            );
        }

        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
        ]);

        // Send email verification notification
        $user->sendEmailVerificationNotification();

        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json(
            [
                "message" => "Registration successful.",
                "data" => [
                    "user" => $user,
                    "token" => $token,
                ],
            ],
            201
        );
    }
}
