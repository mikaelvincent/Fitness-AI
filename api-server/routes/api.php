<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\TokenController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Http\Controllers\User\UserAttributeController;

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
    ->middleware('auth:sanctum');

// Password Management Routes
Route::post('/password/forgot', [PasswordController::class, 'sendResetLink'])
    ->middleware('custom.rate_limiter:password_reset');
Route::post('/password/reset', [PasswordController::class, 'reset'])
    ->middleware('custom.rate_limiter:password_reset');
Route::post('/password/change', [PasswordController::class, 'change'])
    ->middleware('auth:sanctum');

// Token Refresh Route
Route::post('/token/refresh', [TokenController::class, 'refresh'])
    ->middleware('auth:sanctum');

// Two-Factor Authentication Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/two-factor/enable', [TwoFactorController::class, 'enable']);
    Route::post('/two-factor/confirm', [TwoFactorController::class, 'confirm']);
    Route::post('/two-factor/disable', [TwoFactorController::class, 'disable']);
});

// User Attributes Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/attributes', [UserAttributeController::class, 'index']);
    Route::put('/user/attributes', [UserAttributeController::class, 'update']);
    Route::delete('/user/attributes', [UserAttributeController::class, 'destroy']);
});
