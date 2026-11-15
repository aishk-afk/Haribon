<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Page::published()->orderBy('id')->get(['id', 'title', 'slug']),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $page = Page::published()->where('slug', $slug)->with('sections')->firstOrFail();

        return response()->json(['data' => $page]);
    }
}
