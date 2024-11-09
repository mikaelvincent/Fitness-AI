<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use App\Notifications\VerifyEmailNotification;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_verification_email_is_sent_after_registration()
    {
        Notification::fake();

        $this->postJson("/api/register", [
            "name" => "John Doe",
            "email" => "john@example.com",
            "password" => "Password123!",
            "password_confirmation" => "Password123!",
        ]);

        $user = User::where("email", "john@example.com")->first();

        Notification::assertSentTo($user, VerifyEmailNotification::class);
    }

    public function test_user_can_verify_email()
    {
        $user = User::factory()->create([
            "email_verified_at" => null,
        ]);

        $verificationUrl = URL::temporarySignedRoute(
            "verification.verify",
            now()->addMinutes(config("auth.verification.expire", 60)),
            [
                "id" => $user->id,
                "hash" => sha1($user->getEmailForVerification()),
            ]
        );

        $this->getJson($verificationUrl)
            ->assertStatus(200)
            ->assertJson(["message" => "Email verified successfully."]);

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    public function test_cannot_verify_email_with_invalid_hash()
    {
        $user = User::factory()->create([
            "email_verified_at" => null,
        ]);

        $invalidUrl = URL::temporarySignedRoute(
            "verification.verify",
            now()->addMinutes(config("auth.verification.expire", 60)),
            ["id" => $user->id, "hash" => "invalid-hash"]
        );

        $this->getJson($invalidUrl)
            ->assertStatus(400)
            ->assertJson(["message" => "Invalid verification link."]);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_resend_verification_email()
    {
        Notification::fake();

        $user = User::factory()->create([
            "email_verified_at" => null,
        ]);

        $this->actingAs($user, "sanctum")
            ->postJson("/api/email/verification-notification")
            ->assertStatus(200)
            ->assertJson(["message" => "Verification email sent."]);

        Notification::assertSentTo($user, VerifyEmailNotification::class);
    }
}
