<?php

namespace Database\Factories;

use App\Models\RegistrationToken;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class RegistrationTokenFactory extends Factory
{
    protected $model = RegistrationToken::class;

    public function definition()
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'token' => hash('sha256', Str::random(60)),
            'expires_at' => Carbon::now()->addHour(),
        ];
    }

    /**
     * Indicate that the registration token is expired.
     */
    public function expired()
    {
        return $this->state(function (array $attributes) {
            return [
                'expires_at' => Carbon::now()->subMinutes(5),
            ];
        });
    }
}
