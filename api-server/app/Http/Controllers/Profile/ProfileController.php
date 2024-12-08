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

    /**
     * Retrieve the authenticated user's profile and optional filtered attributes.
     *
     * @group Profile Management
     * @authenticated
     *
     * @queryParam attributes string Optional comma-separated list of attribute keys to retrieve. Example: key1,key2
     *
     * @response 200 {
     *   "user_id": 1,
     *   "attributes": {
     *     "key1": "value1",
     *     "key2": "value2"
     *   }
     * }
     *
     * @response 401 {
     *   "message": "User not authenticated."
     * }
     */
    public function show(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated.'
            ], 401);
        }

        // Retrieve all attributes
        $allAttributes = $this->attributesRepository->getAttributesForUser($user->id);

        // If 'attributes' query parameter present, filter the attributes
        $requestedKeys = $request->query('attributes');
        if ($requestedKeys !== null) {
            $keys = array_filter(array_map('trim', explode(',', $requestedKeys)));
            $filtered = $allAttributes->only($keys);
        } else {
            $filtered = $allAttributes;
        }

        return response()->json([
            'user_id' => $user->id,
            'attributes' => $filtered
        ], 200);
    }
}
