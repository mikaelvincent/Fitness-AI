<?php

namespace App\Http\Controllers\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActivityController extends Controller
{
    /**
     * Store a newly created activity.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'parent_id' => ['nullable', 'integer', 'exists:activities,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'metrics' => ['nullable', 'array'],
        ]);

        $validated = $validator->validate();

        $activity = Activity::create($validated);

        return response()->json(['data' => $activity], 201);
    }

    /**
     * Display a listing of activities.
     * Optionally include hierarchical nesting by passing ?with_children=true.
     */
    public function index(Request $request)
    {
        $query = Activity::query();

        if ($request->boolean('with_children')) {
            $query->with('children');
        }

        $activities = $query->get();

        return response()->json(['data' => $activities], 200);
    }

    /**
     * Display a specific activity.
     * Optionally include hierarchical nesting by passing ?with_children=true.
     */
    public function show(Request $request, $id)
    {
        $query = Activity::where('id', $id);

        if ($request->boolean('with_children')) {
            $query->with('children');
        }

        $activity = $query->firstOrFail();

        return response()->json(['data' => $activity], 200);
    }

    /**
     * Update the specified activity.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'parent_id' => ['nullable', 'integer', 'exists:activities,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'metrics' => ['nullable', 'array'],
        ]);

        $validated = $validator->validate();

        $activity = Activity::findOrFail($id);
        $activity->update($validated);

        return response()->json(['data' => $activity], 200);
    }

    /**
     * Remove the specified activity.
     */
    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);
        $activity->delete();

        return response()->json(null, 204);
    }
}
