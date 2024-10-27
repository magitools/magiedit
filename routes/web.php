<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->group(function () {
    Route::prefix('app')->group(function () {
        Route::get('/articles', [ArticleController::class, 'index'])->name('app.articles.index');
        Route::post('/articles', [ArticleController::class, 'store'])->name('app.articles.store');
        Route::get('/articles/edit/{article}', [ArticleController::class, 'edit'])->name('app.articles.edit');
        Route::put('/articles/{article}', [ArticleController::class, 'update'])->name('app.articles.update');
        Route::post('/articles/{article}/publish', [ArticleController::class, 'publish'])->name('app.articles.publish');
        Route::get('/articles/new', [ArticleController::class, 'create'])->name('app.articles.create');
        Route::get('/publishers', [PublisherController::class, 'index'])->name('app.publishers.index');
        Route::post('/publishers', [PublisherController::class, 'store'])->name('app.publishers.store');
        Route::get('/publishers/new', [PublisherController::class, 'create'])->name('app.publishers.create');
        //Route::get('/publishers/edit/{publisher}', [PublisherController::class, 'edit'])->name('app.publishers.edit');
        Route::get('/profile/keys', [UserController::class, 'keys'])->name('app.profile.keys');
        Route::post('/profile/keys', [UserController::class, 'storeKey'])->name('app.profile.keys.store');
    });
});
