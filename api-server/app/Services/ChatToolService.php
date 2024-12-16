<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

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
     */
    public function getUserAttributes(int $userId, array $arguments): array
    {
        return $this->userAttributeService->getAttributes($userId);
    }

    /**
     * Add or update the authenticated user's attributes.
     * If the 'attributes' key is missing, treat the entire arguments array as attributes.
     */
    public function updateUserAttributes(int $userId, array $arguments): array
    {
        // If the arguments do not contain 'attributes', assume all key-value pairs are attributes.
        if (!isset($arguments['attributes'])) {
            $arguments = ['attributes' => $arguments];
        }

        $attributes = $arguments['attributes'] ?? [];

        if (!is_array($attributes)) {
            Log::warning('Invalid attributes provided for updateUserAttributes.', [
                'user_id' => $userId,
                'attributes' => $attributes
            ]);
            return ['message' => 'Invalid attributes provided.'];
        }

        $this->userAttributeService->updateAttributes($userId, $attributes);
        return ['message' => 'User attributes updated successfully.'];
    }

    /**
     * Delete specified attributes from the authenticated user.
     */
    public function deleteUserAttributes(int $userId, array $arguments): array
    {
        $keys = $arguments['keys'] ?? [];

        if (!is_array($keys)) {
            Log::warning('Invalid keys provided for deleteUserAttributes.', [
                'user_id' => $userId,
                'keys' => $keys
            ]);
            return ['message' => 'Invalid keys provided.'];
        }

        $this->userAttributeService->deleteAttributes($userId, $keys);
        return ['message' => 'User attributes deleted successfully.'];
    }

    /**
     * Retrieve the authenticated user's activities with optional filtering.
     */
    public function getActivities(int $userId, array $arguments): array
    {
        $filters = [
            'from_date' => $arguments['from_date'] ?? null,
            'to_date' => $arguments['to_date'] ?? null,
        ];

        return $this->activityService->getActivities($userId, $filters)->toArray();
    }

    /**
     * Add or update the authenticated user's activities.
     */
    public function updateActivities(int $userId, array $arguments): array
    {
        $activities = $arguments['activities'] ?? [];

        if (!is_array($activities)) {
            Log::warning('Invalid activities provided for updateActivities.', [
                'user_id' => $userId,
                'activities' => $activities
            ]);
            return ['message' => 'Invalid activities provided.'];
        }

        $result = $this->activityService->upsertActivities($userId, $activities);
        return [
            'message' => 'Activities processed successfully.',
            'data' => $result,
        ];
    }

    /**
     * Delete specified activities from the authenticated user.
     */
    public function deleteActivities(int $userId, array $arguments): array
    {
        $activityIds = $arguments['activityIds'] ?? [];

        if (!is_array($activityIds)) {
            Log::warning('Invalid activityIds provided for deleteActivities.', [
                'user_id' => $userId,
                'activityIds' => $activityIds
            ]);
            return ['message' => 'Invalid activity IDs provided.'];
        }

        $this->activityService->deleteActivities($userId, $activityIds);
        return ['message' => 'Activities deleted successfully.'];
    }
}
