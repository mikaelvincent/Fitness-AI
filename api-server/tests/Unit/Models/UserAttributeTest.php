<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\UserAttribute;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAttributeTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Ensure that a UserAttribute belongs to a User.
     */
    public function test_user_relationship()
    {
        $user = User::factory()->create();
        $attribute = UserAttribute::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $attribute->user);
        $this->assertEquals($user->id, $attribute->user->id);
    }

    /**
     * Verify that the key and value properties are mass assignable.
     */
    public function test_fillable_properties()
    {
        $attribute = new UserAttribute(['key' => 'test_key', 'value' => 'test_value']);

        $this->assertEquals('test_key', $attribute->key);
        $this->assertEquals('test_value', $attribute->value);
        $this->assertContains('key', $attribute->getFillable());
        $this->assertContains('value', $attribute->getFillable());
    }

    /**
     * Confirm that the UserAttribute model uses the correct table name.
     */
    public function test_table_name()
    {
        $attribute = new UserAttribute();

        $this->assertEquals('user_attributes', $attribute->getTable());
    }
}