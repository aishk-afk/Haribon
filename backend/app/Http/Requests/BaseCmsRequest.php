<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Shared rules for CMS form requests. Administrator access is enforced by the
 * `admin` route middleware, so authorize() only needs to return true here.
 */
abstract class BaseCmsRequest extends FormRequest
{
    /** Links may only be site paths, anchors or http(s) URLs. This blocks javascript: links. */
    public const URL_PATTERN = '/^(\/|#|https?:\/\/)\S*$/i';

    public function authorize(): bool
    {
        return true;
    }

    protected function imageRule(): array
    {
        return ['nullable', 'string', 'max:255', Rule::exists('media', 'path')];
    }

    protected function iconRule(): array
    {
        return ['nullable', 'string', Rule::in(config('cms.icons'))];
    }

    protected function linkRule(): array
    {
        return ['nullable', 'string', 'max:255', 'regex:'.self::URL_PATTERN];
    }
}
