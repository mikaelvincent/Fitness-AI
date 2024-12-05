<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class RegistrationTokenNotification extends Notification
{
    use Queueable;

    protected $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $frontendUrl = config('app.frontend_url') . '/complete-registration?token=' . $this->token;

        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Complete Your Registration')
            ->line('Please click the button below to complete your registration.')
            ->action('Complete Registration', $frontendUrl)
            ->line('This link will expire in 1 hour.');
    }

    /**
     * Get the token value.
     */
    public function getToken(): string
    {
        return $this->token;
    }
}
