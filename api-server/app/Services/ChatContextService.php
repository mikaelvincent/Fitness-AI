<?php

namespace App\Services;

use Carbon\Carbon;

/**
 * Retrieves and prepares user attributes and recent activities as context for the chatbot.
 */
class ChatContextService
{
    protected UserAttributeService $userAttributeService;
    protected ActivityService $activityService;

    public function __construct(
        UserAttributeService $userAttributeService,
        ActivityService $activityService
    ) {
        $this->userAttributeService = $userAttributeService;
        $this->activityService = $activityService;
    }

    /**
     * Retrieve user attributes and activities from the past three months.
     * Returns a structured array suitable for providing context to the chatbot.
     */
    public function getContextForUser(int $userId): array
    {
        // Calculate the date range for the last three months
        $toDate = Carbon::now()->toDateString();
        $fromDate = Carbon::now()->subMonths(3)->toDateString();

        // Retrieve attributes
        $attributes = $this->userAttributeService->getAttributesForUser($userId);

        // Retrieve nested activities from the last three months
        $activities = $this->activityService->getUserActivities($userId, $fromDate, $toDate, true);

        return [
            'attributes' => $attributes,
            'activities' => $activities,
        ];
    }
}
