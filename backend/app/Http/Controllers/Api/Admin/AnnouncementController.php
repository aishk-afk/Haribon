<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementRequest;
use App\Http\Requests\StatusRequest;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Announcement::orderByDesc('created_at')->orderByDesc('id')->get(),
        ]);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json(['data' => $announcement]);
    }

    public function store(AnnouncementRequest $request): JsonResponse
    {
        $announcement = Announcement::create($this->prepare($request->validated()));

        return response()->json(['data' => $announcement], 201);
    }

    public function update(AnnouncementRequest $request, Announcement $announcement): JsonResponse
    {
        $announcement->update($this->prepare($request->validated(), $announcement));

        return response()->json(['data' => $announcement->fresh()]);
    }

    public function status(StatusRequest $request, Announcement $announcement): JsonResponse
    {
        $announcement->update($this->prepare($request->validated(), $announcement));

        return response()->json(['data' => $announcement->fresh()]);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted.']);
    }

    /** Publishing for the first time stamps the publication date. */
    private function prepare(array $data, ?Announcement $existing = null): array
    {
        if (($data['status'] ?? null) === 'published') {
            $data['published_at'] ??= $existing?->published_at ?? now();
        }

        return $data;
    }
}
