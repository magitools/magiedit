<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function keys()
    {
        return Inertia::render('App/Profile/Keys', [
            'keys' => Auth::user()->tokens
        ]);
    }

    public function storeKey(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required'
        ]);
        $data = Auth::user()->createToken($validated['name']);
        return response()->json(data: [
            'token' => $data->plainTextToken
        ], status:201);
    }
}
