<?php

namespace Tests\Unit\Notifications;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ResetPasswordNotificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the notification is sent via email channel.
     */
    public function test_notification_is_sent_via_email_channel()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'testuser@example.com',
        ]);

        $token = 'reset-token-123';
        $notification = new ResetPasswordNotification($token);

        $user->notify($notification);

        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class,
            function ($sentNotification, $channels) use ($token, $user) {
                return in_array('mail', $channels) &&
                       $sentNotification->token === $token;
            }
        );
    }

    /**
     * Test that the reset URL includes the token and email parameters.
     */
    public function test_reset_url_includes_token_and_email()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'testuser@example.com',
        ]);

        $token = 'reset-token-456';
        $notification = new ResetPasswordNotification($token);

        $user->notify($notification);

        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class,
            function ($sentNotification, $channels) use ($token, $user) {
                $mail = $sentNotification->toMail($user);
                $expectedUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
                return strpos($mail->actionUrl, 'token=' . $token) !== false &&
                       strpos($mail->actionUrl, 'email=' . urlencode($user->email)) !== false;
            }
        );
    }

    /**
     * Test that the email body includes password reset instructions.
     */
    public function test_email_body_includes_password_reset_instructions()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'testuser@example.com',
        ]);

        $token = 'reset-token-789';
        $notification = new ResetPasswordNotification($token);

        $user->notify($notification);

        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class,
            function ($sentNotification, $channels) use ($user) {
                $mail = $sentNotification->toMail($user);
                $mailContent = $mail->render();
                return strpos($mailContent, 'You are receiving this email because we received a password reset request for your account.') !== false &&
                       strpos($mailContent, 'This password reset link will expire in') !== false &&
                       strpos($mailContent, 'If you did not request a password reset, no further action is required.') !== false;
            }
        );
    }
}
