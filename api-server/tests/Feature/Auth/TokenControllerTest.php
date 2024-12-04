<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TokenControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful token refresh for an authenticated user.
     */
    public function test_successful_token_refresh_for_authenticated_user()
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, ['*']);

        $response = $this->postJson('/api/token/refresh');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'data' => [
                         'token',
                     ],
                 ]);

        // Assert that a new token has been created
        $this->assertCount(1, $user->tokens);

        // Refresh the user to get the latest tokens
        $user->refresh();

        $this->assertNotNull($user->currentAccessToken());
    }

    /**
     * Test token refresh without authentication.
     */
    public function test_token_refresh_without_authentication()
    {
        $response = $this->postJson('/api/token/refresh');

        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Unauthenticated.',
                 ]);
    }
}
