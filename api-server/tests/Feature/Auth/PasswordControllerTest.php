<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use App\Notifications\ResetPasswordNotification;

class PasswordControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test sending reset link to a valid, registered email.
     */
    public function test_send_reset_link_to_registered_email()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'registered@example.com',
        ]);

        $response = $this->postJson('/api/password/forgot', [
            'email' => 'registered@example.com',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Your request has been received. If your email is registered, you will receive a password reset link shortly.',
                 ]);

        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class
        );
    }

    /**
     * Test sending reset link to an unregistered email.
     */
    public function test_send_reset_link_to_unregistered_email()
    {
        Notification::fake();

        $response = $this->postJson('/api/password/forgot', [
            'email' => 'unregistered@example.com',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Your request has been received. If your email is registered, you will receive a password reset link shortly.',
                 ]);

        Notification::assertNothingSent();
    }

    /**
     * Test successful password reset with valid token and matching passwords.
     */
    public function test_successful_password_reset_with_valid_token()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'resetuser@example.com',
            'password' => Hash::make('OldPassword123!'),
        ]);

        Password::sendResetLink(['email' => 'resetuser@example.com']);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/password/reset', [
            'token' => $token,
            'email' => 'resetuser@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Your password has been successfully reset.',
                 ]);

        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));
    }

    /**
     * Test password reset with invalid token.
     */
    public function test_password_reset_with_invalid_token()
    {
        $user = User::factory()->create([
            'email' => 'invalidtokenuser@example.com',
            'password' => Hash::make('OldPassword123!'),
        ]);

        $response = $this->postJson('/api/password/reset', [
            'token' => 'invalidtoken',
            'email' => 'invalidtokenuser@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'The provided token or email is invalid or has expired.',
                 ]);

        $this->assertTrue(Hash::check('OldPassword123!', $user->fresh()->password));
    }

    /**
     * Test password reset with expired token.
     */
    public function test_password_reset_with_expired_token()
    {
        $user = User::factory()->create([
            'email' => 'expiredtokenuser@example.com',
            'password' => Hash::make('OldPassword123!'),
        ]);

        Password::sendResetLink(['email' => 'expiredtokenuser@example.com']);

        $token = Password::createToken($user);

        // Simulate token expiration by modifying the password_resets table
        DB::table('password_resets')
            ->where('email', 'expiredtokenuser@example.com')
            ->update(['created_at' => now()->subHours(2)]);

        $response = $this->postJson('/api/password/reset', [
            'token' => $token,
            'email' => 'expiredtokenuser@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'The provided token or email is invalid or has expired.',
                 ]);

        $this->assertTrue(Hash::check('OldPassword123!', $user->fresh()->password));
    }

    /**
     * Test password reset with non-matching password confirmation.
     */
    public function test_password_reset_with_non_matching_password_confirmation()
    {
        $user = User::factory()->create([
            'email' => 'mismatchuser@example.com',
            'password' => Hash::make('OldPassword123!'),
        ]);

        Password::sendResetLink(['email' => 'mismatchuser@example.com']);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/password/reset', [
            'token' => $token,
            'email' => 'mismatchuser@example.com',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'DifferentPassword123!',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test password reset with weak password.
     */
    public function test_password_reset_with_weak_password()
    {
        $user = User::factory()->create([
            'email' => 'weakpassworduser@example.com',
            'password' => Hash::make('OldPassword123!'),
        ]);

        Password::sendResetLink(['email' => 'weakpassworduser@example.com']);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/password/reset', [
            'token' => $token,
            'email' => 'weakpassworduser@example.com',
            'password' => 'weak',
            'password_confirmation' => 'weak',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test successful password change with correct current password.
     */
    public function test_successful_password_change_with_correct_current_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('CurrentPassword123!'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/password/change', [
                            'current_password' => 'CurrentPassword123!',
                            'password' => 'NewPassword123!',
                            'password_confirmation' => 'NewPassword123!',
                        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Your password has been updated successfully.',
                 ]);

        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));
    }

    /**
     * Test password change with incorrect current password.
     */
    public function test_password_change_with_incorrect_current_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('CorrectPassword123!'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/password/change', [
                            'current_password' => 'WrongPassword123!',
                            'password' => 'NewPassword123!',
                            'password_confirmation' => 'NewPassword123!',
                        ]);

        $response->assertStatus(400)
                 ->assertJson([
                     'message' => 'The current password you provided does not match our records.',
                 ]);

        $this->assertTrue(Hash::check('CorrectPassword123!', $user->fresh()->password));
    }

    /**
     * Test password change with non-matching password confirmation.
     */
    public function test_password_change_with_non_matching_password_confirmation()
    {
        $user = User::factory()->create([
            'password' => Hash::make('CurrentPassword123!'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/password/change', [
                            'current_password' => 'CurrentPassword123!',
                            'password' => 'NewPassword123!',
                            'password_confirmation' => 'DifferentPassword123!',
                        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test password change with weak new password.
     */
    public function test_password_change_with_weak_new_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('CurrentPassword123!'),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
                            'Authorization' => 'Bearer ' . $token,
                        ])->postJson('/api/password/change', [
                            'current_password' => 'CurrentPassword123!',
                            'password' => 'weak',
                            'password_confirmation' => 'weak',
                        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test password change without authentication.
     */
    public function test_password_change_without_authentication()
    {
        $response = $this->postJson('/api/password/change', [
            'current_password' => 'AnyPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.',
                 ]);
    }
}
