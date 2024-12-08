<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];

    /**
     * Belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Has many attributes.
     */
    public function attributes()
    {
        return $this->hasMany(UserProfileAttribute::class, 'user_profile_id');
    }
}
