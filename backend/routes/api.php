<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\TokenRefreshController;
use App\Http\Controllers\Auth\TwoFactorAuthenticationController;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Email Verification Routes
Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])
    ->middleware(['auth:sanctum', 'throttle:6,1']);
Route::get('/verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify')
    ->middleware(['signed', 'throttle:6,1']);

// Password Reset Routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->middleware('guest');
Route::post('/reset-password', [PasswordResetController::class, 'reset'])->middleware('guest');

// Token Refresh Route
Route::post('/refresh-token', [TokenRefreshController::class, 'refresh'])->middleware('auth:sanctum');

// Two-Factor Authentication Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/two-factor-authentication/enable', [TwoFactorAuthenticationController::class, 'enable']);
    Route::post('/two-factor-authentication/confirm', [TwoFactorAuthenticationController::class, 'confirm']);
    Route::post('/two-factor-authentication/disable', [TwoFactorAuthenticationController::class, 'disable']);
});
