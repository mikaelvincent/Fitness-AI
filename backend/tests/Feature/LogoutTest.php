<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/logout')
            ->assertStatus(200)
            ->assertJson(['message' => 'Logout successful.']);

        $this->assertDatabaseMissing('personal_access_tokens', ['tokenable_id' => $user->id]);
    }

    public function test_unauthenticated_user_cannot_logout()
    {
        $this->postJson('/api/logout')
            ->assertStatus(401);
    }
}
