<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\UserAttributeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserAttributeController extends Controller
{
    protected UserAttributeService $service;

    /**
     * Constructor.
     *
     * @param UserAttributeService $service
     */
    public function __construct(UserAttributeService $service)
    {
        $this->service = $service;
    }

    /**
     * Retrieve all attributes for the authenticated user.
     */
    public function index(Request $request)
    {
        $attributes = $this->service->getAttributes($request->user()->id);

        return response()->json([
            'data' => $attributes,
        ], 200);
    }

    /**
     * Add or update attributes for the authenticated user.
     * Wrapped in a transaction to ensure atomicity.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'attributes'     => ['required', 'array'],
            'attributes.*'   => 'string|max:255',
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
                        $validator->errors()->add('attributes.' . $key, 'Attribute keys may not be greater than 255 characters.');
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        DB::transaction(function () use ($request, $validated) {
            $this->service->updateAttributes($request->user()->id, $validated['attributes']);
        });

        return response()->json([
            'message' => 'Attributes updated successfully.',
        ], 200);
    }

    /**
     * Delete specified attributes for the authenticated user.
     * Wrapped in a transaction to ensure atomicity.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'keys'   => 'required|array',
            'keys.*' => 'string|max:255',
        ]);

        DB::transaction(function () use ($request, $validated) {
            $this->service->deleteAttributes($request->user()->id, $validated['keys']);
        });

        return response()->json([
            'message' => 'Attributes deleted successfully.',
        ], 200);
    }
}
