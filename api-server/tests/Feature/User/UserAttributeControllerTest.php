<?php
namespace Tests\Feature\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class UserAttributeControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensure that an authenticated user can successfully retrieve their attributes.
     */
    public function test_retrieve_user_attributes_success()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'attribute1', 'value' => 'value1']);
        $user->attributes()->create(['key' => 'attribute2', 'value' => 'value2']);

        $response = $this->actingAs($user)
            ->getJson('/api/user/attributes');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'attribute1' => 'value1',
                    'attribute2' => 'value2',
                ],
            ]);
    }

    /**
     * Check that retrieving attributes returns an empty response when the user has no attributes.
     */
    public function test_retrieve_attributes_when_none_exist()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->getJson('/api/user/attributes');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [],
            ]);
    }

    /**
     * Verify that unauthenticated requests to retrieve attributes are denied.
     */
    public function test_retrieve_attributes_without_authentication()
    {
        $response = $this->getJson('/api/user/attributes');

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Check that an authenticated user can add or update attributes.
     */
    public function test_update_user_attributes_success()
    {
        $user = User::factory()->create();
        $payload = [
            'attributes' => [
                'attribute1' => 'value1',
                'attribute2' => 'value2',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Attributes updated successfully.',
            ]);

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute1',
            'value' => 'value1',
        ]);

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute2',
            'value' => 'value2',
        ]);
    }

    /**
     * Ensure that updating attributes with keys already present does not create duplicates.
     */
    public function test_update_attributes_with_duplicate_keys()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'attribute1', 'value' => 'old_value']);

        $payload = [
            'attributes' => [
                'attribute1' => 'new_value',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Attributes updated successfully.',
            ]);

        $this->assertDatabaseMissing('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute1',
            'value' => 'old_value',
        ]);

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute1',
            'value' => 'new_value',
        ]);

        $this->assertEquals(1, $user->attributes()->where('key', 'attribute1')->count());
    }

    /**
     * Verify that unauthenticated requests to update attributes are denied.
     */
    public function test_update_attributes_without_authentication()
    {
        $payload = [
            'attributes' => [
                'attribute1' => 'value1',
            ],
        ];

        $response = $this->putJson('/api/user/attributes', $payload);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Confirm that the controller returns validation errors when invalid data is provided on update.
     */
    public function test_update_attributes_with_invalid_data()
    {
        $user = User::factory()->create();
        $payload = [
            'attributes' => 'invalid_data',
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attributes']);
    }

    /**
     * Ensure that validation errors are returned when non-string keys or values are provided.
     */
    public function test_update_attributes_with_non_string_keys_or_values()
    {
        $user = User::factory()->create();
        $payload = [
            'attributes' => [
                123 => 'value1',
                'attribute2' => ['array_value'],
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attributes']);
    }

    /**
     * Ensure that an authenticated user can delete specified attributes.
     */
    public function test_delete_user_attributes_success()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'attribute1', 'value' => 'value1']);
        $user->attributes()->create(['key' => 'attribute2', 'value' => 'value2']);

        $payload = [
            'keys' => ['attribute1'],
        ];

        $response = $this->actingAs($user)
            ->deleteJson('/api/user/attributes', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Attributes deleted successfully.',
            ]);

        $this->assertDatabaseMissing('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute1',
        ]);

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute2',
        ]);
    }

    /**
     * Verify that deleting attributes with keys that do not exist does not cause errors.
     */
    public function test_delete_attributes_non_existent_keys()
    {
        $user = User::factory()->create();
        $payload = [
            'keys' => ['non_existent_key'],
        ];

        $response = $this->actingAs($user)
            ->deleteJson('/api/user/attributes', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Attributes deleted successfully.',
            ]);

        $this->assertEquals(0, $user->attributes()->count());
    }

    /**
     * Confirm that unauthenticated requests to delete attributes are denied.
     */
    public function test_delete_attributes_without_authentication()
    {
        $payload = [
            'keys' => ['attribute1'],
        ];

        $response = $this->deleteJson('/api/user/attributes', $payload);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Ensure that the controller returns validation errors when invalid keys are provided for deletion.
     */
    public function test_delete_attributes_with_invalid_keys()
    {
        $user = User::factory()->create();
        $payload = [
            'keys' => [123, 'valid_key'],
        ];

        $response = $this->actingAs($user)
            ->deleteJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['keys.0']);
    }

    /**
     * Check that providing an empty attributes object returns a validation error.
     */
    public function test_update_attributes_empty_payload()
    {
        $user = User::factory()->create();
        $payload = [
            'attributes' => [],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attributes']);
    }

    /**
     * Verify that providing an empty array of keys returns a validation error.
     */
    public function test_delete_attributes_empty_keys_array()
    {
        $user = User::factory()->create();
        $payload = [
            'keys' => [],
        ];

        $response = $this->actingAs($user)
            ->deleteJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['keys']);
    }

    /**
     * Ensure that attributes with keys or values exceeding the maximum allowed length are rejected.
     */
    public function test_update_attributes_exceeding_max_length()
    {
        $user = User::factory()->create();
        $longKey = str_repeat('a', 256);
        $longValue = str_repeat('b', 256);
        $payload = [
            'attributes' => [
                $longKey => $longValue,
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attributes.' . $longKey]);
    }

    /**
     * Confirm that non-string values in the keys array result in a validation error.
     */
    public function test_delete_attributes_with_invalid_data_types()
    {
        $user = User::factory()->create();
        $payload = [
            'keys' => [123, 'valid_key'],
        ];

        $response = $this->actingAs($user)
            ->deleteJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['keys.0']);
    }

    /**
     * Verify that attempting SQL injection via attributes is safely handled.
     */
    public function test_update_attributes_sql_injection_attempt()
    {
        $user = User::factory()->create();
        $payload = [
            'attributes' => [
                'key; DROP TABLE users;' => 'value',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Attributes updated successfully.',
            ]);

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'key; DROP TABLE users;',
            'value' => 'value',
        ]);
    }

    /**
     * Ensure that concurrent updates to the same attribute do not cause data inconsistencies.
     */
    public function test_concurrent_attribute_updates()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'shared_key', 'value' => 'initial_value']);

        $payload1 = [
            'attributes' => [
                'shared_key' => 'value1',
            ],
        ];

        $payload2 = [
            'attributes' => [
                'shared_key' => 'value2',
            ],
        ];

        $response1 = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload1);

        $response2 = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload2);

        $response1->assertStatus(200);
        $response2->assertStatus(200);

        $finalValue = $user->fresh()->getAttributeByKey('shared_key');
        $this->assertTrue(in_array($finalValue, ['value1', 'value2']));
    }

    /**
     * Test that multiple attribute updates within a transaction are all applied or all rolled back if one fails.
     */
    public function test_atomic_update_all_or_nothing()
    {
        $user = User::factory()->create();

        $user->attributes()->create(['key' => 'attribute1', 'value' => 'initial_value1']);
        $user->attributes()->create(['key' => 'attribute2', 'value' => 'initial_value2']);

        // Payload with one invalid attribute (key too long)
        $longKey = str_repeat('a', 256);
        $payload = [
            'attributes' => [
                'attribute1' => 'new_value1',
                'attribute2' => 'new_value2',
                $longKey => 'value_with_long_key',
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attributes.' . $longKey]);

        // Ensure that neither attribute1 nor attribute2 was updated
        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute1',
            'value' => 'initial_value1',
        ]);

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute2',
            'value' => 'initial_value2',
        ]);
    }

    /**
     * Test that invalid updates rolled back in a transaction do not leave partial changes in the database.
     */
    public function test_invalid_update_does_not_leave_partial_changes()
    {
        $user = User::factory()->create();

        // Initial attributes
        $user->attributes()->create(['key' => 'attribute1', 'value' => 'initial_value1']);
        $user->attributes()->create(['key' => 'attribute2', 'value' => 'initial_value2']);

        $payload = [
            'attributes' => [
                'attribute1' => 'new_value1',
                'attribute2' => ['invalid_value'], // Invalid value
            ],
        ];

        $response = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['attributes.attribute2']);

        // Ensure neither attribute was updated
        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute1',
            'value' => 'initial_value1',
        ]);

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'attribute2',
            'value' => 'initial_value2',
        ]);
    }

    /**
     * Test that concurrent updates to the same attribute do not result in partial writes.
     */
    public function test_concurrent_updates_do_not_cause_partial_writes()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'shared_key', 'value' => 'initial_value']);

        $payload1 = [
            'attributes' => [
                'shared_key' => 'value1',
                'another_key' => 'value2',
            ],
        ];

        $payload2 = [
            'attributes' => [
                'shared_key' => 'value3',
                'another_key' => 'value4',
            ],
        ];

        // Simulate concurrent requests
        DB::beginTransaction();

        $response1 = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload1);

        DB::rollBack();

        $response2 = $this->actingAs($user)
            ->putJson('/api/user/attributes', $payload2);

        $response1->assertStatus(200);
        $response2->assertStatus(200);

        // Ensure database reflects one of the updates entirely
        $finalValues = $user->fresh()->attributes()->pluck('value', 'key')->toArray();

        $possibleResults = [
            'shared_key' => 'value1',
            'another_key' => 'value2',
        ];

        $this->assertTrue(
            ($finalValues['shared_key'] === 'value1' && $finalValues['another_key'] === 'value2') ||
            ($finalValues['shared_key'] === 'value3' && $finalValues['another_key'] === 'value4')
        );
    }
}