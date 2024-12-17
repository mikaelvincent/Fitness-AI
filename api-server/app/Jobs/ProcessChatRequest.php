<?php

namespace App\Jobs;

use App\Services\ChatService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

class ProcessChatRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $userId;
    protected array $userMessages;
    protected array $context;
    protected bool $stream;
    protected array $tools;

    /**
     * Create a new job instance.
     */
    public function __construct(int $userId, array $userMessages, array $context, bool $stream, array $tools)
    {
        $this->userId = $userId;
        $this->userMessages = $userMessages;
        $this->context = $context;
        $this->stream = $stream;
        $this->tools = $tools;
    }

    /**
     * Execute the job.
     */
    public function handle(ChatService $chatService): void
    {
        $response = $chatService->getResponse(
            $this->userId,
            $this->userMessages,
            $this->context,
            $this->stream,
            $this->tools
        );

        // Store the response in cache for retrieval
        Cache::put("chat_response_{$this->userId}", $response, now()->addMinutes(10));
    }
}
