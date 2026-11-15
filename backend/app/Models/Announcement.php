<?php

namespace App\Models;

use App\Support\Uploads;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = ['title', 'content', 'image_path', 'status', 'published_at'];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where(fn (Builder $q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()));
    }

    public function getImageUrlAttribute(): ?string
    {
        return Uploads::url($this->image_path);
    }
}
