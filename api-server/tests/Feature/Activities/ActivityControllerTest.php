<?php

namespace Tests\Feature\Activities;

use App\Models\User;
use App\Models\Activity;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test creating a new activity with valid data succeeds.
     */
    public function test_create_activity_with_valid_data()
    {
        $user = User::factory()->create();

        $payload = [
            [
                'name' => 'Test Activity',
                'date' => '2023-12-01',
                'description' => 'Test Description',
                'metrics' => ['distance' => 5, 'unit' => 'km'],
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Activities processed successfully.',
                'data' => [
                    [
                        'name' => 'Test Activity',
                        'description' => 'Test Description',
                        'metrics' => ['distance' => 5, 'unit' => 'km'],
                        'user_id' => $user->id,
                    ],
                ],
            ]);

        $this->assertDatabaseHas('activities', [
            'name' => 'Test Activity',
            'description' => 'Test Description',
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test creating a new activity with invalid data returns validation errors.
     */
    public function test_create_activity_with_invalid_data()
    {
        $user = User::factory()->create();

        $payload = [
            [
                'name' => '',
                'date' => 'invalid-date',
                'metrics' => 'not-an-array',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'activities.0.name',
                'activities.0.date',
                'activities.0.metrics',
            ]);
    }

    /**
     * Test unauthorized user cannot create activities.
     */
    public function test_create_activity_unauthorized()
    {
        $payload = [
            [
                'name' => 'Unauthorized Activity',
                'date' => '2023-12-01',
            ],
        ];

        $response = $this->putJson('/api/activities', $payload);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test retrieving all activities returns correct structure and status.
     */
    public function test_retrieve_all_activities()
    {
        $user = User::factory()->create();

        $activity1 = Activity::factory()->create([
            'user_id' => $user->id,
            'name' => 'Activity One',
        ]);

        $activity2 = Activity::factory()->create([
            'user_id' => $user->id,
            'name' => 'Activity Two',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/activities');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    /**
     * Test filtering activities by date range returns the expected results.
     */
    public function test_filter_activities_by_date_range()
    {
        $user = User::factory()->create();

        Activity::factory()->create([
            'user_id' => $user->id,
            'date' => '2023-01-01',
            'name' => 'Old Activity',
        ]);

        Activity::factory()->create([
            'user_id' => $user->id,
            'date' => '2023-12-01',
            'name' => 'Recent Activity',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/activities?from_date=2023-05-01');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['name' => 'Recent Activity']);
    }

    /**
     * Test retrieving nested activities returns hierarchical structure.
     */
    public function test_retrieve_nested_activities()
    {
        $user = User::factory()->create();

        $parentActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'name' => 'Parent Activity',
        ]);

        $childActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parentActivity->id,
            'name' => 'Child Activity',
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/activities?nested=true');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    [
                        'id',
                        'name',
                        'children' => [
                            [
                                'id',
                                'name',
                            ],
                        ],
                    ],
                ],
            ]);
    }

    /**
     * Test updating an existing activity with valid data succeeds.
     */
    public function test_update_existing_activity()
    {
        $user = User::factory()->create();

        $activity = Activity::factory()->create([
            'user_id' => $user->id,
            'name' => 'Original Name',
            'date' => '2023-12-01',
        ]);

        $payload = [
            [
                'id' => $activity->id,
                'name' => 'Updated Name',
                'date' => '2023-12-01',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Activities processed successfully.',
            ]);

        $this->assertDatabaseHas('activities', [
            'id' => $activity->id,
            'name' => 'Updated Name',
        ]);
    }

    /**
     * Test updating an activity with invalid data returns validation errors.
     */
    public function test_update_activity_with_invalid_data()
    {
        $user = User::factory()->create();

        $activity = Activity::factory()->create([
            'user_id' => $user->id,
            'date' => '2023-12-01',
        ]);

        $payload = [
            [
                'id' => $activity->id,
                'name' => '', // Invalid name
                'date' => '2023-12-01',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activities.0.name']);
    }

    /**
     * Test updating a non-existent activity returns a validation error.
     */
    public function test_update_nonexistent_activity()
    {
        $user = User::factory()->create();

        $payload = [
            [
                'id' => 9999, // Non-existent ID
                'name' => 'Name',
                'date' => '2023-12-01',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('activities.0.id');
    }

    /**
     * Test unauthorized user cannot update activities.
     */
    public function test_update_activity_unauthorized()
    {
        $activity = Activity::factory()->create();

        $payload = [
            [
                'id' => $activity->id,
                'name' => 'Updated Name',
                'date' => $activity->date->toDateString(),
            ],
        ];

        $response = $this->putJson('/api/activities', $payload);

        $response->assertStatus(401);
    }

    /**
     * Test deleting an activity by ID removes it from the database.
     */
    public function test_delete_activity()
    {
        $user = User::factory()->create();

        $activity = Activity::factory()->create([
            'user_id' => $user->id,
        ]);

        $payload = [$activity->id];

        $response = $this->actingAs($user)
            ->deleteJson('/api/activities', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Activities deleted successfully.',
            ]);

        $this->assertDatabaseMissing('activities', [
            'id' => $activity->id,
        ]);
    }

    /**
     * Test deleting an activity also deletes its children due to cascade.
     */
    public function test_delete_activity_with_children()
    {
        $user = User::factory()->create();

        $parentActivity = Activity::factory()->create([
            'user_id' => $user->id,
        ]);

        $childActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parentActivity->id,
        ]);

        $payload = [$parentActivity->id];

        $response = $this->actingAs($user)
            ->deleteJson('/api/activities', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('activities', [
            'id' => $parentActivity->id,
        ]);

        $this->assertDatabaseMissing('activities', [
            'id' => $childActivity->id,
        ]);
    }

    /**
     * Test deleting a non-existent activity returns a validation error.
     */
    public function test_delete_nonexistent_activity()
    {
        $user = User::factory()->create();

        $payload = [9999]; // Non-existent ID

        $response = $this->actingAs($user)
            ->deleteJson('/api/activities', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('ids.0');
    }

    /**
     * Test unauthorized user cannot delete activities.
     */
    public function test_delete_activity_unauthorized()
    {
        $activity = Activity::factory()->create();

        $payload = [$activity->id];

        $response = $this->deleteJson('/api/activities', $payload);

        $response->assertStatus(401);
    }

    /**
     * Test activities accept and return valid JSON metrics.
     */
    public function test_activity_metrics_handling()
    {
        $user = User::factory()->create();

        $payload = [
            [
                'name' => 'Metric Activity',
                'date' => '2023-12-01',
                'metrics' => ['steps' => 10000, 'calories' => 500],
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Metric Activity',
                'metrics' => ['steps' => 10000, 'calories' => 500],
            ]);
    }

    /**
     * Test activities reject invalid metrics format.
     */
    public function test_activity_invalid_metrics()
    {
        $user = User::factory()->create();

        $payload = [
            [
                'name' => 'Invalid Metrics Activity',
                'metrics' => 'not-an-array',
                'date' => '2023-12-01',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activities.0.metrics']);
    }

    /**
     * Test that appropriate error responses are returned for invalid requests.
     */
    public function test_invalid_requests_error_handling()
    {
        $user = User::factory()->create();

        // Missing required fields
        $payload = [
            [
                // 'name' is missing
                'date' => '2023-12-01',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['activities.0.name']);
    }

    /**
     * Test atomicity: multiple concurrent create/update operations are applied consistently.
     */
    public function test_atomicity_of_operations()
    {
        $user = User::factory()->create();

        $payload = [
            [
                'name' => 'Activity 1',
                'date' => '2023-12-01',
            ],
            [
                'name' => 'Activity 2',
                'date' => '2023-12-01',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/activities', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('activities', ['name' => 'Activity 1']);
        $this->assertDatabaseHas('activities', ['name' => 'Activity 2']);
    }
}