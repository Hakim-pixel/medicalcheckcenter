<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Minimal named login route to satisfy middleware/exception redirects.
// Some parts of the framework call route('login') when redirecting guests;
// if a named web "login" route doesn't exist this can surface as a 500
// during API requests. Define a simple placeholder here to avoid that.
Route::get('/login', function () {
    // For API consumers this shouldn't be used. Keep it minimal.
    return redirect('/');
})->name('login');
