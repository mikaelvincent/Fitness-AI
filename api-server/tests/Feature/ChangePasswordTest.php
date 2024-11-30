<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ChangePasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_change_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('OldPassword123!'),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/password/update', [
            'current_password' => 'OldPassword123!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(200)->assertJson([
            'message' => 'Password updated successfully.',
        ]);

        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));
    }

    public function test_user_cannot_change_password_with_incorrect_current_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('OldPassword123!'),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/password/update', [
            'current_password' => 'WrongPassword!',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(400)->assertJson([
            'message' => 'Current password does not match.',
        ]);
    }

    public function test_user_cannot_change_password_with_invalid_new_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('OldPassword123!'),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/password/update', [
            'current_password' => 'OldPassword123!',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['password']);
    }

    public function test_guest_cannot_change_password()
    {
        $response = $this->postJson('/api/password/update', [
            'current_password' => 'DoesNotMatter',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(401);
    }
}
