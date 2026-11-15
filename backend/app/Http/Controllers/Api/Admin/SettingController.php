<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SettingsRequest;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['data' => SiteSetting::asMap()]);
    }

    public function update(SettingsRequest $request): JsonResponse
    {
        $allowed = array_keys(config('cms.settings'));
        $values = $request->validated()['settings'];

        DB::transaction(function () use ($allowed, $values) {
            foreach ($allowed as $key) {
                if (array_key_exists($key, $values)) {
                    SiteSetting::updateOrCreate(
                        ['setting_key' => $key],
                        ['setting_value' => $values[$key]],
                    );
                }
            }
        });

        return response()->json(['data' => SiteSetting::asMap()]);
    }
}
