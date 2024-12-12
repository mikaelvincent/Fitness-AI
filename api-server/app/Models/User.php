<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $casts = [
        'two_factor_confirmed_at' => 'datetime',
    ];

    /**
     * Get the attributes for the user.
     */
    public function attributes()
    {
        return $this->hasMany(UserAttribute::class);
    }

    /**
     * Establish a one-to-many relationship for the user's activities.
     */
    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    /**
     * Retrieve the value of a specific attribute by key.
     */
    public function getAttributeByKey(string $key): ?string
    {
        return $this->attributes()->where('key', $key)->value('value');
    }

    /**
     * Add or update an attribute for the user.
     */
    public function setAttributeByKey(string $key, string $value): void
    {
        $this->attributes()->updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    /**
     * Remove an attribute from the user.
     */
    public function removeAttributeByKey(string $key): void
    {
        $this->attributes()->where('key', $key)->delete();
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new \App\Notifications\ResetPasswordNotification($token));
    }
}
