<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Http\Controllers\User\UserAttributeController;
use App\Http\Controllers\Activities\ActivityController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\User\UserProfileController;

// Registration Routes
Route::group([], function () {
    Route::post('/registration/initiate', [RegistrationController::class, 'initiate'])
        ->middleware('custom.rate_limiter:registration');
    Route::post('/registration/resend', [RegistrationController::class, 'resend'])
        ->middleware('custom.rate_limiter:registration');
    Route::post('/registration/validate-token', [RegistrationController::class, 'validateToken'])
        ->middleware('custom.rate_limiter:registration');
    Route::post('/registration/complete', [RegistrationController::class, 'complete'])
        ->middleware('custom.rate_limiter:registration');
});

// Authentication Routes
Route::post('/login', [SessionController::class, 'login'])
    ->middleware('custom.rate_limiter:authentication');

Route::post('/logout', [SessionController::class, 'logout'])
    ->middleware(['auth:sanctum', 'update.token.expiry']);

// Password Management Routes
Route::post('/password/forgot', [PasswordController::class, 'sendResetLink'])
    ->middleware('custom.rate_limiter:password_reset');
Route::post('/password/reset', [PasswordController::class, 'reset'])
    ->middleware('custom.rate_limiter:password_reset');
Route::post('/password/change', [PasswordController::class, 'change'])
    ->middleware(['auth:sanctum', 'update.token.expiry']);

// Two-Factor Authentication Routes
Route::middleware(['auth:sanctum', 'update.token.expiry'])->group(function () {
    Route::post('/two-factor/enable', [TwoFactorController::class, 'enable']);
    Route::post('/two-factor/confirm', [TwoFactorController::class, 'confirm']);
    Route::post('/two-factor/disable', [TwoFactorController::class, 'disable']);
});

// User Attributes Routes
Route::middleware(['auth:sanctum', 'update.token.expiry'])->group(function () {
    Route::get('/user/attributes', [UserAttributeController::class, 'index']);
    Route::put('/user/attributes', [UserAttributeController::class, 'update']);
    Route::delete('/user/attributes', [UserAttributeController::class, 'destroy']);
});

// Activities Routes
Route::middleware(['auth:sanctum', 'update.token.expiry'])->group(function () {
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::put('/activities', [ActivityController::class, 'update']);
    Route::delete('/activities', [ActivityController::class, 'destroy']);
});

// Chat Routes
Route::middleware(['auth:sanctum', 'update.token.expiry'])->group(function () {
    Route::post('/chat', [ChatController::class, 'handle']);
});

// User Profile Routes
Route::middleware(['auth:sanctum', 'update.token.expiry'])->group(function () {
    Route::get('/user/profile', [UserProfileController::class, 'show']);
    Route::put('/user/profile/name', [UserProfileController::class, 'updateName']);
});
