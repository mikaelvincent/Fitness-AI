<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPasswordNotification;

class ResetPasswordNotification extends BaseResetPasswordNotification
{
    /**
     * Get the reset password URL for the notification.
     */
    protected function resetUrl($notifiable)
    {
        // Generate a reset URL pointing to the frontend application
        return config('app.frontend_url') . '/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->getEmailForPasswordReset());
    }
}
