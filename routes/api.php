<?php

use App\Http\Controllers\PublisherController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
   Route::prefix('publishers')->group(function () {
      Route::get('', [PublisherController::class, 'indexApi']);
   });
});
