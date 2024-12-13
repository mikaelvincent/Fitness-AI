<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\UserAttribute;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that sendPasswordResetNotification dispatches the correct notification.
     */
    public function test_send_password_reset_notification_dispatches_correct_notification()
    {
        Notification::fake();
        $user = User::factory()->create();
        $token = 'test-reset-token';
        $user->sendPasswordResetNotification($token);
        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class,
            function ($notification, $channels) use ($token, $user) {
                return $notification->token === $token &&
                    $notification->toMail($user)->actionUrl === config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
            }
        );
    }

    /**
     * Test that the password reset notification contains the correct reset URL.
     */
    public function test_password_reset_notification_contains_correct_reset_url()
    {
        Notification::fake();
        $user = User::factory()->create();
        $token = 'another-test-token';
        $user->sendPasswordResetNotification($token);
        Notification::assertSentTo(
            [$user],
            ResetPasswordNotification::class,
            function ($notification, $channels) use ($token, $user) {
                $mailMessage = $notification->toMail($user);
                $expectedUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
                return $mailMessage->actionUrl === $expectedUrl;
            }
        );
    }

    /**
     * Test that sensitive attributes are hidden.
     */
    public function test_sensitive_attributes_are_hidden()
    {
        $user = User::factory()->create([
            'password' => 'secret',
            'two_factor_secret' => 'secret2fa',
            'two_factor_recovery_codes' => json_encode(['code1', 'code2']),
        ]);
        $hidden = $user->getHidden();
        $this->assertContains('password', $hidden);
        $this->assertContains('two_factor_secret', $hidden);
        $this->assertContains('two_factor_recovery_codes', $hidden);
    }

    /**
     * Test that date attributes are correctly cast.
     */
    public function test_date_attributes_are_cast_correctly()
    {
        $user = User::factory()->create([
            'two_factor_confirmed_at' => now(),
        ]);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->two_factor_confirmed_at);
    }

    /**
     * Test creating a personal access token.
     */
    public function test_creating_personal_access_token()
    {
        Sanctum::actingAs($user = User::factory()->create());
        $token = $user->createToken('test-token')->plainTextToken;
        $this->assertNotEmpty($token);
        $this->assertDatabaseHas('personal_access_tokens', [
            'name' => 'test-token',
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    /**
     * Test revoking a personal access token.
     */
    public function test_revoking_personal_access_token()
    {
        Sanctum::actingAs($user = User::factory()->create());
        $tokenInstance = $user->createToken('revokable-token');
        $token = $tokenInstance->plainTextToken;
        $this->assertDatabaseHas('personal_access_tokens', [
            'name' => 'revokable-token',
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
        $tokenInstance->accessToken->delete();
        $this->assertDatabaseMissing('personal_access_tokens', [
            'name' => 'revokable-token',
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    /**
     * Check that getAttributeByKey returns the correct value for an existing key.
     */
    public function test_get_attribute_by_key_returns_value()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'test_key', 'value' => 'test_value']);

        $value = $user->getAttributeByKey('test_key');
        $this->assertEquals('test_value', $value);
    }

    /**
     * Verify that getAttributeByKey returns null for a non-existent key.
     */
    public function test_get_attribute_by_key_returns_null()
    {
        $user = User::factory()->create();

        $value = $user->getAttributeByKey('non_existent_key');
        $this->assertNull($value);
    }

    /**
     * Ensure that setAttributeByKey creates a new attribute if it doesn't exist.
     */
    public function test_set_attribute_by_key_creates_attribute()
    {
        $user = User::factory()->create();

        $user->setAttributeByKey('new_key', 'new_value');

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'new_key',
            'value' => 'new_value',
        ]);
    }

    /**
     * Confirm that setAttributeByKey updates the value of an existing attribute.
     */
    public function test_set_attribute_by_key_updates_attribute()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'existing_key', 'value' => 'old_value']);

        $user->setAttributeByKey('existing_key', 'updated_value');

        $this->assertDatabaseHas('user_attributes', [
            'user_id' => $user->id,
            'key' => 'existing_key',
            'value' => 'updated_value',
        ]);

        $this->assertEquals('updated_value', $user->getAttributeByKey('existing_key'));
    }

    /**
     * Check that removeAttributeByKey deletes the specified attribute.
     */
    public function test_remove_attribute_by_key_deletes_attribute()
    {
        $user = User::factory()->create();
        $user->attributes()->create(['key' => 'test_key', 'value' => 'test_value']);

        $user->removeAttributeByKey('test_key');

        $this->assertDatabaseMissing('user_attributes', [
            'user_id' => $user->id,
            'key' => 'test_key',
        ]);
    }

    /**
     * Verify that removeAttributeByKey does not throw an error when the key does not exist.
     */
    public function test_remove_attribute_by_key_non_existent()
    {
        $user = User::factory()->create();

        $user->removeAttributeByKey('non_existent_key');

        $this->assertEquals(0, $user->attributes()->count());
    }
}