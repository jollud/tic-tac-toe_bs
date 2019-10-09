<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;

class MultiplayerBattleshipController extends Controller
{
    public function battleshipMultiplayer () {
        if (!Auth::check()){
            return redirect('/login');
        }
        return view('pages.battleship.bs_mult');
    }

    public function battleshipMultiplayerQueue () {
        if (!Auth::check()){
            return redirect('/login');
        }
        Redis::command('lrem', ['bs_queue', '0', Auth::id()]);
        Redis::command('lpush', ['bs_queue', Auth::id()]);
        Redis::command('set', ['bs_'.Auth::id(), 'not_playing']);
        if (Redis::command('llen', ['bs_queue']) >= 2) {
            $players []['id'] = Redis::command('rpop', ['bs_queue']);
            $players []['id'] = Redis::command('rpop', ['bs_queue']);

            $players[0]['name'] = User::where('id', '=', $players[0])->pluck('name')[0];
            $players[1]['name'] = User::where('id', '=', $players[1])->pluck('name')[0];

            $game_number = $players[0]['id'].'_'.$players[1]['id'];
            Redis::command('set', ['bs_'.$players[0]['id'], $game_number]);
            Redis::command('set', ['bs_'.$players[1]['id'], $game_number]);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[0]['id'].'_name', $players[0]['name']]);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[1]['id'].'_name', $players[1]['name']]);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[0]['id'].'_state', 'formation']);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[1]['id'].'_state', 'formation']);

            return redirect('/bs_mult');
        } else {
            return view('pages.battleship.bs_mult_queue');
        }
    }

    public function battleshipMultiplayerQueueCheck () {
        if (Redis::command('llen', ['bs_queue']) >= 2) {
            $players []['id'] = Redis::command('rpop', ['bs_queue']);
            $players []['id'] = Redis::command('rpop', ['bs_queue']);

            $players[0]['name'] = User::where('id', '=', $players[0])->pluck('name')[0];
            $players[1]['name'] = User::where('id', '=', $players[1])->pluck('name')[0];

            $game_number = $players[0]['id'].'_'.$players[1]['id'];
            Redis::command('set', ['bs_'.$players[0]['id'], $game_number]);
            Redis::command('set', ['bs_'.$players[1]['id'], $game_number]);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[0]['id'].'_name', $players[0]['name']]);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[1]['id'].'_name', $players[1]['name']]);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[0]['id'].'_state', 'formation']);
            Redis::command('set', ['bs_'.$game_number.'_'.$players[1]['id'].'_state', 'formation']);

            return 'success';
        } elseif (Redis::command('get', ['bs_'.Auth::id()]) != 'not_playing') {

            return 'success';
        }
    }

    public function battleshipMultiplayerQueueLeave () {
        Redis::command('lrem', ['bs_queue', '0', Auth::id()]);
    }

    public function battleshipMultiplayerGameData () {
        $game_data = [];
        $game_data['game_number'] = Redis::command('get', ['bs_'.Auth::id()]);
        $players_ids = explode('_', $game_data['game_number']);
        $opponent_id = array_filter($players_ids, function ($v) {
            return $v != Auth::id() && $v != 'bs';
        });
        $opponent_id = implode('', $opponent_id);
        $game_data['opponent_name'] = Redis::command('get', ['bs_'.$game_data['game_number'].'_'.$opponent_id.'_name']);
        $game_data['opponent_id'] = $opponent_id;

//        Redis::command('set', ['bs_'.$game_data['game_number'].'_'.Auth::id().'_state', 'formation']);

        Redis::command('set', ['bs_'.$game_data['game_number'].'_turn', 'undefined']);

        return json_encode($game_data);
    }

    public function battleshipMultiplayerSubmit () {
        $ship_info = json_decode($_GET['info']);
        $game_number = $_GET['game_number'];
        $query_prefix = 'bs_'.$game_number.'_'.Auth::id();
        foreach ($ship_info as $ship => $cells) {
            $cells_json = json_encode($cells);
            Redis::command('set', [$query_prefix.'_'.$ship, $cells_json]);
        }
        Redis::command('set', [$query_prefix.'_state', 'ready']);

        $turn = Redis::command('get', ['bs_'.$game_number.'_turn']);

        if ($turn === 'undefined') {
            Redis::command('set', ['bs_'.$game_number.'_turn', Auth::id()]);
            $turn = Auth::id();
        }
        return $turn;
    }

    public function battleshipMultiplayerCheckOpponent () {
        $opponent_id = $_GET['id'];
        $game_number = $_GET['game_number'];
        $ship_names = json_decode($_GET['ship_names']);
        $query_prefix = 'bs_'.$game_number.'_'.$opponent_id;
        if (Redis::command('get', [$query_prefix.'_state']) === 'formation') {
            return 'wait';
        } else {
            $opponent_ship_positions = [];
            foreach ($ship_names as $ship_name) {
                $opponent_ship_positions[$ship_name] = json_decode(Redis::command('get', [$query_prefix.'_'.$ship_name]));
            }
            $turn = Redis::command('get', ['bs_'.$game_number.'_turn']) == Auth::id();
            return json_encode([$opponent_ship_positions, $turn]);
        }
    }


    public function battleshipMultiplayerMoveMade () {
        $cell = $_GET['cell'];
        $turn = $_GET['turn'];
        $game_number = $_GET['game_number'];
        $id = $_GET['id'];
        $total_hit = $_GET['total_hit'];
        $prefix = 'bs_'.$game_number;
        Redis::command('set', [$prefix.'_turn', $turn]);
        Redis::command('set', [$prefix.'_'.$id.'_last_move', $cell]);
        Redis::command('set', [$prefix.'_'.$id.'_total_hit', $total_hit]);

    }

    public function battleshipMultiplayerUpdate () {
        $game_number = $_GET['game_number'];
        $prefix = 'bs_'.$game_number;
        $opponent_id = $_GET['opponent_id'];
        $redis_last_move = Redis::command('get', [$prefix . '_' . $opponent_id . '_last_move']);
        $opponent_total_hit = Redis::command('get', [$prefix . '_' . $opponent_id . '_total_hit']);
        if ($_GET['last_move'] != '') {
            $last_move = $_GET['last_move'];
            if ($redis_last_move != $last_move) {
                return json_encode([Redis::command('get', [$prefix.'_turn']), $redis_last_move, $opponent_total_hit]);
            } else {
                return 'wait';
            }
        } elseif ($redis_last_move) {
            return json_encode([Redis::command('get', [$prefix.'_turn']), $redis_last_move, $opponent_total_hit]);
        } else {
            return 'wait';
        }
    }

    public function battleshipMultiplayerLeave () {
        $id = $_GET['id'];
        $prefix = 'bs_'.$_GET['game_number'].'_'.$id;
        $ship_names = json_decode($_GET['ship_names']);
        Redis::command('del', ['bs_'.$id, 'bs_'.$_GET['game_number'].'_turn', $prefix.'_state', $prefix.'_name', $prefix.'_last_move', $prefix.'_total_hit']);
        foreach ($ship_names as $ship_name) {
            Redis::command('del', [$prefix.'_'.$ship_name]);
        }
    }

    public function battleshipMultiplayerRecord () {
        var_dump($_GET);
        if ($_GET['result'] === 'win') {
            $user = User::find($_GET['id']);
            $user->bs_mult_wins += 1;
            $user->bs_mult_total += 1;
            $user->save();
        } elseif ($_GET['result'] === 'lose') {
            $user = User::find($_GET['id']);
            $user->bs_mult_losses += 1;
            $user->bs_mult_total += 1;
            $user->save();
        }
    }
}
