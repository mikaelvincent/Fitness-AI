<?php
namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    /**
     * Get the authenticated user's information.
     * @authenticated
     */
    public function show(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'name'  => $user->name,
            'email' => $user->email,
        ], 200);
    }

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
                'errors'  => $validator->errors(),
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
