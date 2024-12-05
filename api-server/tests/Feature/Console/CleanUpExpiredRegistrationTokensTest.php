<?php

namespace Tests\Feature\Console;

use App\Models\RegistrationToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;
use Illuminate\Support\Carbon;

class CleanUpExpiredRegistrationTokensTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the command deletes all expired registration tokens.
     */
    public function test_command_deletes_expired_registration_tokens()
    {
        // Create expired registration tokens
        RegistrationToken::factory()->expired()->count(5)->create();

        // Create unexpired registration tokens
        RegistrationToken::factory()->count(3)->create();

        // Execute the cleanup command
        Artisan::call('registration-tokens:cleanup');

        // Assert that expired tokens are deleted
        $this->assertDatabaseCount('registration_tokens', 3);
    }

    /**
     * Test that the command does not delete unexpired registration tokens.
     */
    public function test_command_does_not_delete_unexpired_registration_tokens()
    {
        // Create unexpired registration tokens
        RegistrationToken::factory()->count(4)->create();

        // Execute the cleanup command
        Artisan::call('registration-tokens:cleanup');

        // Assert that unexpired tokens remain
        $this->assertDatabaseCount('registration_tokens', 4);
    }

    /**
     * Test that the command output displays the correct number of deleted tokens.
     */
    public function test_command_output_displays_correct_deletion_count()
    {
        // Create expired registration tokens
        RegistrationToken::factory()->expired()->count(2)->create();

        // Execute the cleanup command and capture the output
        $exitCode = Artisan::call('registration-tokens:cleanup');
        $output = Artisan::output();

        // Assert the command was successful
        $this->assertEquals(0, $exitCode);

        // Assert the output message
        $this->assertStringContainsString('Deleted 2 expired registration tokens.', $output);
    }

    /**
     * Test command execution when there are no expired tokens (expect zero deletions).
     */
    public function test_command_executes_with_no_expired_tokens()
    {
        // Create unexpired registration tokens
        RegistrationToken::factory()->count(3)->create();

        // Execute the cleanup command and capture the output
        $exitCode = Artisan::call('registration-tokens:cleanup');
        $output = Artisan::output();

        // Assert the command was successful
        $this->assertEquals(0, $exitCode);

        // Assert the output message
        $this->assertStringContainsString('Deleted 0 expired registration tokens.', $output);
    }
}
