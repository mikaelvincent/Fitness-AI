<?php

namespace App\Repositories;

use App\Models\Activity;

class ActivityRepository
{
    /**
     * Retrieve user activities filtered by optional date range.
     */
    public function getActivitiesForUser(
        int $userId,
        ?string $fromDate = null,
        ?string $toDate = null
    ) {
        $query = Activity::where('user_id', $userId);

        if ($fromDate && $toDate) {
            $query->whereBetween('date', [$fromDate, $toDate]);
        } elseif ($fromDate) {
            $query->where('date', '>=', $fromDate);
        } elseif ($toDate) {
            $query->where('date', '<=', $toDate);
        }

        return $query->orderBy('date')
            ->orderBy('parent_id')
            ->orderBy('position')
            ->orderBy('name')
            ->get();
    }

    /**
     * Find a single activity by ID for a given user.
     */
    public function findActivityByIdForUser(int $userId, int $activityId): ?Activity
    {
        return Activity::where('user_id', $userId)->find($activityId);
    }

    /**
     * Create a new activity for a given user.
     */
    public function createActivityForUser(int $userId, array $data): Activity
    {
        $data['user_id'] = $userId;
        return Activity::create($data);
    }

    /**
     * Update an existing activity.
     */
    public function updateActivity(Activity $activity, array $data): void
    {
        $activity->update($data);
    }

    /**
     * Delete activities by IDs for a given user.
     */
    public function deleteActivitiesByIds(int $userId, array $ids): void
    {
        Activity::where('user_id', $userId)
            ->whereIn('id', $ids)
            ->delete();
    }
}
