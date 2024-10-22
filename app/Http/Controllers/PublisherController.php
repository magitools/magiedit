<?php

namespace App\Http\Controllers;

use App\Http\Resources\PublisherResource;
use App\Models\Publisher;
use App\Publishers\PublisherContract;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\YamlFrontMatter\YamlFrontMatter;


class PublisherController extends Controller
{
    public function index(): View
    {
        return view('publishers.index');
    }

    public function create(): View
    {
        return view('publishers.create');
    }

    public function indexApi(): JsonResponse
    {
            return response()->json([
                'publishers' => PublisherResource::collection(Auth::user()->publishers)
            ]);
    }

    public function publishApi(Request $request): JsonResponse
    {
        $validated = $request->validate([
           'publishers' => 'required|array',
            'content' => 'required'
        ]);
        $parsed = YamlFrontMatter::parse($validated['content']);
        Log::info($validated['content']);
        Log::info(implode(',', $validated['publishers']));
        $publishers = Publisher::query()->whereIn('id', $validated['publishers'])->get();
        Log::info(count($publishers));
        $res = [];
        foreach ($publishers as $publisher) {
            $className = $publisher->class_name;
            /** @var PublisherContract */
            $instance = new $className();
            $valid = $instance
                ->setData($publisher->data)
                ->setFm($parsed->matter())
                ->publish($validated['content']);
            $res[$publisher->name] = $valid;
        }
        return response()->json(['status' => $res]);
    }
}
