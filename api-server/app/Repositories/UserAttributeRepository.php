<?php

namespace App\Repositories;

use App\Models\UserAttribute;

class UserAttributeRepository
{
    /**
     * Retrieve all attributes for a given user ID as a key-value array.
     */
    public function getUserAttributesByUserId(int $userId): array
    {
        return UserAttribute::where('user_id', $userId)->pluck('value', 'key')->toArray();
    }

    /**
     * Upsert multiple attributes for a given user ID.
     */
    public function upsertUserAttributes(int $userId, array $attributes): void
    {
        foreach ($attributes as $key => $value) {
            UserAttribute::updateOrCreate(
                ['user_id' => $userId, 'key' => $key],
                ['value' => $value]
            );
        }
    }

    /**
     * Remove specified attributes by keys for a given user ID.
     */
    public function deleteUserAttributes(int $userId, array $keys): void
    {
        UserAttribute::where('user_id', $userId)
            ->whereIn('key', $keys)
            ->delete();
    }
}
