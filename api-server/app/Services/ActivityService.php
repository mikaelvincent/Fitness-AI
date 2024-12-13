<?php

namespace App\Services;

use App\Models\Activity;
use App\Repositories\ActivityRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ActivityService
{
    protected ActivityRepository $activityRepository;

    public function __construct(ActivityRepository $activityRepository)
    {
        $this->activityRepository = $activityRepository;
    }

    /**
     * Retrieve activities and optionally build a nested structure.
     */
    public function getUserActivities(int $userId, ?string $fromDate, ?string $toDate, bool $nested): array
    {
        $activities = $this->activityRepository->getActivitiesForUser($userId, $fromDate, $toDate);

        if ($nested) {
            return $this->buildNestedStructure($activities->toArray());
        }

        return $activities->toArray();
    }

    /**
     * Process creation or updates of activities within a transaction.
     * Performs validation and ensures consistent completion and date propagation.
     */
    public function processUserActivities(int $userId, array $activitiesData): array
    {
        // Validate payload
        $validator = Validator::make(['activities' => $activitiesData], [
            'activities' => ['required', 'array'],
            'activities.*.id' => ['nullable', 'integer'],
            'activities.*.date' => ['required', 'date'],
            'activities.*.parent_id' => ['nullable', 'integer'],
            'activities.*.position' => ['nullable', 'integer'],
            'activities.*.name' => ['required', 'string', 'max:255'],
            'activities.*.description' => ['nullable', 'string'],
            'activities.*.notes' => ['nullable', 'string'],
            'activities.*.metrics' => ['nullable', 'array'],
            'activities.*.completed' => ['nullable', 'boolean'],
        ]);

        $validator->after(function ($validator) use ($activitiesData, $userId) {
            foreach ($activitiesData as $key => $activityData) {
                if (isset($activityData['id'])) {
                    $activity = $this->activityRepository->findActivityByIdForUser($userId, $activityData['id']);
                    if (!$activity) {
                        $validator->errors()->add("activities.$key.id", "The selected activity ID is invalid.");
                    }
                }
                if (isset($activityData['parent_id'])) {
                    $parentActivity = $this->activityRepository->findActivityByIdForUser($userId, $activityData['parent_id']);
                    if (!$parentActivity) {
                        $validator->errors()->add("activities.$key.parent_id", "The selected parent activity ID is invalid.");
                    }
                }
            }
        });

        if ($validator->fails()) {
            return ['errors' => $validator->errors()];
        }

        // Process activities
        $processedActivities = [];
        DB::transaction(function () use ($userId, $activitiesData, &$processedActivities) {
            foreach ($activitiesData as $activityData) {
                $activityData['user_id'] = $userId;

                if (isset($activityData['parent_id'])) {
                    $parent = $this->activityRepository->findActivityByIdForUser($userId, $activityData['parent_id']);
                    $parentDate = $parent->date;
                    if (!isset($activityData['date']) || $activityData['date'] !== $parentDate->toDateString()) {
                        $activityData['date'] = $parentDate->toDateString();
                    }
                }

                $activityData['completed'] = $activityData['completed'] ?? false;

                if (isset($activityData['id'])) {
                    $activity = $this->activityRepository->findActivityByIdForUser($userId, $activityData['id']);
                    $oldCompleted = $activity->completed;
                    $this->activityRepository->updateActivity($activity, $activityData);

                    $this->syncDatesAndCompletion($activity, $oldCompleted);
                    $processedActivities[] = $activity->fresh()->toArray();
                } else {
                    $newActivity = $this->activityRepository->createActivityForUser($userId, $activityData);
                    $this->syncDatesAndCompletion($newActivity, false);
                    $processedActivities[] = $newActivity->fresh()->toArray();
                }
            }
        });

        return $processedActivities;
    }

    /**
     * Delete activities within a transaction.
     */
    public function deleteUserActivities(int $userId, array $ids): array
    {
        // Validate IDs
        $validator = Validator::make(['ids' => $ids], [
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer'],
        ]);

        $validator->after(function ($validator) use ($ids, $userId) {
            foreach ($ids as $index => $id) {
                $activity = $this->activityRepository->findActivityByIdForUser($userId, $id);
                if (!$activity) {
                    $validator->errors()->add("ids.$index", "The selected activity ID is invalid.");
                }
            }
        });

        if ($validator->fails()) {
            return ['errors' => $validator->errors()];
        }

        DB::transaction(function () use ($userId, $ids) {
            $this->activityRepository->deleteActivitiesByIds($userId, $ids);
        });

        return [];
    }

    /**
     * Build nested structure from a flat array of activities.
     */
    protected function buildNestedStructure(array $activities): array
    {
        $activitiesById = [];
        foreach ($activities as $activity) {
            $activitiesById[$activity['id']] = $activity;
            $activitiesById[$activity['id']]['children'] = [];
        }

        foreach ($activitiesById as $id => &$activity) {
            if ($activity['parent_id'] && isset($activitiesById[$activity['parent_id']])) {
                $activitiesById[$activity['parent_id']]['children'][] = &$activity;
            }
        }
        unset($activity);

        $nestedActivities = [];
        foreach ($activitiesById as $id => $activity) {
            if (!$activity['parent_id']) {
                $nestedActivities[] = $activity;
            }
        }

        return $nestedActivities;
    }

    /**
     * Sync descendants' dates and completion state after changes.
     */
    protected function syncDatesAndCompletion(Activity $activity, bool $oldCompleted)
    {
        // Date propagation
        if ($activity->parent_id) {
            $parent = $activity->parent;
            $activity->syncDescendantsDate($parent->date);
        } else {
            $activity->syncDescendantsDate($activity->date);
        }

        // Completion logic
        if ($oldCompleted !== $activity->completed) {
            $activity->syncDescendantsCompletion($activity->completed);
            if ($activity->completed) {
                $activity->syncAncestorsCompletionIfNeeded();
            }
        }
    }
}
