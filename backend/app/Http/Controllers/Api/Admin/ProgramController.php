<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProgramRequest;
use App\Http\Requests\StatusRequest;
use App\Models\Program;
use Illuminate\Http\JsonResponse;

class ProgramController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Program::orderBy('display_order')->orderBy('id')->get(),
        ]);
    }

    public function show(Program $program): JsonResponse
    {
        return response()->json(['data' => $program]);
    }

    public function store(ProgramRequest $request): JsonResponse
    {
        $data = $this->prepare($request->validated());
        $data['display_order'] ??= ((int) Program::max('display_order')) + 1;

        return response()->json(['data' => Program::create($data)], 201);
    }

    public function update(ProgramRequest $request, Program $program): JsonResponse
    {
        $data = $this->prepare($request->validated(), $program);
        $data['display_order'] ??= $program->display_order;

        $program->update($data);

        return response()->json(['data' => $program->fresh()]);
    }

    public function status(StatusRequest $request, Program $program): JsonResponse
    {
        $data = $this->prepare($request->validated(), $program);
        $program->update($data);

        return response()->json(['data' => $program->fresh()]);
    }

    public function destroy(Program $program): JsonResponse
    {
        $program->delete();

        return response()->json(['message' => 'Program deleted.']);
    }

    /** Publishing for the first time stamps the publication date. */
    private function prepare(array $data, ?Program $existing = null): array
    {
        if (($data['status'] ?? null) === 'published') {
            $data['published_at'] ??= $existing?->published_at ?? now();
        }

        return $data;
    }
}
