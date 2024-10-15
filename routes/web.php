<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PublisherController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->group(function () {
    Route::prefix('app')->group(function () {
        Route::get('/articles', [ArticleController::class, 'index'])->name('app.articles.index');
        Route::get('/articles/edit/{article}', [ArticleController::class, 'edit'])->name('app.articles.edit');
        Route::get('/articles/new', [ArticleController::class, 'create'])->name('app.articles.create');
        Route::get('/publishers', [PublisherController::class, 'index'])->name('app.publishers.index');
        Route::get('/publishers/new', [PublisherController::class, 'create'])->name('app.publishers.create');
    });
});
