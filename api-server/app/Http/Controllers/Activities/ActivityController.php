<?php

namespace App\Http\Controllers\Activities;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Activity;

class ActivityController extends Controller
{
    /**
     * Retrieve all activities for the authenticated user.
     */
    public function index(Request $request)
    {
        $activities = $request->user()->activities()->with('children')->get();

        return response()->json(['data' => $activities], 200);
    }

    /**
     * Add or update activities for the authenticated user.
     * Expects an 'activities' array in the request.
     * If 'id' is provided, the corresponding activity is updated; otherwise, a new one is created.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'activities' => ['required', 'array'],
            'activities.*.id' => ['nullable', 'integer', 'exists:activities,id'],
            'activities.*.parent_id' => ['nullable', 'integer', 'exists:activities,id'],
            'activities.*.name' => ['required', 'string', 'max:255'],
            'activities.*.description' => ['nullable', 'string'],
            'activities.*.notes' => ['nullable', 'string'],
            'activities.*.metrics' => ['nullable', 'array'],
        ]);

        $validated = $validator->validate();
        $updatedActivities = [];

        foreach ($validated['activities'] as $activityData) {
            if (isset($activityData['id'])) {
                $activity = $request->user()->activities()->where('id', $activityData['id'])->firstOrFail();
                $activity->update($activityData);
                $updatedActivities[] = $activity;
            } else {
                $updatedActivities[] = $request->user()->activities()->create($activityData);
            }
        }

        return response()->json([
            'message' => 'Activities updated successfully.',
            'data' => $updatedActivities,
        ], 200);
    }

    /**
     * Delete specified activities for the authenticated user.
     * Expects an 'ids' array of activity IDs to delete.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:activities,id',
        ]);

        $request->user()->activities()->whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'message' => 'Activities deleted successfully.',
        ], 200);
    }
}
