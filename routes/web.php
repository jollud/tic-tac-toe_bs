<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'PagesController@index');

Route::get('/ttt_single', 'SingleTictactoeController@tictactoeSingle');

Route::get('/ttt_single/record', 'SingleTictactoeController@tictactoeSingleRecord');

Route::get('/ttt_mult_queue', 'MultiplayerTictactoeController@tictactoeMultiplayerQueue');

Route::get('/ttt_mult_queue/check', 'MultiplayerTictactoeController@tictactoeMultiplayerQueueCheck');

Route::get('/ttt_mult_queue/leave', 'MultiplayerTictactoeController@tictactoeMultiplayerQueueLeave');

Route::get('/ttt_mult', 'MultiplayerTictactoeController@tictactoeMultiplayer');

Route::get('/ttt_mult/game_data', 'MultiplayerTictactoeController@tictactoeMultiplayerGameData');

Route::get('/ttt_mult/move_completed', 'MultiplayerTictactoeController@tictactoeMultiplayerMoveCompleted');

Route::get('/ttt_mult/check_opponent', 'MultiplayerTictactoeController@tictactoeMultiplayerCheckOpponent');

Route::get('/ttt_mult/record', 'MultiplayerTictactoeController@tictactoeMultiplayerRecord');

Route::get('/ttt_sdm', 'PagesController@tictactoeSingleDeviceMultiplayer');

Route::get('/bs_mult', 'MultiplayerBattleshipController@battleshipMultiplayer');

Route::get('/bs_mult_queue', 'MultiplayerBattleshipController@battleshipMultiplayerQueue');

Route::get('/bs_mult_queue/check', 'MultiplayerBattleshipController@battleshipMultiplayerQueueCheck');

Route::get('/bs_mult_queue/leave', 'MultiplayerBattleshipController@battleshipMultiplayerQueueLeave');

Route::get('/bs_mult/game_data', 'MultiplayerBattleshipController@battleshipMultiplayerGameData');

Route::get('/bs_mult/submit', 'MultiplayerBattleshipController@battleshipMultiplayerSubmit');

Route::get('/bs_mult/check_opponent', 'MultiplayerBattleshipController@battleshipMultiplayerCheckOpponent');

Route::get('/bs_mult/move_made', 'MultiplayerBattleshipController@battleshipMultiplayerMoveMade');

Route::get('/bs_mult/update', 'MultiplayerBattleshipController@battleshipMultiplayerUpdate');

Route::get('/bs_mult/leave', 'MultiplayerBattleshipController@battleshipMultiplayerLeave');

Route::get('/bs_mult/record', 'MultiplayerBattleshipController@battleshipMultiplayerRecord');

Route::get('/logout', 'PagesController@logout');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
