<?php

namespace App\Repositories;

use App\Models\Activity;
use Illuminate\Support\Collection;

class ActivityRepository
{
    /**
     * Retrieve activities with optional filters.
     *
     * @param int $userId
     * @param array $filters
     * @return Collection
     */
    public function getActivities(int $userId, array $filters = []): Collection
    {
        $query = Activity::where('user_id', $userId);

        if (isset($filters['from_date']) && isset($filters['to_date'])) {
            $query->whereBetween('date', [$filters['from_date'], $filters['to_date']]);
        } elseif (isset($filters['from_date'])) {
            $query->where('date', '>=', $filters['from_date']);
        } elseif (isset($filters['to_date'])) {
            $query->where('date', '<=', $filters['to_date']);
        }

        return $query->orderBy('date')
                     ->orderBy('parent_id')
                     ->orderBy('position')
                     ->orderBy('name')
                     ->get();
    }

    /**
     * Add or update activities.
     *
     * @param int $userId
     * @param array $activities
     * @return array
     */
    public function upsertActivities(int $userId, array $activities): array
    {
        $processedActivities = [];

        foreach ($activities as $activityData) {
            $activityData['user_id'] = $userId;

            if (isset($activityData['id'])) {
                $activity = Activity::where('user_id', $userId)->find($activityData['id']);
                if ($activity) {
                    $oldCompleted = $activity->completed;
                    $activity->update($activityData);
                    $processedActivities[] = $activity;

                    // Handle completion logic
                    if ($oldCompleted !== $activity->completed) {
                        $activity->syncDescendantsCompletion($activity->completed);
                        if ($activity->completed) {
                            $activity->syncAncestorsCompletionIfNeeded();
                        }
                    }
                }
            } else {
                $newActivity = Activity::create($activityData);
                $processedActivities[] = $newActivity;

                // Handle completion logic for new activities
                if ($newActivity->completed) {
                    $newActivity->syncDescendantsCompletion(true);
                    $newActivity->syncAncestorsCompletionIfNeeded();
                }
            }
        }

        return $processedActivities;
    }

    /**
     * Delete activities by IDs.
     *
     * @param int $userId
     * @param array $ids
     * @return void
     */
    public function deleteActivities(int $userId, array $ids): void
    {
        Activity::where('user_id', $userId)
                ->whereIn('id', $ids)
                ->delete();
    }
}
