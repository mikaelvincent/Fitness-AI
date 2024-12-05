<?php

namespace Tests\Unit\Models;

use App\Models\RegistrationToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Carbon;

class RegistrationTokenTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that isExpired returns true for expired tokens.
     */
    public function test_is_expired_returns_true_for_expired_tokens()
    {
        $token = RegistrationToken::factory()->expired()->create();

        $this->assertTrue($token->isExpired());
    }

    /**
     * Test that isExpired returns false for valid tokens.
     */
    public function test_is_expired_returns_false_for_valid_tokens()
    {
        $token = RegistrationToken::factory()->create();

        $this->assertFalse($token->isExpired());
    }

    /**
     * Test that timeUntilExpiration returns the correct remaining time in seconds.
     */
    public function test_time_until_expiration_returns_correct_remaining_time()
    {
        // Set a fixed current time
        $fixedNow = Carbon::create(2024, 12, 4, 12, 0, 0);
        Carbon::setTestNow($fixedNow);

        $expiresAt = $fixedNow->copy()->addMinutes(30);
        $token = RegistrationToken::factory()->create([
            'expires_at' => $expiresAt,
        ]);

        $this->assertEqualsWithDelta(1800, $token->timeUntilExpiration(), 1);
    }

    /**
     * Test behavior when token has already expired.
     */
    public function test_time_until_expiration_when_token_has_expired()
    {
        // Set a fixed current time
        $fixedNow = Carbon::create(2024, 12, 4, 12, 0, 0);
        Carbon::setTestNow($fixedNow);

        $expiresAt = $fixedNow->copy()->subMinutes(10);
        $token = RegistrationToken::factory()->create([
            'expires_at' => $expiresAt,
        ]);

        $this->assertEqualsWithDelta(-600, $token->timeUntilExpiration(), 1);
    }
}
