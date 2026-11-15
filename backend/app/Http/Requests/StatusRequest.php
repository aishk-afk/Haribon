<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class StatusRequest extends BaseCmsRequest
{
    public function rules(): array
    {
        return ['status' => ['required', Rule::in(['published', 'draft'])]];
    }
}
