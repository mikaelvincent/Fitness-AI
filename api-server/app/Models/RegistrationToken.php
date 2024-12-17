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
     * Determine if the registration token has expired.
     *
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Get the time until expiration in seconds.
     *
     * Negative value indicates the token has expired.
     *
     * @return int
     */
    public function timeUntilExpiration(): int
    {
        return now()->diffInSeconds($this->expires_at, false);
    }
}
