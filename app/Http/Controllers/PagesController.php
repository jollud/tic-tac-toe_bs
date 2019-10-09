<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use function MongoDB\BSON\toJSON;
use function Sodium\increment;

class PagesController extends Controller
{
    public function index () {

        return view('pages.main');
    }

    public function tictactoeSingleDeviceMultiplayer () {
        return view('pages.tictactoe.ttt_sdm');
    }

    public function logout () {
        Auth::logout();
        return redirect('/');
    }

}
