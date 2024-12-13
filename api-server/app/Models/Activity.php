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
        'completed',
    ];

    protected $casts = [
        'metrics' => 'array',
        'date' => 'date',
        'completed' => 'boolean',
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

    /**
     * Recursively set all descendants' completed status.
     */
    public function syncDescendantsCompletion(bool $completed)
    {
        foreach ($this->children as $child) {
            $child->completed = $completed;
            $child->save();
            $child->syncDescendantsCompletion($completed);
        }
    }

    /**
     * Check ancestors and update their completed status if needed.
     * If all siblings are completed, set the parent's completed to true.
     * Propagate upward until reaching an ancestor that should not change.
     */
    public function syncAncestorsCompletionIfNeeded()
    {
        $parent = $this->parent;
        if (!$parent) {
            return;
        }

        // Determine if all siblings are completed
        $allSiblingsCompleted = $parent->children()
            ->where('id', '!=', $this->id)
            ->where('completed', false)
            ->count() === 0;

        // If all siblings are completed and this activity is completed,
        // set the parent's completed to true.
        if ($this->completed && $allSiblingsCompleted && !$parent->completed) {
            $parent->completed = true;
            $parent->save();
            $parent->syncAncestorsCompletionIfNeeded();
        }
    }
}
