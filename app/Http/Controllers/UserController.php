<?php

namespace App\Http\Controllers;

class UserController extends Controller
{
    public function keys()
    {
        return view('profile.keys');
    }
}
