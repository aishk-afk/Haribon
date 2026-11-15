<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 20), 1), 50);

        $items = Announcement::published()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        return response()->json(['data' => $items]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => Announcement::published()->findOrFail($id)]);
    }
}
