<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfileAttribute extends Model
{
    use HasFactory;

    protected $fillable = ['user_profile_id', 'attribute_key', 'attribute_value'];

    /**
     * Belongs to a user profile.
     */
    public function userProfile()
    {
        return $this->belongsTo(UserProfile::class, 'user_profile_id');
    }

    /**
     * Scope to filter attributes by user ID.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->whereHas('userProfile', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        });
    }

    /**
     * Scope to filter attributes by key.
     */
    public function scopeByKey($query, $key)
    {
        return $query->where('attribute_key', $key);
    }
}
