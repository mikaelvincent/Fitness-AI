<?php

namespace App\Http\Controllers\Activities;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    /**
     * Retrieve activities with optional nesting and date filtering.
     */
    public function index(Request $request)
    {
        $query = $request->user()->activities();
        $fromDate = $request->query('from_date');
        $toDate = $request->query('to_date');

        if ($fromDate && $toDate) {
            $query->whereBetween('date', [$fromDate, $toDate]);
        } elseif ($fromDate) {
            $query->where('date', '>=', $fromDate);
        } elseif ($toDate) {
            $query->where('date', '<=', $toDate);
        }

        $activities = $query->orderBy('date')
            ->orderBy('parent_id')
            ->orderBy('position')
            ->orderBy('name')
            ->get();

        if ($request->boolean('nested', false)) {
            $activities = $this->buildNestedStructure($activities);
        }

        return response()->json(['data' => $activities], 200);
    }

    /**
     * Add or update activities.
     * Ensures parent's date consistency and updates descendants.
     * Wrapped in a transaction to ensure atomicity.
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
        ]);

        // Custom validation to ensure activity IDs exist and belong to the user
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

        $processedActivities = [];

        DB::transaction(function () use ($data, $request, &$processedActivities) {
            foreach ($data as $activityData) {
                $activityData['user_id'] = $request->user()->id;

                if (isset($activityData['parent_id'])) {
                    $parent = $request->user()->activities()->find($activityData['parent_id']);
                    $parentDate = $parent->date;
                    if (!isset($activityData['date']) || $activityData['date'] != $parentDate->toDateString()) {
                        $activityData['date'] = $parentDate->toDateString();
                    }
                }

                if (isset($activityData['id'])) {
                    $activity = $request->user()->activities()->find($activityData['id']);
                    $activity->update($activityData);
                    $processedActivities[] = $activity;
                } else {
                    $newActivity = Activity::create($activityData);
                    $processedActivities[] = $newActivity;
                }
            }

            foreach ($processedActivities as $updatedActivity) {
                if ($updatedActivity->parent_id) {
                    $parent = $updatedActivity->parent;
                    $updatedActivity->syncDescendantsDate($parent->date);
                } else {
                    $updatedActivity->syncDescendantsDate($updatedActivity->date);
                }
            }
        });

        return response()->json([
            'message' => 'Activities processed successfully.',
            'data' => $processedActivities,
        ], 200);
    }

    /**
     * Delete activities by ID.
     * Children are deleted due to database cascade.
     * Wrapped in a transaction to ensure atomicity.
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

        // Custom validation to ensure activity IDs exist and belong to the user
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
            $request->user()->activities()->whereIn('id', $data)->delete();
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

        // Convert activities to arrays and initialize children
        foreach ($activities as $activity) {
            $activitiesById[$activity->id] = $activity->toArray();
            $activitiesById[$activity->id]['children'] = [];
        }

        // Build the nested structure
        foreach ($activitiesById as $id => &$activity) {
            if ($activity['parent_id'] && isset($activitiesById[$activity['parent_id']])) {
                $activitiesById[$activity['parent_id']]['children'][] = &$activity;
            }
        }
        unset($activity); // Break the reference

        // Extract root activities
        $nestedActivities = [];
        foreach ($activitiesById as $id => $activity) {
            if (!$activity['parent_id']) {
                $nestedActivities[] = $activity;
            }
        }

        return $nestedActivities;
    }
}
