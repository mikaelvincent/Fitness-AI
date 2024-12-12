<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'parent_id',
        'position',
        'name',
        'description',
        'notes',
        'metrics',
    ];

    protected $casts = [
        'metrics' => 'array',
        'date' => 'date',
    ];

    public function parent()
    {
        return $this->belongsTo(Activity::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Activity::class, 'parent_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Recursively update all descendants' dates to match the given date.
     */
    public function syncDescendantsDate($date)
    {
        foreach ($this->children as $child) {
            $child->date = $date;
            $child->save();
            $child->syncDescendantsDate($date);
        }
    }
}
