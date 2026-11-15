<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['setting_key', 'setting_value'];

    /** All settings as a simple key => value map. */
    public static function asMap(): array
    {
        return static::query()->pluck('setting_value', 'setting_key')->all();
    }
}
