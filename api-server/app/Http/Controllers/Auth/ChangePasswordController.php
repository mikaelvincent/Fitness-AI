<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class ChangePasswordController extends Controller
{
    /**
     * Update the authenticated user's password.
     *
     * @group Authentication
     * @authenticated
     *
     * @bodyParam current_password string required The user's current password.
     * @bodyParam password string required The new password.
     * @bodyParam password_confirmation string required Confirmation of the new password.
     *
     * @response 200 {
     *   "message": "Password updated successfully."
     * }
     *
     * @response 400 {
     *   "message": "Current password does not match."
     * }
     *
     * @response 422 {
     *   "message": "Validation failed.",
     *   "errors": {
     *     "password": [
     *       "The password must be at least 8 characters."
     *     ]
     *   }
     * }
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'message' => 'Current password does not match.',
            ], 400);
        }

        $user->forceFill([
            'password' => Hash::make($request->input('password')),
        ])->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ], 200);
    }
}
