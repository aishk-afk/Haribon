<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\JsonResponse;

class ProgramController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Program::published()->orderBy('display_order')->orderBy('id')->get(),
        ]);
    }
}
