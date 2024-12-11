<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserAttribute;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserAttributeFactory extends Factory
{
    protected $model = UserAttribute::class;

    /**
     * Define the model's default state.
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'key' => $this->faker->unique()->word(),
            'value' => $this->faker->word(),
        ];
    }
}
