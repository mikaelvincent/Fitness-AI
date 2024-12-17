<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class TwoFactorControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test enabling two-factor authentication for a user without it enabled.
     */
    public function test_enable_two_factor_authentication_for_user_without_it_enabled()
    {
        $user = User::factory()->create();

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/two-factor/enable');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'qr_code_url',
                         'recovery_codes',
                     ],
                 ]);

        $this->assertNotNull($user->fresh()->two_factor_secret);
        $this->assertNotNull($user->fresh()->two_factor_recovery_codes);
    }

    /**
     * Test enabling two-factor authentication when already enabled.
     */
    public function test_enable_two_factor_authentication_when_already_enabled()
    {
        $user = User::factory()->create();

        $user->forceFill([
            'two_factor_secret' => encrypt('existingsecret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
            'two_factor_confirmed_at' => now(),
        ])->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/two-factor/enable');

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Two-factor authentication is already enabled.',
            ]);
    }

    /**
     * Test enabling two-factor authentication without authentication.
     */
    public function test_enable_two_factor_authentication_without_authentication()
    {
        $response = $this->postJson('/api/two-factor/enable');

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.',
                 ]);
    }

    /**
     * Test successful confirmation of two-factor authentication with a valid code.
     */
    public function test_confirm_two_factor_authentication_with_valid_code()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $user = User::factory()->create([
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => null,
        ]);

        $validCode = $google2fa->getCurrentOtp($secret);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/two-factor/confirm', [
                            'code' => $validCode,
                        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Two-factor authentication confirmed.',
                 ]);

        $this->assertNotNull($user->fresh()->two_factor_confirmed_at);
    }

    /**
     * Test confirmation of two-factor authentication with an invalid code.
     */
    public function test_confirm_two_factor_authentication_with_invalid_code()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $user = User::factory()->create([
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => null,
        ]);

        $invalidCode = '123456';

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/two-factor/confirm', [
                            'code' => $invalidCode,
                        ]);

        $response->assertStatus(422)
                 ->assertJson([
                     'message' => 'Invalid two-factor authentication code.',
                 ]);

        $this->assertNull($user->fresh()->two_factor_confirmed_at);
    }

    /**
     * Test confirmation of two-factor authentication without prior enabling.
     */
    public function test_confirm_two_factor_authentication_without_prior_enabling()
    {
        $user = User::factory()->create([
            'two_factor_secret' => null,
            'two_factor_confirmed_at' => null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/two-factor/confirm', [
                            'code' => '123456',
                        ]);

        $response->assertStatus(404);
    }

    /**
     * Test successful disabling of two-factor authentication.
     */
    public function test_disable_two_factor_authentication_successfully()
    {
        $user = User::factory()->create([
            'two_factor_secret' => encrypt('existingsecret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
            'two_factor_confirmed_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/two-factor/disable');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Two-factor authentication disabled.',
                 ]);

        $this->assertNull($user->fresh()->two_factor_secret);
        $this->assertNull($user->fresh()->two_factor_recovery_codes);
        $this->assertNull($user->fresh()->two_factor_confirmed_at);
    }

    /**
     * Test disabling two-factor authentication when it is not enabled.
     */
    public function test_disable_two_factor_authentication_when_not_enabled()
    {
        $user = User::factory()->create([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/two-factor/disable');

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'Two-factor authentication is not enabled.',
                 ]);
    }

    /**
     * Test disabling two-factor authentication without authentication.
     */
    public function test_disable_two_factor_authentication_without_authentication()
    {
        $response = $this->postJson('/api/two-factor/disable');

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.',
                 ]);
    }

    /**
     * Test that recovery codes are generated with correct length.
     */
    public function test_recovery_codes_are_correct_length()
    {
        $user  = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->postJson('/api/two-factor/enable');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'qr_code_url',
                         'recovery_codes',
                     ],
                 ]);

        $recoveryCodes = $response->json('data.recovery_codes');
        foreach ($recoveryCodes as $code) {
            $this->assertEquals(8, strlen($code));
            $this->assertMatchesRegularExpression('/^\d{8}$/', $code);
        }
    }
}
