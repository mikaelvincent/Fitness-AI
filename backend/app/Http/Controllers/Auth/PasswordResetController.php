<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * Send a password reset link to the user's email.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Unable to send password reset link.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent.',
            ], 200);
        }

        return response()->json([
            'message' => 'Unable to send password reset link.',
        ], 500);
    }

    /**
     * Reset the user's password.
     */
    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token'                 => ['required'],
            'email'                 => ['required', 'email'],
            'password'              => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'password_confirmation' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Unable to reset password.',
                'errors'  => $validator->errors(),
            ], 422);
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
            return response()->json([
                'message' => 'Password reset successful.',
            ], 200);
        }

        return response()->json([
            'message' => 'Invalid token or email.',
        ], 400);
    }
}
