<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // You can set CORS_ALLOWED_ORIGINS in your .env as a comma-separated list
    // Example: CORS_ALLOWED_ORIGINS="https://medicalcheckcenter.vercel.app,https://abcd-1234.ngrok.io"
    'allowed_origins' => env('CORS_ALLOWED_ORIGINS') ? array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS'))) : ['http://localhost:3000', 'http://127.0.0.1:3000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => env('CORS_SUPPORTS_CREDENTIALS', false),

];
