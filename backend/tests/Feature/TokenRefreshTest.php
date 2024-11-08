<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class TokenRefreshTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_refresh_token()
    {
        $user = User::factory()->create();

        // Create a token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Use the token to refresh
        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/refresh-token');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                ],
            ]);

        // Assert that the old token is revoked
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'token'        => hash('sha256', explode('|', $token, 2)[1]),
        ]);

        // Assert that a new token is issued
        $this->assertNotNull($response->json('data.token'));
    }

    public function test_cannot_refresh_with_invalid_token()
    {
        $response = $this->withHeaders(['Authorization' => "Bearer invalid_token"])
            ->postJson('/api/refresh-token');

        $response->assertStatus(401);
    }

    public function test_cannot_refresh_with_expired_token()
    {
        $user = User::factory()->create();

        // Set token expiration to 1 minute
        config(['sanctum.expiration' => 1]);

        // Create a token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Travel 2 minutes into the future
        Carbon::setTestNow(Carbon::now()->addMinutes(2));

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/refresh-token');

        $response->assertStatus(401);

        // Reset time
        Carbon::setTestNow();
    }

    public function test_can_refresh_before_token_expires()
    {
        $user = User::factory()->create();

        // Set token expiration to 60 minutes
        config(['sanctum.expiration' => 60]);

        // Create a token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Travel 59 minutes into the future
        Carbon::setTestNow(Carbon::now()->addMinutes(59));

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
            ->postJson('/api/refresh-token');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                ],
            ]);

        // Reset time
        Carbon::setTestNow();
    }
}
