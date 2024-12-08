<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Repositories\DynamicProfileAttributesRepository;

/**
 * Handles user profile updates, including dynamic attributes.
 */
class ProfileController extends Controller
{
    protected DynamicProfileAttributesRepository $attributesRepository;

    /**
     * Inject the repository for dynamic profile attributes.
     */
    public function __construct(DynamicProfileAttributesRepository $attributesRepository)
    {
        $this->attributesRepository = $attributesRepository;
    }

    /**
     * Update the authenticated user's profile attributes.
     *
     * Validates provided attributes. If a value is null, the attribute is removed.
     * Otherwise, attributes are created or updated.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated.'
            ], 401);
        }

        // Validate the incoming data structure
        $validator = Validator::make($request->all(), [
            'attributes' => 'required|array',
            'attributes.*' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Process attributes: set or remove as needed
        foreach ($request->attributes as $key => $value) {
            if ($value === null) {
                $this->attributesRepository->removeAttributeForUser($user->id, $key);
            } else {
                $this->attributesRepository->setAttributeForUser($user->id, $key, $value);
            }
        }

        return response()->json([
            'message' => 'Profile updated successfully.',
        ], 200);
    }
}
