<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationToken extends Model
{
    protected $fillable = ['email', 'token', 'expires_at'];

    public $timestamps = true;
}
