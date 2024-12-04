<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

/**
 * Manages two-factor authentication settings.
 */
class TwoFactorController extends Controller
{
    /**
     * Enable two-factor authentication.
     *
     * Generates a secret key and QR code URL.
     *
     * @group Two-Factor Authentication
     * @authenticated
     *
     * @response 200 {
     *   "message": "Two-factor authentication enabled.",
     *   "data": {
     *     "qr_code_url": "otpauth://totp/AppName:user@example.com?secret=ABCDEF...",
     *     "recovery_codes": ["code1", "code2", "..."]
     *   }
     * }
     */
    public function enable(Request $request)
    {
        $user = $request->user();

        if ($user->two_factor_secret) {
            return response()->json([
                'message' => 'Two-factor authentication is already enabled.',
            ], 400);
        }

        $google2fa = new Google2FA();
        $secretKey = $google2fa->generateSecretKey();

        $user->forceFill([
            'two_factor_secret' => encrypt($secretKey),
            'two_factor_recovery_codes' => encrypt(json_encode($this->generateRecoveryCodes())),
        ])->save();

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secretKey
        );

        return response()->json([
            'message' => 'Two-factor authentication enabled.',
            'data' => [
                'qr_code_url' => $qrCodeUrl,
                'recovery_codes' => json_decode(decrypt($user->two_factor_recovery_codes), true),
            ],
        ], 200);
    }

    /**
     * Confirm two-factor authentication setup.
     *
     * Validates the code from the authenticator app.
     *
     * @group Two-Factor Authentication
     * @authenticated
     *
     * @bodyParam code string required The verification code from the authenticator app.
     *
     * @response 200 {
     *   "message": "Two-factor authentication confirmed."
     * }
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $user = $request->user();

        // Check if two-factor authentication is enabled
        if (!$user->two_factor_secret) {
            return response()->json([
                'message' => 'Two-factor authentication is not enabled.',
            ], 404);
        }

        $google2fa = new Google2FA();

        try {
            $secretKey = decrypt($user->two_factor_secret);
        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return response()->json([
                'message' => 'Invalid two-factor authentication secret.',
            ], 500);
        }

        if (!$google2fa->verifyKey($secretKey, $request->code)) {
            return response()->json([
                'message' => 'Invalid two-factor authentication code.',
            ], 422);
        }

        $user->forceFill([
            'two_factor_confirmed_at' => now(),
        ])->save();

        return response()->json([
            'message' => 'Two-factor authentication confirmed.',
        ], 200);
    }

    /**
     * Disable two-factor authentication.
     *
     * Removes two-factor authentication settings from the user's account.
     *
     * @group Two-Factor Authentication
     * @authenticated
     *
     * @response 200 {
     *   "message": "Two-factor authentication disabled."
     * }
     */
    public function disable(Request $request)
    {
        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json([
                'message' => 'Two-factor authentication is not enabled.',
            ], 400);
        }

        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return response()->json([
            'message' => 'Two-factor authentication disabled.',
        ], 200);
    }

    /**
     * Generate new recovery codes.
     *
     * @return array
     */
    protected function generateRecoveryCodes()
    {
        return collect(range(1, 8))->map(function () {
            return Str::random(10) . '-' . Str::random(10);
        })->all();
    }
}
