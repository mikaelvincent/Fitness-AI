<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that sendPasswordResetNotification dispatches the correct notification.
     */
    public function test_send_password_reset_notification_dispatches_correct_notification()
    {
        Notification::fake();

        $user = User::factory()->create();

        $token = 'test-reset-token';
        $user->sendPasswordResetNotification($token);

        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class,
            function ($notification, $channels) use ($token, $user) {
                return $notification->token === $token &&
                       $notification->toMail($user)->actionUrl === config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
            }
        );
    }

    /**
     * Test that the password reset notification contains the correct reset URL.
     */
    public function test_password_reset_notification_contains_correct_reset_url()
    {
        Notification::fake();

        $user = User::factory()->create();

        $token = 'another-test-token';
        $user->sendPasswordResetNotification($token);

        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class,
            function ($notification, $channels) use ($token, $user) {
                $mailMessage = $notification->toMail($user);
                $expectedUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
                return $mailMessage->actionUrl === $expectedUrl;
            }
        );
    }

    /**
     * Test that sensitive attributes are hidden.
     */
    public function test_sensitive_attributes_are_hidden()
    {
        $user = User::factory()->create([
            'password' => 'secret',
            'two_factor_secret' => 'secret2fa',
            'two_factor_recovery_codes' => json_encode(['code1', 'code2']),
        ]);

        $hidden = $user->getHidden();

        $this->assertContains('password', $hidden);
        $this->assertContains('two_factor_secret', $hidden);
        $this->assertContains('two_factor_recovery_codes', $hidden);
    }

    /**
     * Test that date attributes are correctly cast.
     */
    public function test_date_attributes_are_cast_correctly()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
            'two_factor_confirmed_at' => now(),
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->two_factor_confirmed_at);
    }

    /**
     * Test creating a personal access token.
     */
    public function test_creating_personal_access_token()
    {
        Sanctum::actingAs($user = User::factory()->create());

        $token = $user->createToken('test-token')->plainTextToken;

        $this->assertNotEmpty($token);
        $this->assertDatabaseHas('personal_access_tokens', [
            'name' => 'test-token',
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    /**
     * Test revoking a personal access token.
     */
    public function test_revoking_personal_access_token()
    {
        Sanctum::actingAs($user = User::factory()->create());

        $tokenInstance = $user->createToken('revokable-token');
        $token = $tokenInstance->plainTextToken;

        $this->assertDatabaseHas('personal_access_tokens', [
            'name' => 'revokable-token',
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);

        $tokenInstance->accessToken->delete();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'name' => 'revokable-token',
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }
}
