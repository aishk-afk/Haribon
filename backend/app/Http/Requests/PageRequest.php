<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class PageRequest extends BaseCmsRequest
{
    public function rules(): array
    {
        $page = $this->route('page');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required', 'string', 'max:100', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('pages', 'slug')->ignore($page),
            ],
            'status' => ['required', Rule::in(['published', 'draft'])],
        ];
    }
}
