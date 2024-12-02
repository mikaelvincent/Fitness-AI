<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_password_reset_link()
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)->assertJson([
            'message' => 'If your email exists in our system, a password reset link has been sent.',
        ]);

        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    public function test_password_reset_request_requires_valid_email()
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'invalid-email',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_password_reset_request_rate_limiting()
    {
        $user = User::factory()->create();

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/forgot-password', ['email' => $user->email]);
        }

        $response = $this->postJson('/api/forgot-password', ['email' => $user->email]);

        $response->assertStatus(429)->assertJsonStructure(['message', 'retry_after']);
    }

    public function test_user_can_reset_password_with_valid_token()
    {
        $user = User::factory()->create();

        $token = Password::createToken($user);

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'NewSecurePass123!',
            'password_confirmation' => 'NewSecurePass123!',
        ]);

        $response->assertStatus(200)->assertJson([
            'message' => 'Password reset successful.',
        ]);

        $this->assertTrue(
            Hash::check('NewSecurePass123!', $user->fresh()->password)
        );
    }

    public function test_password_reset_fails_with_invalid_token()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => 'invalid-token',
            'password' => 'NewSecurePass123!',
            'password_confirmation' => 'NewSecurePass123!',
        ]);

        $response->assertStatus(400)->assertJson([
            'message' => 'Invalid token or email.',
        ]);
    }

    public function test_password_reset_requires_valid_data()
    {
        $response = $this->postJson('/api/reset-password', []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'token', 'password']);
    }

    public function test_password_reset_rate_limiting_with_invalid_tokens()
    {
        $user = User::factory()->create();

        $validToken = Password::createToken($user);

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $validToken,
            'password' => 'NewSecurePass123!',
            'password_confirmation' => 'NewSecurePass123!',
        ]);

        $response->assertStatus(200)->assertJson([
            'message' => 'Password reset successful.',
        ]);

        for ($i = 0; $i < 5; $i++) {
            $invalidToken = 'invalid-token-' . $i;

            $response = $this->postJson('/api/reset-password', [
                'email' => $user->email,
                'token' => $invalidToken,
                'password' => 'AnotherSecurePass123!',
                'password_confirmation' => 'AnotherSecurePass123!',
            ]);

            $response->assertStatus(400)->assertJson([
                'message' => 'Invalid token or email.',
            ]);
        }

        $finalInvalidToken = 'final-invalid-token';

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $finalInvalidToken,
            'password' => 'FinalSecurePass123!',
            'password_confirmation' => 'FinalSecurePass123!',
        ]);

        $response->assertStatus(429)->assertJsonStructure(['message', 'retry_after']);
    }
}
