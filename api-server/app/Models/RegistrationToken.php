<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationToken extends Model
{
    protected $fillable = ['email', 'token', 'expires_at'];

    public $timestamps = true;

    /**
     * Check if the token is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Get the time until expiration in seconds.
     */
    public function timeUntilExpiration(): int
    {
        return now()->diffInSeconds($this->expires_at, false);
    }
}
