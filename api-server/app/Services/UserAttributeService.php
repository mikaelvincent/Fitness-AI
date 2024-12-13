<?php

namespace App\Services;

use App\Repositories\UserAttributeRepository;

class UserAttributeService
{
    protected UserAttributeRepository $repository;

    /**
     * Constructor.
     *
     * @param UserAttributeRepository $repository
     */
    public function __construct(UserAttributeRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Retrieve all attributes for a user.
     *
     * @param int $userId
     * @return array
     */
    public function getAttributes(int $userId): array
    {
        return $this->repository->getAllAttributes($userId)->toArray();
    }

    /**
     * Add or update user attributes.
     *
     * @param int $userId
     * @param array $attributes
     * @return void
     */
    public function updateAttributes(int $userId, array $attributes): void
    {
        $this->repository->upsertAttributes($userId, $attributes);
    }

    /**
     * Delete specified user attributes.
     *
     * @param int $userId
     * @param array $keys
     * @return void
     */
    public function deleteAttributes(int $userId, array $keys): void
    {
        $this->repository->deleteAttributes($userId, $keys);
    }
}
