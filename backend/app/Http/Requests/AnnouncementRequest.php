<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class AnnouncementRequest extends BaseCmsRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:10000'],
            'image_path' => $this->imageRule(),
            'status' => ['required', Rule::in(['published', 'draft'])],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
