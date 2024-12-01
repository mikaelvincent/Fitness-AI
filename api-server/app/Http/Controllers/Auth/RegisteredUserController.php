<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RegistrationToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

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

        return response()->json(
            [
                'message' => 'Registration initiated successfully.',
            ],
            200
        );
    }
}
