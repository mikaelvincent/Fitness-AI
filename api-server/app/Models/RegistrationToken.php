<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistrationToken extends Model
{
    use HasFactory;

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

    /**
     * Check if the registration token has expired.
     *
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Get the time until the token expires in seconds.
     *
     * @return int
     */
    public function timeUntilExpiration(): int
    {
        $now = now();
        return $now->lessThan($this->expires_at) ? $now->diffInSeconds($this->expires_at) : 0;
    }
}
