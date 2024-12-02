<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password as PasswordRule;

/**
 * Handles password-related actions.
 */
class PasswordController extends Controller
{
    /**
     * Send a password reset link to the user's email.
     *
     * Initiates the password reset process by emailing a reset link to the user.
     *
     * @group Password Management
     * @unauthenticated
     *
     * @bodyParam email string required The user's email address.
     *
     * @response 200 {
     *   "message": "If your email exists in our system, a password reset link has been sent."
     * }
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => 'If your email exists in our system, a password reset link has been sent.',
        ], 200);
    }

    /**
     * Reset the user's password.
     *
     * Validates the token and resets the user's password.
     *
     * @group Password Management
     * @unauthenticated
     *
     * @bodyParam token string required The password reset token.
     * @bodyParam email string required The user's email address.
     * @bodyParam password string required The new password.
     * @bodyParam password_confirmation string required Confirmation of the new password.
     *
     * @response 200 {
     *   "message": "Password reset successful."
     * }
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

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
            return response()->json([
                'message' => 'Password reset successful.',
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid token or email.',
        ], 400);
    }

    /**
     * Change the authenticated user's password.
     *
     * Updates the user's password after validating the current password.
     *
     * @group Password Management
     * @authenticated
     *
     * @bodyParam current_password string required The user's current password.
     * @bodyParam password string required The new password.
     * @bodyParam password_confirmation string required Confirmation of the new password.
     *
     * @response 200 {
     *   "message": "Password updated successfully."
     * }
     */
    public function change(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        if (!Hash::check($request->current_password, $request->user()->password)) {
            return response()->json([
                'message' => 'Current password does not match.',
            ], 400);
        }

        $request->user()->forceFill([
            'password' => Hash::make($request->password),
        ])->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ], 200);
    }
}
