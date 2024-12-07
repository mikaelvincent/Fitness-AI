<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;
use App\Notifications\ResetPasswordNotification;

class SessionControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful login with valid credentials.
     */
    public function test_successful_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'password' => Hash::make('ValidPassword123!'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'ValidPassword123!',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'token',
                     ],
                 ]);
    }

    /**
     * Test login with incorrect email.
     */
    public function test_login_with_incorrect_email()
    {
        User::factory()->create([
            'email' => 'correct@example.com',
            'password' => Hash::make('ValidPassword123!'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'incorrect@example.com',
            'password' => 'ValidPassword123!',
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid email or password provided.',
                 ]);
    }

    /**
     * Test login with incorrect password.
     */
    public function test_login_with_incorrect_password()
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('ValidPassword123!'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid email or password provided.',
                 ]);
    }

    /**
     * Test login requiring two-factor authentication.
     */
    public function test_login_requires_two_factor_authentication()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $user = User::factory()->create([
            'password' => Hash::make('ValidPassword123!'),
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => now(),
        ]);

        $validCode = $google2fa->getCurrentOtp($secret);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'ValidPassword123!',
            'two_factor_code' => $validCode,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'token',
                     ],
                 ]);
    }

    /**
     * Test login with incorrect two-factor code.
     */
    public function test_login_with_incorrect_two_factor_code()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $user = User::factory()->create([
            'password' => Hash::make('ValidPassword123!'),
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => now(),
        ]);

        $invalidCode = '123456';

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'ValidPassword123!',
            'two_factor_code' => $invalidCode,
        ]);

        $response->assertStatus(422)
                 ->assertJson([
                     'message' => 'The two-factor authentication code is invalid.',
                 ]);
    }

    /**
     * Test login without two-factor code when required.
     */
    public function test_login_without_two_factor_code_when_required()
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $user = User::factory()->create([
            'password' => Hash::make('ValidPassword123!'),
            'two_factor_secret' => encrypt($secret),
            'two_factor_confirmed_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'ValidPassword123!',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['two_factor_code']);
    }

    /**
     * Test successful logout for an authenticated user.
     */
    public function test_successful_logout_for_authenticated_user()
    {
        $user = User::factory()->create();

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                        'Authorization' => 'Bearer ' . $token,
                    ])->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'You have been successfully logged out.',
                 ]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'token' => hash('sha256', $token),
        ]);
    }

    /**
     * Test logout when no user is authenticated.
     */
    public function test_logout_without_authentication()
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.',
                 ]);
    }
}
