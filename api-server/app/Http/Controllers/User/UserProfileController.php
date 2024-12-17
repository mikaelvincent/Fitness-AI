<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    /**
     * Update the authenticated user's name.
     * @authenticated
     */
    public function updateName(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $request->user()->forceFill([
            'name' => $validator->validated()['name'],
        ])->save();

        return response()->json([
            'message' => 'Name updated successfully.',
        ], 200);
    }
}
