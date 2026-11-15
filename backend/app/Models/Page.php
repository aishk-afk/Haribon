<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    /** Pages the public site depends on. They can be unpublished but not deleted. */
    public const PROTECTED_SLUGS = ['home', 'about', 'donate'];

    protected $fillable = ['title', 'slug', 'status'];

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('display_order')->orderBy('id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function isProtected(): bool
    {
        return in_array($this->slug, self::PROTECTED_SLUGS, true);
    }
}
