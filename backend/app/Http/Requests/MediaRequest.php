<?php

namespace App\Http\Requests;

class MediaRequest extends BaseCmsRequest
{
    public function rules(): array
    {
        $mimes = config('cms.upload.mimes');
        $max = config('cms.upload.max_kb');

        return [
            // `image` + `mimes` check the real file contents, not just the extension. SVG is not allowed.
            'file' => ['required', 'file', 'image', "mimes:{$mimes}", "max:{$max}"],
        ];
    }
}
