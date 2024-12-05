<?php

namespace Tests\Unit\Middleware;

use App\Http\Middleware\RateLimitingMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class RateLimitingMiddlewareTest extends TestCase
{
    /**
     * Test key generation for authenticated users.
     */
    public function test_key_generation_for_authenticated_users()
    {
        $user = \App\Models\User::factory()->make(['id' => 1]);

        $request = Request::create('/test', 'GET');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        $middleware = new RateLimitingMiddleware();

        $key = $this->invokeMethod($middleware, 'resolveKey', [$request, 'test_limiter']);

        $this->assertEquals('test_limiter|1', $key);
    }

    /**
     * Test key generation for guest users based on IP.
     */
    public function test_key_generation_for_guest_users()
    {
        $request = Request::create('/test', 'GET', [], [], [], ['REMOTE_ADDR' => '127.0.0.1']);

        $request->setUserResolver(function () {
            return null;
        });

        $middleware = new RateLimitingMiddleware();

        $key = $this->invokeMethod($middleware, 'resolveKey', [$request, 'test_limiter']);

        $this->assertEquals('test_limiter|127.0.0.1', $key);
    }

    /**
     * Test that the middleware retrieves the correct max attempts from configuration.
     */
    public function test_get_max_attempts_from_configuration()
    {
        Config::set('ratelimiter.limiters.test_limiter.max_attempts', 10);
        Config::set('ratelimiter.defaults.max_attempts', 60);

        $middleware = new RateLimitingMiddleware();

        $maxAttempts = $this->invokeMethod($middleware, 'getMaxAttempts', ['test_limiter']);
        $this->assertEquals(10, $maxAttempts);

        $maxAttemptsDefault = $this->invokeMethod($middleware, 'getMaxAttempts', ['nonexistent_limiter']);
        $this->assertEquals(60, $maxAttemptsDefault);
    }

    /**
     * Test that the middleware retrieves the correct decay seconds from configuration.
     */
    public function test_get_decay_seconds_from_configuration()
    {
        Config::set('ratelimiter.limiters.test_limiter.decay_seconds', 120);
        Config::set('ratelimiter.defaults.decay_seconds', 60);

        $middleware = new RateLimitingMiddleware();

        $decaySeconds = $this->invokeMethod($middleware, 'getDecaySeconds', ['test_limiter']);
        $this->assertEquals(120, $decaySeconds);

        $decaySecondsDefault = $this->invokeMethod($middleware, 'getDecaySeconds', ['nonexistent_limiter']);
        $this->assertEquals(60, $decaySecondsDefault);
    }

    /**
     * Helper method to invoke protected methods.
     */
    protected function invokeMethod($object, $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass($object);
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invokeArgs($object, $parameters);
    }
}
