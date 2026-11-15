<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => 'Haribon CMS API',
    'status' => 'ok',
]));
