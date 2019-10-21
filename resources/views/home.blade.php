@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <table class="table table-hover">
                <thead><h3 style="text-align: center">Tic-tac-toe statistics</h3></thead>
                <tbody>
                    <tr>
                        <td><h4>Multiplayer matches played</h4></td>
                        <td>{{ Auth::user()->ttt_mult_wins + Auth::user()->ttt_mult_losses + Auth::user()->ttt_mult_draws }}</td>
                    </tr>
                    <tr>
                        <td>Multiplayer wins</td>
                        <td>{{ Auth::user()->ttt_mult_wins }}</td>
                    </tr>
                    <tr>
                        <td>Multiplayer losses</td>
                        <td>{{ Auth::user()->ttt_mult_losses }}</td>
                    </tr>
                    <tr>
                        <td>Multiplayer draws</td>
                        <td>{{ Auth::user()->ttt_mult_draws }}</td>
                    </tr>
                    <tr>
                        <td><h4>Single matches played</h4></td>
                        <td>{{ Auth::user()->ttt_single_wins + Auth::user()->ttt_single_losses + Auth::user()->ttt_single_draws }}</td>
                    </tr>
                    <tr>
                        <td>Single wins</td>
                        <td>{{ Auth::user()->ttt_single_wins }}</td>
                    </tr>
                    <tr>
                        <td>Single losses</td>
                        <td>{{ Auth::user()->ttt_single_losses }}</td>
                    </tr>
                    <tr>
                        <td>Single draws</td>
                        <td>{{ Auth::user()->ttt_single_draws }}</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-hover">
                <thead><h3 style="text-align: center">Battleship statistics</h3></thead>
                <tbody>
                <tr>
                    <td><h4>Multiplayer matches played</h4></td>
                    <td>{{ Auth::user()->bs_mult_wins + Auth::user()->bs_mult_losses }}</td>
                </tr>
                <tr>
                    <td>Multiplayer wins</td>
                    <td>{{ Auth::user()->bs_mult_wins }}</td>
                </tr>
                <tr>
                    <td>Multiplayer losses</td>
                    <td>{{ Auth::user()->bs_mult_losses }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
