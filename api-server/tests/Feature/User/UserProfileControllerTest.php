<?php
namespace Tests\Feature\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can retrieve their profile information.
     */
    public function test_show_returns_user_information()
    {
        $user = User::factory()->create([
            'name'  => 'Test User',
            'email' => 'testuser@example.com',
        ]);

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/user/profile');

        $response->assertStatus(200)
                 ->assertJson([
                     'name'  => 'Test User',
                     'email' => 'testuser@example.com',
                 ]);
    }

    /**
     * Test that an unauthenticated user cannot access the profile endpoint.
     */
    public function test_show_requires_authentication()
    {
        $response = $this->getJson('/api/user/profile');

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.',
                 ]);
    }

    /**
     * Test that a user can successfully update their name with valid data.
     */
    public function test_update_name_with_valid_data()
    {
        $user = User::factory()->create();
        $payload = [
            'name' => 'Updated Name',
        ];

        $response = $this->actingAs($user, 'sanctum')
                         ->putJson('/api/user/profile/name', $payload);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Name updated successfully.',
                 ]);

        $this->assertDatabaseHas('users', [
            'id'   => $user->id,
            'name' => 'Updated Name',
        ]);
    }

    /**
     * Test that updating the name with invalid data returns validation errors.
     */
    public function test_update_name_with_invalid_data()
    {
        $user = User::factory()->create();
        $payload = [
            'name' => '', // Invalid: name is required
        ];

        $response = $this->actingAs($user, 'sanctum')
                         ->putJson('/api/user/profile/name', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    /**
     * Test that an unauthenticated user cannot update the name.
     */
    public function test_update_name_unauthenticated()
    {
        $payload = [
            'name' => 'Updated Name',
        ];

        $response = $this->putJson('/api/user/profile/name', $payload);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.',
                 ]);
    }

    /**
     * Test that the name update enforces the maximum length constraint.
     */
    public function test_update_name_exceeds_max_length()
    {
        $user = User::factory()->create();
        $payload = [
            'name' => str_repeat('a', 256), // Exceeds max: 255
        ];

        $response = $this->actingAs($user, 'sanctum')
                         ->putJson('/api/user/profile/name', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name']);
    }

    /**
     * Test that partial updates do not affect other user attributes.
     */
    public function test_partial_update_does_not_modify_other_attributes()
    {
        $user = User::factory()->create([
            'name'  => 'Original Name',
            'email' => 'original@example.com',
        ]);

        $payload = [
            'name' => 'New Name',
        ];

        $response = $this->actingAs($user, 'sanctum')
                         ->putJson('/api/user/profile/name', $payload);

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Name updated successfully.',
                 ]);

        $this->assertDatabaseHas('users', [
            'id'    => $user->id,
            'name'  => 'New Name',
            'email' => 'original@example.com', // Ensure email is unchanged
        ]);
    }
}
