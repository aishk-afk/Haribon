<?php

namespace App\Http\Requests;

class SettingsRequest extends BaseCmsRequest
{
    public function rules(): array
    {
        $rules = ['settings' => ['required', 'array']];

        foreach (config('cms.settings') as $key => $rule) {
            $rules["settings.$key"] = $rule;
        }

        return $rules;
    }
}
