<?php

namespace App\Services;

use App\Repositories\ActivityRepository;
use Illuminate\Support\Collection;

class ActivityService
{
    protected ActivityRepository $repository;

    /**
     * Constructor.
     *
     * @param ActivityRepository $repository
     */
    public function __construct(ActivityRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Retrieve activities with optional filters.
     *
     * @param int $userId
     * @param array $filters
     * @return Collection
     */
    public function getActivities(int $userId, array $filters = []): Collection
    {
        return $this->repository->getActivities($userId, $filters);
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
        return $this->repository->upsertActivities($userId, $activities);
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
        $this->repository->deleteActivities($userId, $ids);
    }
}
