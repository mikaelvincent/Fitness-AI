<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\RegistrationToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\RegistrationTokenNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Notifications\AnonymousNotifiable;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_initiate_registration()
    {
        Notification::fake();

        $response = $this->postJson('/api/register/initiate', [
            'email' => 'john.doe@example.com',
        ]);

        $response->assertStatus(200)->assertJson([
            'message' => 'Registration initiated successfully.',
        ]);

        $this->assertDatabaseHas('registration_tokens', [
            'email' => 'john.doe@example.com',
        ]);

        Notification::assertSentTo(
            new AnonymousNotifiable,
            RegistrationTokenNotification::class,
            function ($notification, $channels, $notifiable) {
                return isset($notifiable->routes['mail']) &&
                       $notifiable->routes['mail'] === 'john.doe@example.com';
            }
        );
    }

    public function test_registration_initiation_requires_valid_email()
    {
        $response = $this->postJson('/api/register/initiate', [
            'email' => 'invalid-email',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_registration_initiation_fails_for_existing_email()
    {
        User::factory()->create(['email' => 'john.doe@example.com']);

        $response = $this->postJson('/api/register/initiate', [
            'email' => 'john.doe@example.com',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_validate_token()
    {
        $token = Str::random(60);
        $hashedToken = hash('sha256', $token);

        RegistrationToken::create([
            'email' => 'john.doe@example.com',
            'token' => $hashedToken,
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/register/validate-token', [
            'token' => $token,
        ]);

        $response->assertStatus(200)->assertJson([
            'message' => 'Token is valid.',
            'data' => [
                'status' => 'valid',
            ],
        ]);
    }

    public function test_validate_token_fails_with_invalid_token()
    {
        $response = $this->postJson('/api/register/validate-token', [
            'token' => 'invalid-token',
        ]);

        $response->assertStatus(400)->assertJson([
            'message' => 'Token is invalid or has expired.',
            'data' => [
                'status' => 'invalid',
            ],
        ]);
    }

    public function test_user_can_complete_registration()
    {
        $token = Str::random(60);
        $hashedToken = hash('sha256', $token);

        RegistrationToken::create([
            'email' => 'john.doe@example.com',
            'token' => $hashedToken,
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/register', [
            'token' => $token,
            'name' => 'John Doe',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertStatus(201)->assertJsonStructure([
            'message',
            'data' => [
                'user' => ['id', 'name', 'email', 'email_verified_at'],
                'token',
            ],
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@example.com',
            'name' => 'John Doe',
        ]);

        $this->assertDatabaseMissing('registration_tokens', [
            'email' => 'john.doe@example.com',
        ]);
    }

    public function test_complete_registration_requires_valid_data()
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)->assertJsonValidationErrors([
            'token', 'name', 'password',
        ]);
    }

    public function test_complete_registration_fails_with_invalid_token()
    {
        $response = $this->postJson('/api/register', [
            'token' => 'invalid-token',
            'name' => 'John Doe',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertStatus(400)->assertJson([
            'message' => 'Invalid or expired registration token.',
        ]);
    }

    public function test_user_cannot_complete_registration_with_existing_email()
    {
        User::factory()->create(['email' => 'john.doe@example.com']);

        $token = Str::random(60);
        $hashedToken = hash('sha256', $token);

        RegistrationToken::create([
            'email' => 'john.doe@example.com',
            'token' => $hashedToken,
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/register', [
            'token' => $token,
            'name' => 'John Doe',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertStatus(400)->assertJson([
            'message' => 'User already registered with this email.',
        ]);
    }

    public function test_expired_token_cannot_be_used_for_registration()
    {
        $token = Str::random(60);
        $hashedToken = hash('sha256', $token);

        RegistrationToken::create([
            'email' => 'john.doe@example.com',
            'token' => $hashedToken,
            'expires_at' => now()->subMinute(),
        ]);

        $response = $this->postJson('/api/register', [
            'token' => $token,
            'name' => 'John Doe',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertStatus(400)->assertJson([
            'message' => 'Invalid or expired registration token.',
        ]);
    }
}
