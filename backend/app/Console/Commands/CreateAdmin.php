<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdmin extends Command
{
    protected $signature = 'cms:create-admin {--name=} {--email=} {--password=}';

    protected $description = 'Create (or update) a CMS administrator account';

    public function handle(): int
    {
        $name = $this->option('name') ?: $this->ask('Name', 'Administrator');
        $email = $this->option('email') ?: $this->ask('Email');
        $password = $this->option('password') ?: $this->secret('Password (min 8 characters)');

        $validator = Validator::make(
            compact('name', 'email', 'password'),
            ['name' => 'required|string|max:255', 'email' => 'required|email', 'password' => 'required|string|min:8'],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            ['name' => $name, 'password' => $password, 'is_admin' => true],
        );

        $this->info("Administrator ready: {$user->email}");

        return self::SUCCESS;
    }
}
