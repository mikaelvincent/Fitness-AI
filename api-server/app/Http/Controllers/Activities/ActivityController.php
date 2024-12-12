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

        // Assign current user's id to the new activity
        $activity = Activity::create(array_merge($validated, [
            'user_id' => $request->user()->id,
        ]));

        return response()->json(['data' => $activity], 201);
    }

    /**
     * Display a listing of activities.
     */
    public function index(Request $request)
    {
        $query = Activity::where('user_id', $request->user()->id);

        if ($request->boolean('with_children')) {
            $query->with('children');
        }

        $activities = $query->get();

        return response()->json(['data' => $activities], 200);
    }

    /**
     * Display a specific activity.
     */
    public function show(Request $request, $id)
    {
        $query = Activity::where('id', $id)
            ->where('user_id', $request->user()->id);

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

        $activity = Activity::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $activity->update($validated);

        return response()->json(['data' => $activity], 200);
    }

    /**
     * Remove the specified activity.
     */
    public function destroy(Request $request, $id)
    {
        $activity = Activity::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $activity->delete();

        return response()->json(null, 204);
    }
}
