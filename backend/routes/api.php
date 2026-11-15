<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API (published content only)
|--------------------------------------------------------------------------
*/
Route::get('/pages', [PageController::class, 'index']);
Route::get('/pages/{slug}', [PageController::class, 'show']);
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'show'])->whereNumber('id');
Route::get('/settings', [SettingController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authentication (Sanctum cookie/session)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    /*
    |----------------------------------------------------------------------
    | Administrator API (must be logged in AND be an administrator)
    |----------------------------------------------------------------------
    */
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', Admin\DashboardController::class);

        Route::get('/pages', [Admin\PageController::class, 'index']);
        Route::post('/pages', [Admin\PageController::class, 'store']);
        Route::get('/pages/{page}', [Admin\PageController::class, 'show']);
        Route::put('/pages/{page}', [Admin\PageController::class, 'update']);
        Route::patch('/pages/{page}/status', [Admin\PageController::class, 'status']);
        Route::delete('/pages/{page}', [Admin\PageController::class, 'destroy']);

        Route::post('/pages/{page}/sections', [Admin\SectionController::class, 'store']);
        Route::put('/sections/{section}', [Admin\SectionController::class, 'update']);
        Route::delete('/sections/{section}', [Admin\SectionController::class, 'destroy']);

        Route::get('/programs', [Admin\ProgramController::class, 'index']);
        Route::post('/programs', [Admin\ProgramController::class, 'store']);
        Route::get('/programs/{program}', [Admin\ProgramController::class, 'show']);
        Route::put('/programs/{program}', [Admin\ProgramController::class, 'update']);
        Route::patch('/programs/{program}/status', [Admin\ProgramController::class, 'status']);
        Route::delete('/programs/{program}', [Admin\ProgramController::class, 'destroy']);

        Route::get('/announcements', [Admin\AnnouncementController::class, 'index']);
        Route::post('/announcements', [Admin\AnnouncementController::class, 'store']);
        Route::get('/announcements/{announcement}', [Admin\AnnouncementController::class, 'show']);
        Route::put('/announcements/{announcement}', [Admin\AnnouncementController::class, 'update']);
        Route::patch('/announcements/{announcement}/status', [Admin\AnnouncementController::class, 'status']);
        Route::delete('/announcements/{announcement}', [Admin\AnnouncementController::class, 'destroy']);

        Route::get('/media', [Admin\MediaController::class, 'index']);
        Route::post('/media', [Admin\MediaController::class, 'store']);
        Route::delete('/media/{media}', [Admin\MediaController::class, 'destroy']);

        Route::get('/settings', [Admin\SettingController::class, 'show']);
        Route::put('/settings', [Admin\SettingController::class, 'update']);
    });
});
