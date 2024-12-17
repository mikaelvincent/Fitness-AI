<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\TransientToken;

class UpdateTokenExpiry
{
    /**
    * Handle an incoming request.
    */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (
            $request->user() &&
            $request->user()->currentAccessToken() &&
            !($request->user()->currentAccessToken() instanceof TransientToken)
        ) {
            $token = $request->user()->currentAccessToken();
            $token->expires_at = now()->addMinutes(config('sanctum.expiration', 60));
            $token->save();
        }

        return $response;
    }
}
