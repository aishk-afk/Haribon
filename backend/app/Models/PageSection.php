<?php

namespace App\Models;

use App\Support\Uploads;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    protected $fillable = [
        'page_id', 'section_key', 'eyebrow', 'heading', 'body', 'icon', 'image_path',
        'button_text', 'button_url', 'button2_text', 'button2_url', 'display_order',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return ['display_order' => 'integer'];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return Uploads::url($this->image_path);
    }
}
