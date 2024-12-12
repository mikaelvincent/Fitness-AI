<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'description',
        'notes',
        'metrics',
    ];

    /**
     * Each activity may belong to a parent activity.
     */
    public function parent()
    {
        return $this->belongsTo(Activity::class, 'parent_id');
    }

    /**
     * Each activity may have multiple child activities.
     */
    public function children()
    {
        return $this->hasMany(Activity::class, 'parent_id');
    }
}
