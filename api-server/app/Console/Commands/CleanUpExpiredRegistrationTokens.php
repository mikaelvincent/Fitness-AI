<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RegistrationToken;

class CleanUpExpiredRegistrationTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'registration-tokens:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired registration tokens from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = RegistrationToken::where('expires_at', '<', now())->delete();

        $this->info("Deleted {$count} expired registration tokens.");
    }
}
