@extends('layouts.app')
@section('content')
    <div style="height: 6em; margin-left: 20%; margin-right: 20%">
        <div id="opponent" style="float: right;">
        </div>
        <div id="self" style="float: left;">
        </div>
        <div id="your_move_div">Your move!</div>
        <div id="opponent_move_div"></div>
    </div>
    <div class="row justify-content-center">
        <div id="testdiv">
        </div>
        <div id="player_field">
        @for($y = 0; $y < 10; $y++)
            @for($x = 0; $x < 10; $x++)
                <div class="cell droppable" data-y={{$y}} data-x={{$x}} data-free="true" id={{$y.'_'.$x}}>

                </div>
            @endfor
        @endfor
            <div style="display: flex; align-items: center; justify-content: center; width: 100%; padding-top: 5px">
                <button class="btn btn-success btn-block" id="submit_setup"><span style="font-size: x-large">Submit</span></button>
            </div>
        </div>
        <div style="position: relative" id="opponent_field_container">
            <div id="opponent_field">
                @for($y = 0; $y < 10; $y++)
                    @for($x = 0; $x < 10; $x++)
                        <div class="opponent_cell clickable" data-y={{$y}} data-x={{$x}} data-free="true" id={{'o'.$y.'_'.$x}}>
                        </div>
                    @endfor
                @endfor
            </div>
            <div class="d-flex justify-content-center" id="spinner" style="position: absolute; left: 185px; top: 175px">
                <div class="spinner-border" style="width: 5rem; height: 5rem; opacity: unset" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>

    </div>
@endsection('content')
<script src="js/bs_mult.js"></script>
