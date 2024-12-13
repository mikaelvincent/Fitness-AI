<?php

namespace App\Http\Controllers\Activities;

use App\Http\Controllers\Controller;
use App\Services\ActivityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    protected ActivityService $service;

    /**
     * Constructor.
     *
     * @param ActivityService $service
     */
    public function __construct(ActivityService $service)
    {
        $this->service = $service;
    }

    /**
     * Retrieve activities with optional nesting and date filtering.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['from_date', 'to_date']);
        $activities = $this->service->getActivities($request->user()->id, $filters);

        if ($request->boolean('nested', false)) {
            $activities = $this->buildNestedStructure($activities);
        }

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

        $validator = Validator::make(['activities' => $data], [
            'activities' => ['required', 'array'],
            'activities.*.id' => ['nullable', 'integer'],
            'activities.*.date' => ['required', 'date'],
            'activities.*.parent_id' => ['nullable', 'integer'],
            'activities.*.position' => ['nullable', 'integer'],
            'activities.*.name' => ['required', 'string', 'max:255'],
            'activities.*.description' => ['nullable', 'string'],
            'activities.*.notes' => ['nullable', 'string'],
            'activities.*.metrics' => ['nullable', 'array'],
            'activities.*.completed' => ['nullable', 'boolean'],
        ]);

        $validator->after(function ($validator) use ($request, $data) {
            foreach ($data as $key => $activityData) {
                if (isset($activityData['id'])) {
                    $activity = $request->user()->activities()->find($activityData['id']);
                    if (!$activity) {
                        $validator->errors()->add('activities.' . $key . '.id', 'The selected activity ID is invalid.');
                    }
                }
                if (isset($activityData['parent_id'])) {
                    $parentActivity = $request->user()->activities()->find($activityData['parent_id']);
                    if (!$parentActivity) {
                        $validator->errors()->add('activities.' . $key . '.parent_id', 'The selected parent activity ID is invalid.');
                    }
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $validator->errors()], 422);
        }

        DB::transaction(function () use ($request, $data, &$processedActivities) {
            $processedActivities = $this->service->upsertActivities($request->user()->id, $data);
        });

        return response()->json([
            'message' => 'Activities processed successfully.',
            'data' => $processedActivities,
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

        $validator = Validator::make(['ids' => $data], [
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer'],
        ]);

        $validator->after(function ($validator) use ($request, $data) {
            foreach ($data as $index => $id) {
                $activity = $request->user()->activities()->find($id);
                if (!$activity) {
                    $validator->errors()->add('ids.' . $index, 'The selected activity ID is invalid.');
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $validator->errors()], 422);
        }

        DB::transaction(function () use ($request, $data) {
            $this->service->deleteActivities($request->user()->id, $data);
        });

        return response()->json([
            'message' => 'Activities deleted successfully.',
        ], 200);
    }

    /**
     * Build a nested structure from a flat collection of activities.
     */
    protected function buildNestedStructure($activities)
    {
        $activitiesById = [];

        foreach ($activities as $activity) {
            $activitiesById[$activity->id] = $activity->toArray();
            $activitiesById[$activity->id]['children'] = [];
        }

        foreach ($activitiesById as &$activity) {
            if ($activity['parent_id'] && isset($activitiesById[$activity['parent_id']])) {
                $activitiesById[$activity['parent_id']]['children'][] = &$activity;
            }
        }
        unset($activity);

        $nestedActivities = [];
        foreach ($activitiesById as $activity) {
            if (!$activity['parent_id']) {
                $nestedActivities[] = $activity;
            }
        }

        return $nestedActivities;
    }
}
