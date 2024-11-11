<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;

class EmailVerificationController extends Controller
{
    /**
     * Send a new email verification notification.
     *
     * @group Email Verification
     * @authenticated
     *
     * @response 200 {
     *   "message": "Verification email sent."
     * }
     *
     * @response 400 {
     *   "message": "Email address already verified."
     * }
     */
    public function sendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(
                [
                    "message" => "Email address already verified.",
                ],
                400
            );
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(
            [
                "message" => "Verification email sent.",
            ],
            200
        );
    }

    /**
     * Verify the user's email address.
     *
     * @group Email Verification
     * @unauthenticated
     *
     * @urlParam id integer required The user's ID.
     * @urlParam hash string required The email verification hash.
     *
     * @response 200 {
     *   "message": "Email verified successfully."
     * }
     *
     * @response 400 {
     *   "message": "Invalid verification link."
     * }
     *
     * @response 400 {
     *   "message": "Email address already verified."
     * }
     */
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (
            !hash_equals((string) $hash, sha1($user->getEmailForVerification()))
        ) {
            return response()->json(
                [
                    "message" => "Invalid verification link.",
                ],
                400
            );
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(
                [
                    "message" => "Email address already verified.",
                ],
                400
            );
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response()->json(
            [
                "message" => "Email verified successfully.",
            ],
            200
        );
    }
}
