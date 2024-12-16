<?php

namespace App\Repositories;

use App\Models\UserAttribute;

class UserAttributeRepository
{
    /**
     * Retrieve all attributes for a given user.
     *
     * @param int $userId
     * @return \Illuminate\Support\Collection
     */
    public function getAllAttributes(int $userId)
    {
        return UserAttribute::where('user_id', $userId)->pluck('value', 'key');
    }

    /**
     * Add or update user attributes.
     *
     * @param int $userId
     * @param array $attributes
     * @return void
     */
    public function upsertAttributes(int $userId, array $attributes): void
    {
        foreach ($attributes as $key => $value) {
            UserAttribute::updateOrCreate(
                ['user_id' => $userId, 'key' => $key],
                ['value' => $value]
            );
        }
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
        UserAttribute::where('user_id', $userId)
                     ->whereIn('key', $keys)
                     ->delete();
    }
}
