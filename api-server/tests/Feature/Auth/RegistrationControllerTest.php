<?php

namespace Tests\Feature\Auth;

use App\Models\RegistrationToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;
use App\Notifications\RegistrationTokenNotification;

class RegistrationControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful initiation of registration with a valid, unique email.
     */
    public function test_successful_initiate_registration()
    {
        Notification::fake();

        $response = $this->postJson('/api/registration/initiate', [
            'email' => 'uniqueuser@example.com',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Registration process has been initiated. Please check your email for further instructions.',
                 ]);

        $this->assertDatabaseHas('registration_tokens', [
            'email' => 'uniqueuser@example.com',
        ]);

        Notification::assertSentTo(
            new \Illuminate\Notifications\AnonymousNotifiable,
            RegistrationTokenNotification::class,
            function ($notification, $channels, $notifiable) {
                return $notifiable->routes['mail'] === 'uniqueuser@example.com';
            }
        );
    }

    /**
     * Test initiation of registration with an already registered email.
     */
    public function test_initiate_registration_with_existing_email()
    {
        User::factory()->create([
            'email' => 'existinguser@example.com',
        ]);

        $response = $this->postJson('/api/registration/initiate', [
            'email' => 'existinguser@example.com',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test initiation of registration with invalid email formats.
     */
    public function test_initiate_registration_with_invalid_email_formats()
    {
        $invalidEmails = [
            'invalid-email',
            'user@.com',
            'user@site.',
            '@example.com',
            'userexample.com',
        ];

        foreach ($invalidEmails as $email) {
            $response = $this->postJson('/api/registration/initiate', [
                'email' => $email,
            ]);

            $response->assertStatus(422)
                     ->assertJsonValidationErrors(['email']);
        }
    }

    /**
     * Test successful resend of verification email with a valid, existing email.
     */
    public function test_successful_resend_verification_email()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'resenduser@example.com',
        ]);

        RegistrationToken::create([
            'email' => 'resenduser@example.com',
            'token' => hash('sha256', 'validtoken'),
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/registration/resend', [
            'email' => 'resenduser@example.com',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'A new verification email has been sent to your address.',
                 ]);

        $this->assertDatabaseHas('registration_tokens', [
            'email' => 'resenduser@example.com',
        ]);

        Notification::assertSentTo(
            new \Illuminate\Notifications\AnonymousNotifiable,
            RegistrationTokenNotification::class,
            function ($notification, $channels, $notifiable) {
                return $notifiable->routes['mail'] === 'resenduser@example.com';
            }
        );
    }

    /**
     * Test resend of verification email with a non-existent email.
     */
    public function test_resend_verification_email_with_non_existent_email()
    {
        $response = $this->postJson('/api/registration/resend', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(404);
    }

    /**
     * Test validation of registration token with a valid, unexpired token.
     */
    public function test_validate_registration_token_with_valid_token()
    {
        $token = 'validtoken';
        RegistrationToken::create([
            'email' => 'validtokenuser@example.com',
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/registration/validate-token', [
            'token' => $token,
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'The registration token is valid.',
                 ])
                 ->assertJsonStructure([
                     'data' => ['expires_in'],
                 ]);
    }

    /**
     * Test validation of registration token with an expired token.
     */
    public function test_validate_registration_token_with_expired_token()
    {
        $token = 'expiredtoken';
        RegistrationToken::create([
            'email' => 'expiredtokenuser@example.com',
            'token' => hash('sha256', $token),
            'expires_at' => now()->subMinute(),
        ]);

        $response = $this->postJson('/api/registration/validate-token', [
            'token' => $token,
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'The registration token is invalid or has expired.',
                 ]);
    }

    /**
     * Test validation of registration token with an invalid token.
     */
    public function test_validate_registration_token_with_invalid_token()
    {
        $invalidToken = 'invalidtoken';

        $response = $this->postJson('/api/registration/validate-token', [
            'token' => $invalidToken,
        ]);

        $response->assertStatus(404);
    }

    /**
     * Test successful completion of registration with valid token and data.
     */
    public function test_successful_complete_registration()
    {
        Notification::fake();

        $token = 'completetoken';
        RegistrationToken::create([
            'email' => 'completeuser@example.com',
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/registration/complete', [
            'token' => $token,
            'name' => 'Complete User',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'StrongPassword123!',
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Registration completed successfully. Welcome aboard!',
                 ])
                 ->assertJsonStructure([
                     'data' => [
                         'token',
                     ],
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'completeuser@example.com',
            'name' => 'Complete User',
        ]);

        $this->assertDatabaseMissing('registration_tokens', [
            'email' => 'completeuser@example.com',
        ]);
    }

    /**
     * Test completion of registration with mismatched password confirmation.
     */
    public function test_complete_registration_with_mismatched_password_confirmation()
    {
        $token = 'mismatchedtoken';
        RegistrationToken::create([
            'email' => 'mismatchuser@example.com',
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/registration/complete', [
            'token' => $token,
            'name' => 'Mismatch User',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'DifferentPassword!',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test completion of registration with a weak password.
     */
    public function test_complete_registration_with_weak_password()
    {
        $token = 'weakpasswordtoken';
        RegistrationToken::create([
            'email' => 'weakpassworduser@example.com',
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
        ]);

        $response = $this->postJson('/api/registration/complete', [
            'token' => $token,
            'name' => 'Weak Password User',
            'password' => 'weak',
            'password_confirmation' => 'weak',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test completion of registration with an expired token.
     */
    public function test_complete_registration_with_expired_token()
    {
        $token = 'expiredcompletetoken';
        RegistrationToken::create([
            'email' => 'expiredcompleteuser@example.com',
            'token' => hash('sha256', $token),
            'expires_at' => now()->subMinute(),
        ]);

        $response = $this->postJson('/api/registration/complete', [
            'token' => $token,
            'name' => 'Expired Complete User',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'StrongPassword123!',
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'The registration token provided is invalid or has expired.',
                 ]);
    }

    /**
     * Test completion of registration with an invalid token.
     */
    public function test_complete_registration_with_invalid_token()
    {
        $invalidToken = 'invalidcompletetoken';

        $response = $this->postJson('/api/registration/complete', [
            'token' => $invalidToken,
            'name' => 'Invalid Complete User',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'StrongPassword123!',
        ]);

        $response->assertStatus(404);
    }

    /**
     * Test successful initiation of registration with user attributes.
     */
    public function test_successful_initiate_registration_with_attributes()
    {
        Notification::fake();

        $userAttributes = [
            'preferred_language' => 'en',
            'timezone' => 'UTC',
        ];

        $response = $this->postJson('/api/registration/initiate', [
            'email' => 'uniqueuser@example.com',
            'user_attributes' => $userAttributes,
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Registration process has been initiated. Please check your email for further instructions.',
                 ]);

        $this->assertDatabaseHas('registration_tokens', [
            'email' => 'uniqueuser@example.com',
        ]);

        $registrationToken = RegistrationToken::where('email', 'uniqueuser@example.com')->first();
        $this->assertEquals($userAttributes, $registrationToken->user_attributes);

        Notification::assertSentTo(
            new \Illuminate\Notifications\AnonymousNotifiable,
            RegistrationTokenNotification::class,
            function ($notification, $channels, $notifiable) {
                return $notifiable->routes['mail'] === 'uniqueuser@example.com';
            }
        );
    }

    /**
     * Test completion of registration with user attributes.
     */
    public function test_successful_complete_registration_with_attributes()
    {
        Notification::fake();

        $token = 'completetoken';
        $userAttributes = [
            'preferred_language' => 'en',
            'timezone' => 'UTC',
        ];

        RegistrationToken::create([
            'email' => 'completeuser@example.com',
            'token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
            'user_attributes' => $userAttributes,
        ]);

        $response = $this->postJson('/api/registration/complete', [
            'token' => $token,
            'name' => 'Complete User',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'StrongPassword123!',
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'message' => 'Registration completed successfully. Welcome aboard!',
                 ])
                 ->assertJsonStructure([
                     'data' => [
                         'token',
                     ],
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'completeuser@example.com',
            'name' => 'Complete User',
        ]);

        $user = User::where('email', 'completeuser@example.com')->first();
        $this->assertNotNull($user);

        foreach ($userAttributes as $key => $value) {
            $this->assertDatabaseHas('user_attributes', [
                'user_id' => $user->id,
                'key' => $key,
                'value' => $value,
            ]);
        }

        $this->assertDatabaseMissing('registration_tokens', [
            'email' => 'completeuser@example.com',
        ]);
    }

    /**
     * Test initiation of registration with invalid user attributes.
     */
    public function test_initiate_registration_with_invalid_user_attributes()
    {
        $response = $this->postJson('/api/registration/initiate', [
            'email' => 'uniqueuser@example.com',
            'user_attributes' => 'invalid', // Should be an array
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['user_attributes']);
    }

    /**
     * Test initiation of registration with excessively long attribute keys.
     */
    public function test_initiate_registration_with_long_attribute_keys()
    {
        $longKey = Str::random(256);

        $response = $this->postJson('/api/registration/initiate', [
            'email' => 'uniqueuser@example.com',
            'user_attributes' => [
                $longKey => 'value',
            ],
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['user_attributes.' . $longKey]);
    }
}
