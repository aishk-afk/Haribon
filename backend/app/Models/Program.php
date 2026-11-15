<?php

namespace App\Models;

use App\Support\Uploads;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'title', 'description', 'icon', 'items', 'image_path', 'status', 'published_at', 'display_order',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'published_at' => 'datetime',
            'display_order' => 'integer',
        ];
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
