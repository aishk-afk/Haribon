<?php

namespace App\Support;

/**
 * Turns a path on the public disk into the relative URL the React app uses.
 * The URL is relative on purpose, so it works behind the Vite proxy and in production.
 */
class Uploads
{
    public static function url(?string $path): ?string
    {
        return $path ? '/storage/'.ltrim($path, '/') : null;
    }
}
