<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class TwoFactorAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_enable_two_factor_authentication()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/two-factor-authentication/enable')
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'qr_code_url',
                    'recovery_codes',
                ],
            ]);

        $user->refresh();

        $this->assertNotNull($user->two_factor_secret);
        $this->assertNotNull($user->two_factor_recovery_codes);
    }

    public function test_user_can_confirm_two_factor_authentication()
    {
        $user = User::factory()->create();

        $google2fa = new Google2FA();

        // Enable 2FA
        $this->actingAs($user, 'sanctum')
            ->postJson('/api/two-factor-authentication/enable');

        $user->refresh();

        $secretKey = decrypt($user->two_factor_secret);
        $validCode = $google2fa->getCurrentOtp($secretKey);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/two-factor-authentication/confirm', [
                'code' => $validCode,
            ])
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Two-factor authentication confirmed.',
            ]);

        $user->refresh();

        $this->assertNotNull($user->two_factor_confirmed_at);
    }

    public function test_user_can_disable_two_factor_authentication()
    {
        $user = User::factory()->create([
            'two_factor_secret' => encrypt('secret-key'),
            'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
            'two_factor_confirmed_at' => now(),
        ]);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/two-factor-authentication/disable')
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Two-factor authentication disabled.',
            ]);

        $user->refresh();

        $this->assertNull($user->two_factor_secret);
        $this->assertNull($user->two_factor_recovery_codes);
        $this->assertNull($user->two_factor_confirmed_at);
    }

    public function test_user_cannot_confirm_with_invalid_code()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/two-factor-authentication/enable');

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/two-factor-authentication/confirm', [
                'code' => 'invalid-code',
            ])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'Invalid two-factor authentication code.',
            ]);

        $user->refresh();

        $this->assertNull($user->two_factor_confirmed_at);
    }

    public function test_user_with_2fa_enabled_must_provide_code_on_login()
    {
        $google2fa = new Google2FA();
        $secretKey = $google2fa->generateSecretKey();

        $user = User::factory()->create([
            'password' => bcrypt('password'),
            'two_factor_secret' => encrypt($secretKey),
            'two_factor_confirmed_at' => now(),
        ]);

        $validCode = $google2fa->getCurrentOtp($secretKey);

        // Attempt login without two_factor_code
        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['two_factor_code']);

        // Attempt login with invalid two_factor_code
        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
            'two_factor_code' => 'invalid-code',
        ])->assertStatus(422)
          ->assertJson([
              'message' => 'Invalid two-factor authentication code.',
          ]);

        // Attempt login with valid two_factor_code
        $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
            'two_factor_code' => $validCode,
        ])->assertStatus(200)
          ->assertJsonStructure([
              'message',
              'data' => [
                  'user',
                  'token',
              ],
          ]);
    }
}
