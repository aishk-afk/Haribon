<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ProgramRequest extends BaseCmsRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'icon' => $this->iconRule(),
            'items' => ['nullable', 'array', 'max:20'],
            'items.*' => ['required', 'string', 'max:120'],
            'image_path' => $this->imageRule(),
            'status' => ['required', Rule::in(['published', 'draft'])],
            'published_at' => ['nullable', 'date'],
            'display_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
