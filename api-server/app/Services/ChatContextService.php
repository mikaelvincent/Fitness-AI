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
     * Retrieve context from 3 months ago to 1 month from now.
     *
     * @param int $userId
     * @return array
     */
    public function getContext(int $userId): array
    {
        $threeMonthsAgo = Carbon::now()->subMonths(3)->format('Y-m-d');
        $oneMonthFromNow = Carbon::now()->addMonth(1)->format('Y-m-d');

        $attributes = $this->userAttributeService->getAttributes($userId);
        $activities = $this->activityService->getActivities($userId, [
            'from_date' => $threeMonthsAgo,
            'to_date' => $oneMonthFromNow,
        ]);

        return [
            'user_attributes' => $attributes,
            'activities' => $activities->toArray(),
        ];
    }
}
