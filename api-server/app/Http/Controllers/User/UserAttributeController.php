<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\UserAttributeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserAttributeController extends Controller
{
    protected UserAttributeService $userAttributeService;

    public function __construct(UserAttributeService $userAttributeService)
    {
        $this->userAttributeService = $userAttributeService;
    }

    /**
     * Retrieve all attributes for the authenticated user.
     */
    public function index(Request $request)
    {
        $attributes = $this->userAttributeService->getAttributesForUser($request->user()->id);

        return response()->json(['data' => $attributes], 200);
    }

    /**
     * Add or update attributes for the authenticated user.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'attributes' => ['required', 'array'],
            'attributes.*' => 'string|max:255',
        ]);

        $validator->after(function ($validator) use ($request) {
            $attributes = $request->input('attributes');
            if (is_array($attributes)) {
                foreach ($attributes as $key => $value) {
                    if (!is_string($key)) {
                        $validator->errors()->add('attributes', 'All attribute keys must be strings.');
                        break;
                    }
                    if (mb_strlen($key) > 255) {
                        $validator->errors()->add("attributes.$key", 'Attribute keys may not be greater than 255 characters.');
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $this->userAttributeService->updateAttributesForUser($request->user()->id, $validated['attributes']);

        return response()->json(['message' => 'Attributes updated successfully.'], 200);
    }

    /**
     * Delete specified attributes for the authenticated user.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'keys' => 'required|array',
            'keys.*' => 'string|max:255',
        ]);

        $this->userAttributeService->deleteAttributesForUser($request->user()->id, $validated['keys']);

        return response()->json(['message' => 'Attributes deleted successfully.'], 200);
    }
}
