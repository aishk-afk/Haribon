<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SectionRequest;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\JsonResponse;

class SectionController extends Controller
{
    public function store(SectionRequest $request, Page $page): JsonResponse
    {
        $data = $request->validated();
        $data['display_order'] ??= ((int) $page->sections()->max('display_order')) + 1;

        $section = $page->sections()->create($data);

        return response()->json(['data' => $section], 201);
    }

    public function update(SectionRequest $request, PageSection $section): JsonResponse
    {
        $data = $request->validated();
        $data['display_order'] ??= $section->display_order;

        $section->update($data);

        return response()->json(['data' => $section->fresh()]);
    }

    public function destroy(PageSection $section): JsonResponse
    {
        $section->delete();

        return response()->json(['message' => 'Section deleted.']);
    }
}
