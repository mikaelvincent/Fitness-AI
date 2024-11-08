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

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password reset link sent.',
            ]);

        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    public function test_user_can_reset_password_with_valid_token()
    {
        $user = User::factory()->create();

        $token = Password::createToken($user);

        $response = $this->postJson('/api/reset-password', [
            'email'                 => $user->email,
            'token'                 => $token,
            'password'              => 'NewSecurePass123!',
            'password_confirmation' => 'NewSecurePass123!',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Password reset successful.',
            ]);

        $this->assertTrue(Hash::check('NewSecurePass123!', $user->fresh()->password));
    }

    public function test_password_reset_fails_with_invalid_token()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/reset-password', [
            'email'                 => $user->email,
            'token'                 => 'invalid-token',
            'password'              => 'NewSecurePass123!',
            'password_confirmation' => 'NewSecurePass123!',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'message' => 'Invalid token or email.',
            ]);
    }

    public function test_password_reset_requires_valid_data()
    {
        $response = $this->postJson('/api/reset-password', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'token', 'password']);
    }
}
