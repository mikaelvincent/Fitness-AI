<?php

namespace Tests\Unit\Notifications;

use App\Models\User;
use App\Notifications\RegistrationTokenNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RegistrationTokenNotificationTest extends TestCase
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

        $token = 'testtoken123';
        $notification = new RegistrationTokenNotification($token);

        $user->notify($notification);

        Notification::assertSentTo(
            [$user],
            RegistrationTokenNotification::class,
            function ($sentNotification, $channels) use ($notification) {
                return in_array('mail', $channels) &&
                       $sentNotification->getToken() === $notification->getToken();
            }
        );
    }

    /**
     * Test that the email contains the correct subject and action URL.
     */
    public function test_email_contains_correct_subject_and_action_url()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'testuser@example.com',
        ]);

        $token = 'testtoken123';
        $notification = new RegistrationTokenNotification($token);

        $user->notify($notification);

        Notification::assertSentTo(
            [$user],
            RegistrationTokenNotification::class,
            function ($sentNotification, $channels) use ($token, $user) {
                $mail = $sentNotification->toMail($user);
                $expectedUrl = config('app.frontend_url') . '/complete-registration?token=' . $token;
                return $mail->subject === 'Complete Your Registration' &&
                       $mail->actionUrl === $expectedUrl;
            }
        );
    }

    /**
     * Test that the email body includes instructions and expiration notice.
     */
    public function test_email_body_includes_instructions_and_expiration_notice()
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'testuser@example.com',
        ]);

        $token = 'testtoken123';
        $notification = new RegistrationTokenNotification($token);

        $user->notify($notification);

        Notification::assertSentTo(
            [$user],
            RegistrationTokenNotification::class,
            function ($sentNotification, $channels) use ($user) {
                $mail = $sentNotification->toMail($user);
                $mailContent = $mail->render();
                return strpos($mailContent, 'Please click the button below to complete your registration.') !== false &&
                       strpos($mailContent, 'This link will expire in 1 hour.') !== false;
            }
        );
    }
}
