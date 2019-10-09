<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class SingleTictactoeController extends Controller
{
    public function tictactoeSingle () {
        return view('pages.tictactoe.ttt_single');
    }

    public function tictactoeSingleRecord () {

        if ($_GET['result'] === 'win') {
            $user = User::find($_GET['id']);
            $user->ttt_single_wins += 1;
            $user->ttt_single_total += 1;
            $user->save();
        } elseif ($_GET['result'] === 'lose') {
            $user = User::find($_GET['id']);
            $user->ttt_single_losses += 1;
            $user->ttt_single_total += 1;
            $user->save();
        } elseif ($_GET['result'] === 'draw') {
            $user = User::find($_GET['id']);
            $user->ttt_single_draws += 1;
            $user->ttt_single_total += 1;
            $user->save();
        }
    }
}
