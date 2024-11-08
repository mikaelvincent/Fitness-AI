<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorAuthenticationController extends Controller
{
    /**
     * Enable two-factor authentication for the user.
     */
    public function enable(Request $request)
    {
        $user = $request->user();

        if ($user->two_factor_secret) {
            return response()->json(
                [
                    "message" =>
                        "Two-factor authentication is already enabled.",
                ],
                400
            );
        }

        $google2fa = new Google2FA();

        // Generate a new secret key
        $secretKey = $google2fa->generateSecretKey();

        // Encrypt and save the secret key and recovery codes
        $user
            ->forceFill([
                "two_factor_secret" => encrypt($secretKey),
                "two_factor_recovery_codes" => encrypt(
                    json_encode($this->generateRecoveryCodes())
                ),
            ])
            ->save();

        // Generate the QR code URL
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config("app.name"),
            $user->email,
            $secretKey
        );

        return response()->json(
            [
                "message" => "Two-factor authentication enabled.",
                "data" => [
                    "qr_code_url" => $qrCodeUrl,
                    "recovery_codes" => json_decode(
                        decrypt($user->two_factor_recovery_codes),
                        true
                    ),
                ],
            ],
            200
        );
    }

    /**
     * Confirm two-factor authentication setup.
     */
    public function confirm(Request $request)
    {
        $request->validate([
            "code" => "required|string",
        ]);

        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json(
                [
                    "message" => "Two-factor authentication is not enabled.",
                ],
                400
            );
        }

        $google2fa = new Google2FA();
        $secretKey = decrypt($user->two_factor_secret);

        $valid = $google2fa->verifyKey($secretKey, $request->code);

        if (!$valid) {
            return response()->json(
                [
                    "message" => "Invalid two-factor authentication code.",
                ],
                422
            );
        }

        $user
            ->forceFill([
                "two_factor_confirmed_at" => now(),
            ])
            ->save();

        return response()->json(
            [
                "message" => "Two-factor authentication confirmed.",
            ],
            200
        );
    }

    /**
     * Disable two-factor authentication for the user.
     */
    public function disable(Request $request)
    {
        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json(
                [
                    "message" => "Two-factor authentication is not enabled.",
                ],
                400
            );
        }

        $user
            ->forceFill([
                "two_factor_secret" => null,
                "two_factor_recovery_codes" => null,
                "two_factor_confirmed_at" => null,
            ])
            ->save();

        return response()->json(
            [
                "message" => "Two-factor authentication disabled.",
            ],
            200
        );
    }

    /**
     * Generate new recovery codes.
     */
    protected function generateRecoveryCodes()
    {
        return collect(range(1, 8))
            ->map(function () {
                return Str::random(10) . "-" . Str::random(10);
            })
            ->all();
    }
}
