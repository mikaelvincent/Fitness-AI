<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('SecurePass123!'),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'SecurePass123!',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'user' => ['id', 'name', 'email', 'email_verified_at'],
                         'token',
                     ],
                 ]);
    }

    public function test_login_fails_with_incorrect_password()
    {
        $user = User::factory()->create([
            'password' => bcrypt('SecurePass123!'),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid credentials.',
                 ]);
    }

    public function test_login_fails_if_email_not_verified()
    {
        $user = User::factory()->create([
            'password' => bcrypt('SecurePass123!'),
            'email_verified_at' => null,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'SecurePass123!',
        ]);

        $response->assertStatus(403)
                 ->assertJson([
                     'message' => 'Email address is not verified.',
                 ]);
    }

    public function test_login_requires_email_and_password()
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email', 'password']);
    }
}
