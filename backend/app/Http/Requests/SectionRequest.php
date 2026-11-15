<?php

namespace App\Http\Requests;

use App\Models\PageSection;
use Illuminate\Validation\Rule;

class SectionRequest extends BaseCmsRequest
{
    public function rules(): array
    {
        $section = $this->route('section');
        $pageId = $section instanceof PageSection ? $section->page_id : $this->route('page')?->id;

        return [
            'section_key' => [
                'required', 'string', 'max:100', 'regex:/^[a-z0-9_-]+$/',
                Rule::unique('page_sections', 'section_key')
                    ->where('page_id', $pageId)
                    ->ignore($section),
            ],
            'eyebrow' => ['nullable', 'string', 'max:255'],
            'heading' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:5000'],
            'icon' => $this->iconRule(),
            'image_path' => $this->imageRule(),
            'button_text' => ['nullable', 'string', 'max:255'],
            'button_url' => $this->linkRule(),
            'button2_text' => ['nullable', 'string', 'max:255'],
            'button2_url' => $this->linkRule(),
            'display_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
