<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;

class MultiplayerTictactoeController extends Controller
{
    public function tictactoeMultiplayer () {
        if (!Auth::check()){
            return redirect('/login');
        }
        return view('pages.tictactoe.ttt_mult');
    }

    public function tictactoeMultiplayerGameData () {
        $game_data = [];
        $game_data['game_number'] = Redis::command('get', [session()->get('userid')]);
        $game_data['side'] = Redis::command('get', [$game_data['game_number'].'_'.session()->get('userid')]);
        $game_data['turn'] = Redis::command('get', [$game_data['game_number'].'_turn']);
        $players_ids = explode('_', $game_data['game_number']);
        $opponent_id = array_filter($players_ids, function ($v) {
            return $v != session()->get('userid');
        });
        $opponent_id = implode('', $opponent_id);
        $game_data['opponent_name'] = Redis::command('get', [$game_data['game_number'].'_'.$opponent_id.'_name']);
        $game_data['opponent_id'] = $opponent_id;

        $fields_left ['11'] = Redis::command('get', [$game_data['game_number'].'_field11']);
        $fields_left ['12'] = Redis::command('get', [$game_data['game_number'].'_field12']);
        $fields_left ['13'] = Redis::command('get', [$game_data['game_number'].'_field13']);
        $fields_left ['21'] = Redis::command('get', [$game_data['game_number'].'_field21']);
        $fields_left ['22'] = Redis::command('get', [$game_data['game_number'].'_field22']);
        $fields_left ['23'] = Redis::command('get', [$game_data['game_number'].'_field23']);
        $fields_left ['31'] = Redis::command('get', [$game_data['game_number'].'_field31']);
        $fields_left ['32'] = Redis::command('get', [$game_data['game_number'].'_field32']);
        $fields_left ['33'] = Redis::command('get', [$game_data['game_number'].'_field33']);

        if ($game_data['side'] == 'cross') {
            foreach ($fields_left as $cell => $mark) {
                $cell = strval($cell);
                if ($mark == 'cross') {
                    $game_data['my_fields'][] = $cell;
                } elseif ($mark == 'circle') {
                    $game_data['opponent_fields'][] = $cell;
                }
            }
        } else {
            foreach ($fields_left as $cell => $mark) {
                $cell = strval($cell);
                if ($mark == 'circle') {
                    $game_data['my_fields'][] = $cell;
                } elseif ($mark == 'cross') {
                    $game_data['opponent_fields'][] = $cell;
                }
            }
        }

        return json_encode($game_data);
    }

    public function tictactoeMultiplayerQueue () {
        if (!Auth::check()){
            return redirect('/login');
        }
        Redis::command('lrem', ['queue', '0', session()->get('userid')]);
        Redis::command('lpush', ['queue', session()->get('userid')]);
        Redis::command('set', [session()->get('userid'), 'not_playing']);
        if (Redis::command('llen', ['queue']) >= 2) {
            $players []['id'] = Redis::command('rpop', ['queue']);
            $players []['id'] = Redis::command('rpop', ['queue']);

            $players[0]['name'] = User::where('id', '=', $players[0])->pluck('name')[0];
            $players[1]['name'] = User::where('id', '=', $players[1])->pluck('name')[0];

            $game_number = $players[0]['id'].'_'.$players[1]['id'];
            Redis::command('set', [$players[0]['id'], $game_number]);
            Redis::command('set', [$players[1]['id'], $game_number]);
            Redis::command('set', [$game_number.'_'.$players[0]['id'].'_name', $players[0]['name']]);
            Redis::command('set', [$game_number.'_'.$players[1]['id'].'_name', $players[1]['name']]);

            $cross_player_index = array_rand($players);
            $cross = $players[$cross_player_index]['id'];
            $remaining_player = array_filter($players, function ($k, $v) use ($cross_player_index){
                return $k != $cross_player_index;
            }, ARRAY_FILTER_USE_BOTH);
            $circle = $remaining_player[0]['id'];

            Redis::command('set', [$game_number.'_'.$cross, 'cross']);
            Redis::command('set', [$game_number.'_'.$circle, 'circle']);
            Redis::command('set', [$game_number.'_turn', $cross]);
            Redis::command('set', [$game_number.'_field11', 'not_marked']);
            Redis::command('set', [$game_number.'_field12', 'not_marked']);
            Redis::command('set', [$game_number.'_field13', 'not_marked']);
            Redis::command('set', [$game_number.'_field21', 'not_marked']);
            Redis::command('set', [$game_number.'_field22', 'not_marked']);
            Redis::command('set', [$game_number.'_field23', 'not_marked']);
            Redis::command('set', [$game_number.'_field31', 'not_marked']);
            Redis::command('set', [$game_number.'_field32', 'not_marked']);
            Redis::command('set', [$game_number.'_field33', 'not_marked']);

            return redirect('/ttt_mult');
        } else {
            return view('pages.tictactoe.ttt_mult_queue');
        }
    }

