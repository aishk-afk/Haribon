<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(ContentSeeder::class);

        // Optional: create the first administrator from .env (never commit real credentials).
        $email = config('cms.admin.email');
        $password = config('cms.admin.password');

        if ($email && $password) {
            User::updateOrCreate(
                ['email' => $email],
                ['name' => config('cms.admin.name'), 'password' => $password, 'is_admin' => true],
            );
        }
    }
}
