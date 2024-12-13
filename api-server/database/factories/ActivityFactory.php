<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'date' => $this->faker->date(),
            'parent_id' => null,
            'position' => $this->faker->randomDigit(),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'notes' => $this->faker->optional()->paragraph(),
            'metrics' => $this->faker->optional()->randomElements(
                [
                    'distance' => $this->faker->numberBetween(1, 100),
                    'unit' => $this->faker->randomElement(['km', 'mi']),
                    'duration' => $this->faker->numberBetween(10, 360),
                ],
                $count = $this->faker->numberBetween(1, 3),
                $preserveKeys = true
            ),
            'completed' => false,
        ];
    }
}
