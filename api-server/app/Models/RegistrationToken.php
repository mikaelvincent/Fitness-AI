<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class RegistrationToken extends Model
{
    protected $fillable = [
        'email',
        'token',
        'expires_at',
        'user_attributes',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'user_attributes' => 'array',
    ];

    public $timestamps = true;

    /**
     * Determine if the registration token is expired.
     *
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Get the time in seconds until the token expires.
     *
     * @return int
     */
    public function timeUntilExpiration(): int
    {
        return now()->diffInSeconds($this->expires_at, false);
    }
}
