<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\UserController;
use App\Publishers\PublisherContract;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\StructureDiscoverer\Discover;

Route::get('/', function () {
        $providers = Discover::in(app_path('Publishers'))->classes()->implementing(PublisherContract::class)->get();
        $providerData = array_map(function ($el) {
                /** @var PublisherContract */
                $instance = new $el();
                $name = $instance->getName();
                $inputs = $instance->getInputs();
                return [
                    'name' => $name,
                ];
            }, $providers);

    return Inertia::render('Home', [
        'platforms' => $providerData
    ]);
});

Route::middleware('auth')->group(function () {
    Route::prefix('app')->group(function () {
        Route::get('/articles', [ArticleController::class, 'index'])->name('app.articles.index');
        Route::post('/articles', [ArticleController::class, 'store'])->name('app.articles.store');
        Route::get('/articles/edit/{article}', [ArticleController::class, 'edit'])->name('app.articles.edit');
        Route::put('/articles/{article}', [ArticleController::class, 'update'])->name('app.articles.update');
        Route::delete('/articles/{article}', [ArticleController::class, 'destroy'])->name('app.articles.destroy');
        Route::post('/articles/{article}/publish', [ArticleController::class, 'publish'])->name('app.articles.publish');
        Route::get('/articles/new', [ArticleController::class, 'create'])->name('app.articles.create');
        Route::get('/publishers', [PublisherController::class, 'index'])->name('app.publishers.index');
        Route::post('/publishers', [PublisherController::class, 'store'])->name('app.publishers.store');
        Route::get('/publishers/new', [PublisherController::class, 'create'])->name('app.publishers.create');
        Route::delete('/publishers/{publisher}', [PublisherController::class, 'destroy'])->name('app.publishers.destroy');
        Route::get('/publishers/edit/{publisher}', [PublisherController::class, 'edit'])->name('app.publishers.edit');
        Route::put('/publishers/{publisher}', [PublisherController::class, 'update'])->name('app.publishers.update');
        Route::get('/profile/keys', [UserController::class, 'keys'])->name('app.profile.keys');
        Route::post('/profile/keys', [UserController::class, 'storeKey'])->name('app.profile.keys.store');
    });
});
