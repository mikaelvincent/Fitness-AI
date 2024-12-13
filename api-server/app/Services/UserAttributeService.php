<?php

namespace App\Services;

use App\Repositories\UserAttributeRepository;
use Illuminate\Support\Facades\DB;

class UserAttributeService
{
    protected UserAttributeRepository $userAttributeRepository;

    public function __construct(UserAttributeRepository $userAttributeRepository)
    {
        $this->userAttributeRepository = $userAttributeRepository;
    }

    /**
     * Return user attributes as a key-value array.
     */
    public function getAttributesForUser(int $userId): array
    {
        return $this->userAttributeRepository->getUserAttributesByUserId($userId);
    }

    /**
     * Validate and update attributes within a transaction.
     */
    public function updateAttributesForUser(int $userId, array $attributes): void
    {
        DB::transaction(function () use ($userId, $attributes) {
            $this->userAttributeRepository->upsertUserAttributes($userId, $attributes);
        });
    }

    /**
     * Validate and delete attributes within a transaction.
     */
    public function deleteAttributesForUser(int $userId, array $keys): void
    {
        DB::transaction(function () use ($userId, $keys) {
            $this->userAttributeRepository->deleteUserAttributes($userId, $keys);
        });
    }
}
