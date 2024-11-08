<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPasswordNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class ResetPasswordNotification extends BaseResetPasswordNotification
{
    /**
     * Get the reset password URL for the notification.
     */
    protected function resetUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            "password.reset",
            Carbon::now()->addMinutes(
                Config::get(
                    "auth.passwords." .
                        Config::get("auth.defaults.passwords") .
                        ".expire"
                )
            ),
            [
                "token" => $this->token,
                "email" => $notifiable->getEmailForPasswordReset(),
            ]
        );
    }
}
