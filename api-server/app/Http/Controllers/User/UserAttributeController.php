<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserAttributeController extends Controller
{
    /**
     * Retrieve all attributes for the authenticated user.
     */
    public function index(Request $request)
    {
        $attributes = $request->user()->attributes()->pluck('value', 'key');

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
                }
            }
        });

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        DB::transaction(function () use ($request, $validated) {
            foreach ($validated['attributes'] as $key => $value) {
                $request->user()->setAttributeByKey($key, $value);
            }
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
            'keys' => 'required|array',
            'keys.*' => 'string|max:255',
        ]);

        DB::transaction(function () use ($request, $validated) {
            foreach ($validated['keys'] as $key) {
                $request->user()->removeAttributeByKey($key);
            }
        });

        return response()->json([
            'message' => 'Attributes deleted successfully.',
        ], 200);
    }
}
