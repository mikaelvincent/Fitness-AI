<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson("/api/register", [
            "name" => "John Doe",
            "email" => "john.doe@example.com",
            "password" => "SecurePass123!",
            "password_confirmation" => "SecurePass123!",
        ]);

        $response->assertStatus(201)->assertJsonStructure([
            "message",
            "data" => [
                "user" => ["id", "name", "email", "created_at", "updated_at"],
                "token",
            ],
        ]);

        $this->assertDatabaseHas("users", [
            "email" => "john.doe@example.com",
        ]);
    }

    public function test_registration_requires_valid_data()
    {
        $response = $this->postJson("/api/register", []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(["name", "email", "password"]);
    }

    public function test_registration_fails_with_existing_email()
    {
        User::factory()->create(["email" => "john.doe@example.com"]);

        $response = $this->postJson("/api/register", [
            "name" => "Jane Doe",
            "email" => "john.doe@example.com",
            "password" => "AnotherPass123!",
            "password_confirmation" => "AnotherPass123!",
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(["email"]);
    }
}
