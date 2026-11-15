<?php

return [

    /*
    | Icon keys the React site knows how to draw. Editors pick one of these in the CMS.
    */
    'icons' => [
        'logo', 'donate', 'member', 'partner', 'volunteer',
        'forest', 'species', 'people', 'sustainability',
    ],

    /*
    | Website settings editors may change, with their validation rules.
    | Only keys listed here can be written, so the table cannot be filled with arbitrary data.
    */
    'settings' => [
        'org_name' => 'required|string|max:120',
        'footer_description' => 'nullable|string|max:500',
        'contact_address' => 'nullable|string|max:500',
        'contact_email' => 'nullable|email|max:255',
        'contact_phone' => 'nullable|string|max:60',
        'facebook_url' => 'nullable|url|max:255',
        'instagram_url' => 'nullable|url|max:255',
        'linkedin_url' => 'nullable|url|max:255',
        'footer_notice' => 'nullable|string|max:500',
        'credits_note' => 'nullable|string|max:500',
    ],

    'upload' => [
        'mimes' => 'jpg,jpeg,png,webp,gif',
        'max_kb' => 4096,
    ],

    /*
    | Optional: lets `php artisan db:seed` create the first administrator from .env.
    | Leave empty to create the account with `php artisan cms:create-admin` instead.
    */
    'admin' => [
        'name' => env('CMS_ADMIN_NAME', 'Administrator'),
        'email' => env('CMS_ADMIN_EMAIL'),
        'password' => env('CMS_ADMIN_PASSWORD'),
    ],
];