    public function tictactoeMultiplayerQueueCheck () {
        if (Redis::command('llen', ['queue']) >= 2) {
            $players []['id'] = Redis::command('rpop', ['queue']);
            $players []['id'] = Redis::command('rpop', ['queue']);

            $players[0]['name'] = User::where('id', '=', $players[0])->pluck('name')[0];
            $players[1]['name'] = User::where('id', '=', $players[1])->pluck('name')[0];

            $game_number = $players[0]['id'].'_'.$players[1]['id'];
            Redis::command('set', [$players[0]['id'], $game_number]);
            Redis::command('set', [$players[1]['id'], $game_number]);
            Redis::command('set', [$game_number.'_'.$players[0]['id'].'_name', $players[0]['name']]);
            Redis::command('set', [$game_number.'_'.$players[1]['id'].'_name', $players[1]['name']]);

            $cross_player_index = array_rand($players);
            $cross = $players[$cross_player_index]['id'];
            $remaining_player = array_filter($players, function ($k, $v) use ($cross_player_index){
                return $k != $cross_player_index;
            }, ARRAY_FILTER_USE_BOTH);
            $circle = $remaining_player[0]['id'];

            Redis::command('set', [$game_number.'_'.$cross, 'cross']);
            Redis::command('set', [$game_number.'_'.$circle, 'circle']);
            Redis::command('set', [$game_number.'_turn', $cross]);
            Redis::command('set', [$game_number.'_field11', 'not_marked']);
            Redis::command('set', [$game_number.'_field12', 'not_marked']);
            Redis::command('set', [$game_number.'_field13', 'not_marked']);
            Redis::command('set', [$game_number.'_field21', 'not_marked']);
            Redis::command('set', [$game_number.'_field22', 'not_marked']);
            Redis::command('set', [$game_number.'_field23', 'not_marked']);
            Redis::command('set', [$game_number.'_field31', 'not_marked']);
            Redis::command('set', [$game_number.'_field32', 'not_marked']);
            Redis::command('set', [$game_number.'_field33', 'not_marked']);

            return 'success';
        } elseif (Redis::command('get', [session()->get('userid')]) != 'not_playing') {
            return 'success';
        }
    }

    public function tictactoeMultiplayerQueueLeave () {
        Redis::command('lrem', ['queue', '0', session()->get('userid')]);
    }

    public function tictactoeMultiplayerMoveCompleted () {
        Redis::command('set', [$_GET['game_number'].'_'.'field'.$_GET['field'], $_GET['side']]);
        Redis::command('set', [$_GET['game_number'].'_turn', $_GET['turn']]);
    }

    public function tictactoeMultiplayerCheckOpponent () {
        if ($_GET['id'] == Redis::command('get', [$_GET['game_number'].'_turn'])) {
            $fields_left ['11'] = Redis::command('get', [$_GET['game_number'].'_field11']);
            $fields_left ['12'] = Redis::command('get', [$_GET['game_number'].'_field12']);
            $fields_left ['13'] = Redis::command('get', [$_GET['game_number'].'_field13']);
            $fields_left ['21'] = Redis::command('get', [$_GET['game_number'].'_field21']);
            $fields_left ['22'] = Redis::command('get', [$_GET['game_number'].'_field22']);
            $fields_left ['23'] = Redis::command('get', [$_GET['game_number'].'_field23']);
            $fields_left ['31'] = Redis::command('get', [$_GET['game_number'].'_field31']);
            $fields_left ['32'] = Redis::command('get', [$_GET['game_number'].'_field32']);
            $fields_left ['33'] = Redis::command('get', [$_GET['game_number'].'_field33']);

            if (Redis::command('get', [$_GET['game_number'].'_'.$_GET['id']]) === 'cross') {
                foreach ($fields_left as $cell => $mark) {
                    $cell = strval($cell);
                    if ($mark == 'cross') {
                        $marked_fields['my'][] = $cell;
                    } elseif ($mark == 'circle') {
                        $marked_fields['opponent'][] = $cell;
                    }
                }
            } else {
                foreach ($fields_left as $cell => $mark) {
                    $cell = strval($cell);
                    if ($mark == 'cross') {
                        $marked_fields['opponent'][] = $cell;
                    } elseif ($mark == 'circle') {
                        $marked_fields['my'][] = $cell;
                    }
                }
            }

            return json_encode($marked_fields);
        } else {
            return 'wait';
        }
    }

    public function tictactoeMultiplayerRecord () {

        if ($_GET['result'] === 'win') {
            $user = User::find($_GET['id']);
            $user->ttt_mult_wins += 1;
            $user->ttt_mult_total += 1;
            $user->save();
        } elseif ($_GET['result'] === 'lose') {
            $user = User::find($_GET['id']);
            $user->ttt_mult_losses += 1;
            $user->ttt_mult_total += 1;
            $user->save();
        } elseif ($_GET['result'] === 'draw') {
            $user = User::find($_GET['id']);
            $user->ttt_mult_draws += 1;
            $user->ttt_mult_total += 1;
            $user->save();
        }
    }
}
