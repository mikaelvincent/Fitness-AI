<?php

namespace App\Http\Controllers\Activities;

use App\Http\Controllers\Controller;
use App\Services\ActivityService;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    protected ActivityService $activityService;

    public function __construct(ActivityService $activityService)
    {
        $this->activityService = $activityService;
    }

    /**
     * Retrieve activities with optional nesting and date filtering.
     */
    public function index(Request $request)
    {
        $fromDate = $request->query('from_date');
        $toDate = $request->query('to_date');
        $nested = $request->boolean('nested', false);

        $activities = $this->activityService->getUserActivities(
            $request->user()->id,
            $fromDate,
            $toDate,
            $nested
        );

        return response()->json(['data' => $activities], 200);
    }

    /**
     * Add or update activities.
     */
    public function update(Request $request)
    {
        $data = $request->all();
        if (!is_array($data)) {
            return response()->json(['message' => 'Invalid payload. Expected an array of activities.'], 422);
        }

        $result = $this->activityService->processUserActivities($request->user()->id, $data);

        if (isset($result['errors'])) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $result['errors']], 422);
        }

        return response()->json([
            'message' => 'Activities processed successfully.',
            'data' => $result,
        ], 200);
    }

    /**
     * Delete activities by ID.
     */
    public function destroy(Request $request)
    {
        $data = $request->all();
        if (!is_array($data)) {
            return response()->json(['message' => 'Invalid payload. Expected an array of activity IDs.'], 422);
        }

        $result = $this->activityService->deleteUserActivities($request->user()->id, $data);

        if (isset($result['errors'])) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $result['errors']], 422);
        }

        return response()->json(['message' => 'Activities deleted successfully.'], 200);
    }
}
