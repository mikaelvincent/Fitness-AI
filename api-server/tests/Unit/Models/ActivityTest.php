<?php

namespace Tests\Unit\Models;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that parent() relationship returns the correct parent activity.
     */
    public function test_parent_relationship()
    {
        $user = User::factory()->create();

        $parentActivity = Activity::factory()->create(['user_id' => $user->id]);

        $childActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parentActivity->id,
        ]);

        $this->assertInstanceOf(Activity::class, $childActivity->parent);
        $this->assertEquals($parentActivity->id, $childActivity->parent->id);
    }

    /**
     * Test that children() relationship returns the correct collection of child activities.
     */
    public function test_children_relationship()
    {
        $user = User::factory()->create();

        $parentActivity = Activity::factory()->create(['user_id' => $user->id]);

        $childActivity1 = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parentActivity->id,
        ]);

        $childActivity2 = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parentActivity->id,
        ]);

        $children = $parentActivity->children;

        $this->assertCount(2, $children);
        $this->assertTrue($children->contains($childActivity1));
        $this->assertTrue($children->contains($childActivity2));
    }

    /**
     * Test that deleting a parent activity also deletes children due to cascade.
     */
    public function test_cascade_delete_on_children()
    {
        $user = User::factory()->create();

        $parentActivity = Activity::factory()->create(['user_id' => $user->id]);

        $childActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parentActivity->id,
        ]);

        $parentActivity->delete();

        $this->assertDatabaseMissing('activities', ['id' => $parentActivity->id]);
        $this->assertDatabaseMissing('activities', ['id' => $childActivity->id]);
    }

    /**
     * Test that metrics field is cast to an array.
     */
    public function test_metrics_casting()
    {
        $user = User::factory()->create();

        $metrics = ['distance' => 5, 'unit' => 'km'];

        $activity = Activity::factory()->create([
            'user_id' => $user->id,
            'metrics' => $metrics,
        ]);

        $this->assertIsArray($activity->metrics);
        $this->assertEquals($metrics, $activity->metrics);
    }

    /**
     * Test that updating metrics correctly persists changes.
     */
    public function test_updating_metrics()
    {
        $user = User::factory()->create();

        $activity = Activity::factory()->create(['user_id' => $user->id]);

        $newMetrics = ['steps' => 10000, 'calories' => 500];

        $activity->metrics = $newMetrics;
        $activity->save();

        $this->assertDatabaseHas('activities', [
            'id' => $activity->id,
            'metrics' => json_encode($newMetrics),
        ]);

        $this->assertEquals($newMetrics, $activity->fresh()->metrics);
    }

    /**
     * Test that syncDescendantsDate updates all descendants to match the specified date.
     */
    public function test_sync_descendants_date()
    {
        $user = User::factory()->create();

        $parentActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'date' => '2023-12-01',
        ]);

        $childActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parentActivity->id,
            'date' => '2023-11-01',
        ]);

        $grandchildActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $childActivity->id,
            'date' => '2023-10-01',
        ]);

        $parentActivity->syncDescendantsDate('2023-12-01');

        $this->assertEquals('2023-12-01', $childActivity->fresh()->date->toDateString());
        $this->assertEquals('2023-12-01', $grandchildActivity->fresh()->date->toDateString());
    }

    /**
     * Test that the method handles activities with deep nesting.
     */
    public function test_sync_descendants_date_deep_nesting()
    {
        $user = User::factory()->create();

        $parentActivity = Activity::factory()->create([
            'user_id' => $user->id,
            'date' => '2023-12-01',
        ]);

        $activities = [];

        $currentParent = $parentActivity;
        for ($i = 0; $i < 5; $i++) {
            $activity = Activity::factory()->create([
                'user_id' => $user->id,
                'parent_id' => $currentParent->id,
                'date' => '2023-11-0' . ($i + 1),
            ]);
            $currentParent = $activity;
            $activities[] = $activity;
        }

        $parentActivity->syncDescendantsDate('2023-12-01');

        foreach ($activities as $activity) {
            $this->assertEquals('2023-12-01', $activity->fresh()->date->toDateString());
        }
    }

    /**
     * Test that user() relationship returns the correct user.
     */
    public function test_user_relationship()
    {
        $user = User::factory()->create();

        $activity = Activity::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $activity->user);
        $this->assertEquals($user->id, $activity->user->id);
    }
}
