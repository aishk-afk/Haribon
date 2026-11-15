<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Program;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(['data' => [
            'pages' => ['total' => Page::count(), 'published' => Page::published()->count()],
            'sections' => PageSection::count(),
            'programs' => [
                'total' => Program::count(),
                'published' => Program::where('status', 'published')->count(),
            ],
            'announcements' => [
                'total' => Announcement::count(),
                'published' => Announcement::where('status', 'published')->count(),
            ],
            'media' => Media::count(),
        ]]);
    }
}
