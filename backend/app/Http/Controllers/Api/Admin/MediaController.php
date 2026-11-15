<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MediaRequest;
use App\Models\Announcement;
use App\Models\Media;
use App\Models\PageSection;
use App\Models\Program;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Media::orderByDesc('id')->get()]);
    }

    public function store(MediaRequest $request): JsonResponse
    {
        $file = $request->file('file');

        // store() generates a random file name, so the original name never touches the file system.
        $path = $file->store('uploads', 'public');

        $media = Media::create([
            'filename' => mb_substr($file->getClientOriginalName(), 0, 255),
            'path' => $path,
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'size' => $file->getSize() ?: 0,
        ]);

        return response()->json(['data' => $media], 201);
    }

    public function destroy(Media $media): JsonResponse
    {
        DB::transaction(function () use ($media) {
            // Clear every place that still points at this image so nothing is left broken.
            PageSection::where('image_path', $media->path)->update(['image_path' => null]);
            Program::where('image_path', $media->path)->update(['image_path' => null]);
            Announcement::where('image_path', $media->path)->update(['image_path' => null]);

            $media->delete();
        });

        Storage::disk('public')->delete($media->path);

        return response()->json(['message' => 'Image deleted.']);
    }
}
