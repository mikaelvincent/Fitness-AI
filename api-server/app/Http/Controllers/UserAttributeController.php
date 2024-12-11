<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'attributes'   => 'required|array',
            'attributes.*' => 'string',
        ]);

        foreach ($validated['attributes'] as $key => $value) {
            $request->user()->setAttributeByKey($key, $value);
        }

        return response()->json([
            'message' => 'Attributes updated successfully.',
        ], 200);
    }

    /**
     * Delete specified attributes for the authenticated user.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'keys'   => 'required|array',
            'keys.*' => 'string',
        ]);

        foreach ($validated['keys'] as $key) {
            $request->user()->removeAttributeByKey($key);
        }

        return response()->json([
            'message' => 'Attributes deleted successfully.',
        ], 200);
    }
}
