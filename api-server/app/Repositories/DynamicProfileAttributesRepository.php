<?php

namespace App\Repositories;

use App\Models\UserProfile;
use App\Models\UserProfileAttribute;
use Illuminate\Support\Collection;

class DynamicProfileAttributesRepository
{
    /**
     * Retrieve attributes for a given user.
     * Returns a collection of key-value pairs.
     */
    public function getAttributesForUser(int $userId): Collection
    {
        return UserProfileAttribute::forUser($userId)
            ->get()
            ->mapWithKeys(function ($attr) {
                return [$attr->attribute_key => $attr->attribute_value];
            });
    }

    /**
     * Set or update an attribute for a given user's profile.
     * Creates the user profile if it does not exist.
     */
    public function setAttributeForUser(int $userId, string $key, $value): void
    {
        $profile = UserProfile::firstOrCreate(['user_id' => $userId]);

        UserProfileAttribute::updateOrCreate(
            [
                'user_profile_id' => $profile->id,
                'attribute_key' => $key,
            ],
            [
                'attribute_value' => $value,
            ]
        );
    }

    /**
     * Remove an attribute by key.
     */
    public function removeAttributeForUser(int $userId, string $key): void
    {
        UserProfileAttribute::forUser($userId)->byKey($key)->delete();
    }
}
