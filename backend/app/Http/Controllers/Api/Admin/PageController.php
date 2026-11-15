<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PageRequest;
use App\Http\Requests\StatusRequest;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Page::withCount('sections')->orderBy('id')->get(),
        ]);
    }

    public function show(Page $page): JsonResponse
    {
        return response()->json(['data' => $page->load('sections')]);
    }

    public function store(PageRequest $request): JsonResponse
    {
        $page = Page::create($request->validated());

        return response()->json(['data' => $page->load('sections')], 201);
    }

    public function update(PageRequest $request, Page $page): JsonResponse
    {
        $data = $request->validated();

        // The public site finds these pages by slug, so the slug of a core page is fixed.
        if ($page->isProtected()) {
            $data['slug'] = $page->slug;
        }

        $page->update($data);

        return response()->json(['data' => $page->load('sections')]);
    }

    public function status(StatusRequest $request, Page $page): JsonResponse
    {
        $page->update($request->validated());

        return response()->json(['data' => $page]);
    }

    public function destroy(Page $page): JsonResponse
    {
        if ($page->isProtected()) {
            return response()->json([
                'message' => 'Core pages cannot be deleted. Unpublish the page instead.',
            ], 422);
        }

        $page->delete();

        return response()->json(['message' => 'Page deleted.']);
    }
}
