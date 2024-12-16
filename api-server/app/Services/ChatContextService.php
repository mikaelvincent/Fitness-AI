<?php

namespace App\Services;

use Carbon\Carbon;

class ChatContextService
{
    protected UserAttributeService $userAttributeService;
    protected ActivityService $activityService;

    /**
     * @param UserAttributeService $userAttributeService
     * @param ActivityService $activityService
     */
    public function __construct(
        UserAttributeService $userAttributeService,
        ActivityService $activityService
    ) {
        $this->userAttributeService = $userAttributeService;
        $this->activityService = $activityService;
    }

    /**
     * Retrieve context from the past three months.
     *
     * @param int $userId
     * @return array
     */
    public function getContext(int $userId): array
    {
        $threeMonthsAgo = Carbon::now()->subMonths(3)->format('Y-m-d');
        $today = Carbon::now()->format('Y-m-d');

        $attributes = $this->userAttributeService->getAttributes($userId);
        $activities = $this->activityService->getActivities($userId, [
            'from_date' => $threeMonthsAgo,
            'to_date' => $today,
        ]);

        return [
            'user_attributes' => $attributes,
            'activities' => $activities->toArray(),
        ];
    }
}
