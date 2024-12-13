<?php

namespace App\Services;

/**
 * Provides chatbot-accessible tools for managing user attributes and activities.
 */
class ChatToolService
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
     * Retrieve the authenticated user's attributes.
     *
     * @param int $userId
     * @return array
     */
    public function getUserAttributes(int $userId): array
    {
        return $this->userAttributeService->getAttributes($userId);
    }

    /**
     * Add or update the authenticated user's attributes.
     *
     * @param int $userId
     * @param array $attributes
     * @return array
     */
    public function updateUserAttributes(int $userId, array $attributes): array
    {
        $this->userAttributeService->updateAttributes($userId, $attributes);
        return ['message' => 'User attributes updated successfully.'];
    }

    /**
     * Delete specified attributes from the authenticated user.
     *
     * @param int $userId
     * @param array $keys
     * @return array
     */
    public function deleteUserAttributes(int $userId, array $keys): array
    {
        $this->userAttributeService->deleteAttributes($userId, $keys);
        return ['message' => 'User attributes deleted successfully.'];
    }

    /**
     * Retrieve the authenticated user's activities with optional filtering.
     *
     * @param int $userId
     * @param array $filters
     * @return array
     */
    public function getActivities(int $userId, array $filters): array
    {
        $activities = $this->activityService->getActivities($userId, $filters)->toArray();
        return $activities;
    }

    /**
     * Add or update the authenticated user's activities.
     *
     * @param int $userId
     * @param array $activities
     * @return array
     */
    public function updateActivities(int $userId, array $activities): array
    {
        $result = $this->activityService->upsertActivities($userId, $activities);
        return [
            'message' => 'Activities processed successfully.',
            'data' => $result,
        ];
    }

    /**
     * Delete specified activities from the authenticated user.
     *
     * @param int $userId
     * @param array $activityIds
     * @return array
     */
    public function deleteActivities(int $userId, array $activityIds): array
    {
        $this->activityService->deleteActivities($userId, $activityIds);
        return ['message' => 'Activities deleted successfully.'];
    }
}
