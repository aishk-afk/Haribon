<?php

namespace App\Models;

use App\Support\Uploads;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = ['filename', 'path', 'mime_type', 'size'];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return Uploads::url($this->path);
    }
}
