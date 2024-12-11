<?php

namespace Tests\Feature\RateLimiting;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Models\User;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test rate limiting on initiation of registration after exceeding maximum attempts.
     */
    public function test_registration_initiation_rate_limiting()
    {
        $maxAttempts = Config::get('ratelimiter.limiters.registration.max_attempts');

        for ($i = 0; $i < $maxAttempts; $i++) {
            $response = $this->postJson('/api/registration/initiate', [
                'email' => "user{$i}@example.com",
            ]);

            $response->assertStatus(200);
        }

        // Exceed the limit
        $response = $this->postJson('/api/registration/initiate', [
            'email' => 'user_over_limit@example.com',
        ]);

        $response->assertStatus(429);
        $this->assertStringContainsString(
            'You have exceeded the maximum number of attempts',
            $response->json('message')
        );
    }

    /**
     * Test rate limiting on resending verification email.
     */
    public function test_registration_resend_rate_limiting()
    {
        $maxAttempts = Config::get('ratelimiter.limiters.registration.max_attempts');

        \App\Models\RegistrationToken::factory()->create([
            'email' => 'resenduser@example.com',
        ]);

        for ($i = 0; $i < $maxAttempts; $i++) {
            $response = $this->postJson('/api/registration/resend', [
                'email' => 'resenduser@example.com',
            ]);

            $response->assertStatus(200);
        }

        // Exceed the limit
        $response = $this->postJson('/api/registration/resend', [
            'email' => 'resenduser@example.com',
        ]);

        $response->assertStatus(429);
        $this->assertStringContainsString(
            'You have exceeded the maximum number of attempts',
            $response->json('message')
        );
    }

    /**
     * Test that rate limiting resets after the decay period.
     */
    public function test_rate_limiting_resets_after_decay()
    {
        $decaySeconds = Config::get('ratelimiter.limiters.registration.decay_seconds');
        $maxAttempts = Config::get('ratelimiter.limiters.registration.max_attempts');

        for ($i = 0; $i < $maxAttempts; $i++) {
            $this->postJson('/api/registration/initiate', [
                'email' => "user{$i}@example.com",
            ])->assertStatus(200);
        }

        // Exceed the limit
        $this->postJson('/api/registration/initiate', [
            'email' => 'user_over_limit@example.com',
        ])->assertStatus(429);

        // Advance time beyond the decay period
        $this->travel($decaySeconds + 1)->seconds();

        // Attempt again after decay period
        $this->postJson('/api/registration/initiate', [
            'email' => 'newuser@example.com',
        ])->assertStatus(200);
    }

    /**
     * Test rate limiting on consecutive failed login attempts.
     */
    public function test_authentication_rate_limiting()
    {
        $maxAttempts = Config::get('ratelimiter.limiters.authentication.max_attempts');

        User::factory()->create([
            'email' => 'loginuser@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        for ($i = 0; $i < $maxAttempts; $i++) {
            $this->postJson('/api/login', [
                'email' => 'loginuser@example.com',
                'password' => 'wrong-password',
            ])->assertStatus(401);
        }

        // Exceed the limit
        $this->postJson('/api/login', [
            'email' => 'loginuser@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    /**
     * Test that login is allowed after rate limit resets.
     */
    public function test_login_allowed_after_rate_limit_reset()
    {
        $decaySeconds = Config::get('ratelimiter.limiters.authentication.decay_seconds');
        $maxAttempts = Config::get('ratelimiter.limiters.authentication.max_attempts');

        User::factory()->create([
            'email' => 'loginuser@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        for ($i = 0; $i < $maxAttempts; $i++) {
            $this->postJson('/api/login', [
                'email' => 'loginuser@example.com',
                'password' => 'wrong-password',
            ])->assertStatus(401);
        }

        // Exceed the limit
        $this->postJson('/api/login', [
            'email' => 'loginuser@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);

        // Advance time beyond the decay period
        $this->travel($decaySeconds + 1)->seconds();

        // Attempt login with correct credentials
        $this->postJson('/api/login', [
            'email' => 'loginuser@example.com',
            'password' => 'correct-password',
        ])->assertStatus(200);
    }

    /**
     * Test rate limiting on multiple password reset link requests.
     */
    public function test_password_reset_rate_limiting()
    {
        $maxAttempts = Config::get('ratelimiter.limiters.password_reset.max_attempts');

        User::factory()->create([
            'email' => 'passwordresetuser@example.com',
        ]);

        for ($i = 0; $i < $maxAttempts; $i++) {
            $this->postJson('/api/password/forgot', [
                'email' => 'passwordresetuser@example.com',
            ])->assertStatus(200);
        }

        // Exceed the limit
        $this->postJson('/api/password/forgot', [
            'email' => 'passwordresetuser@example.com',
        ])->assertStatus(429);
    }

    /**
     * Test that reset link can be requested after decay period.
     */
    public function test_password_reset_allowed_after_decay()
    {
        $decaySeconds = Config::get('ratelimiter.limiters.password_reset.decay_seconds');
        $maxAttempts = Config::get('ratelimiter.limiters.password_reset.max_attempts');

        User::factory()->create([
            'email' => 'passwordresetuser@example.com',
        ]);

        for ($i = 0; $i < $maxAttempts; $i++) {
            $this->postJson('/api/password/forgot', [
                'email' => 'passwordresetuser@example.com',
            ])->assertStatus(200);
        }

        // Exceed the limit
        $this->postJson('/api/password/forgot', [
            'email' => 'passwordresetuser@example.com',
        ])->assertStatus(429);

        // Advance time beyond the decay period
        $this->travel($decaySeconds + 1)->seconds();

        // Attempt again after decay period
        $this->postJson('/api/password/forgot', [
            'email' => 'passwordresetuser@example.com',
        ])->assertStatus(200);
    }

    /**
     * Test that global rate limiting applies after exceeding maximum global requests.
     */
    public function test_global_rate_limiting_applies()
    {
        $maxAttempts = Config::get('ratelimiter.limiters.global.max_attempts');

        for ($i = 0; $i < $maxAttempts; $i++) {
            $this->getJson('/api/non-existent-endpoint')->assertStatus(404);
        }

        // Exceed the limit
        $this->getJson('/api/non-existent-endpoint')->assertStatus(429);
    }

    /**
     * Test that requests are allowed before reaching global limit.
     */
    public function test_requests_allowed_before_global_limit()
    {
        $maxAttempts = Config::get('ratelimiter.limiters.global.max_attempts');

        for ($i = 0; $i < $maxAttempts - 1; $i++) {
            $this->getJson('/api/non-existent-endpoint')->assertStatus(404);
        }

        // Should still be allowed
        $this->getJson('/api/non-existent-endpoint')->assertStatus(404);
    }

    /**
     * Test that different limiters enforce their specific limits.
     */
    public function test_custom_limiters_enforce_specific_limits()
    {
        $registrationMax = Config::get('ratelimiter.limiters.registration.max_attempts');
        $authMax = Config::get('ratelimiter.limiters.authentication.max_attempts');
        $passwordResetMax = Config::get('ratelimiter.limiters.password_reset.max_attempts');

        // Test registration limiter
        for ($i = 0; $i < $registrationMax; $i++) {
            $this->postJson('/api/registration/initiate', [
                'email' => "user{$i}@example.com",
            ])->assertStatus(200);
        }

        // Exceed registration limit
        $this->postJson('/api/registration/initiate', [
            'email' => 'user_over_limit@example.com',
        ])->assertStatus(429);

        // Authentication limiter should still allow attempts
        User::factory()->create([
            'email' => 'loginuser@example.com',
            'password' => Hash::make('correct-password'),
        ]);

        for ($i = 0; $i < $authMax; $i++) {
            $this->postJson('/api/login', [
                'email' => 'loginuser@example.com',
                'password' => 'wrong-password',
            ])->assertStatus(401);
        }

        // Exceed authentication limit
        $this->postJson('/api/login', [
            'email' => 'loginuser@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);

        // Password reset limiter
        for ($i = 0; $i < $passwordResetMax; $i++) {
            $this->postJson('/api/password/forgot', [
                'email' => 'passwordresetuser@example.com',
            ])->assertStatus(200);
        }

        // Exceed password reset limit
        $this->postJson('/api/password/forgot', [
            'email' => 'passwordresetuser@example.com',
        ])->assertStatus(429);
    }
}
