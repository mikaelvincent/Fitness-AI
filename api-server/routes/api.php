<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\TokenRefreshController;
use App\Http\Controllers\Auth\TwoFactorAuthenticationController;
use App\Http\Controllers\Auth\ChangePasswordController;

// Registration Routes
Route::group([], function () {
    Route::post('/register/initiate', [RegisteredUserController::class, 'initiate']);
    Route::post('/register/resend', [RegisteredUserController::class, 'resend']);
    Route::post('/register/validate-token', [RegisteredUserController::class, 'validateToken']);
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

// Authentication Routes
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
Route::post('/refresh-token', [TokenRefreshController::class, 'refresh'])->middleware('auth:sanctum');

// Password Management Routes
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])->middleware('guest');
Route::post('/reset-password', [PasswordResetController::class, 'reset'])->middleware('guest');
Route::post('/password/update', [ChangePasswordController::class, 'update'])->middleware('auth:sanctum');

// Two-Factor Authentication Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/two-factor-authentication/enable', [TwoFactorAuthenticationController::class, 'enable']);
    Route::post('/two-factor-authentication/confirm', [TwoFactorAuthenticationController::class, 'confirm']);
    Route::post('/two-factor-authentication/disable', [TwoFactorAuthenticationController::class, 'disable']);
});
