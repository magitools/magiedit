<?php

namespace App\Http\Controllers;

use App\Http\Resources\PublisherResource;
use App\Models\Publisher;
use App\Publishers\PublisherContract;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\StructureDiscoverer\Discover;
use Spatie\YamlFrontMatter\YamlFrontMatter;


class PublisherController extends Controller
{
    public function index()
    {
        return Inertia::render('App/Publishers/Index', [
            'publishers' => Auth::user()->publishers
        ]);
    }

    public function create()
    {
        $providers = Discover::in(app_path('Publishers'))->classes()->implementing(PublisherContract::class)->get();
        $providerData = array_map(function ($el) {
                /** @var PublisherContract */
                $instance = new $el();
                $name = $instance->getName();
                $inputs = $instance->getInputs();
                return [
        'class' => $el,
                    'name' => $name,
                    'inputs' => $inputs
                ];
            }, $providers);

        return Inertia::render('App/Publishers/Create', [
            'providers' => $providerData        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'data' => 'required|array',
            'class_name' => 'required|string'
        ]);
        Auth::user()->publishers()->create([
            'name' => $validated['name'],
            'data' => $validated['data'],
            'class_name' => $validated['class_name'],
        ]);
        return to_route('app.publishers.index');
    }

    public function destroy(Publisher $publisher)
    {
        $publisher->delete();
        return to_route('app.publishers.index');
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
        $publishers = Publisher::query()->whereIn('id', $validated['publishers'])->get();
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
