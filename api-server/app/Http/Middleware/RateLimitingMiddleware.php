<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class RateLimitingMiddleware
{
    public function handle(Request $request, Closure $next, string $limiterName = 'global')
    {
        $key = $this->resolveKey($request, $limiterName);
        $maxAttempts = $this->getMaxAttempts($limiterName);
        $decaySeconds = $this->getDecaySeconds($limiterName);

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $retryAfter = RateLimiter::availableIn($key);

            return response()->json([
                'message' => "You have exceeded the maximum number of attempts. Please try again in {$retryAfter} seconds.",
                'retry_after' => $retryAfter,
            ], 429);
        }

        RateLimiter::hit($key, $decaySeconds);

        return $next($request);
    }

    protected function resolveKey(Request $request, string $limiterName): string
    {
        if ($request->user()) {
            return $limiterName . '|' . $request->user()->id;
        }

        return $limiterName . '|' . $request->ip();
    }

    protected function getMaxAttempts(string $limiterName): int
    {
        return config("ratelimiter.limiters.{$limiterName}.max_attempts", config('ratelimiter.defaults.max_attempts'));
    }

    protected function getDecaySeconds(string $limiterName): int
    {
        return config("ratelimiter.limiters.{$limiterName}.decay_seconds", config('ratelimiter.defaults.decay_seconds'));
    }
}
