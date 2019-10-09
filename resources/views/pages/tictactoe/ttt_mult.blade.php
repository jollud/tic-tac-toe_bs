@extends('layouts.app')
@section('content')
    <div class="container">
        <div style="height: 6em; margin-left: 20%; margin-right: 20%">
            <div id="opponent" style="float: right;">
            </div>
            <div id="self" style="float: left;">
            </div>
            <div id="your_move_div">Your move!</div>
            <div id="opponent_move_div"></div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-8 justify-content-center" style="position: relative">
                <div id="testdiv">
                </div>
                <table class="table" id="ttt" style="z-index: 10">
                    <tbody>
                    <tr>
                        <td data-cell="11" data-clicked="false">
                            <svg class="cross" id="cross11" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle11"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-cell="12" data-clicked="false">
                            <svg class="cross" id="cross12" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle12"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-cell="13" data-clicked="false">
                            <svg class="cross" id="cross13" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle13"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                    </tr>
                    <tr>
                        <td data-cell="21" data-clicked="false">
                            <svg class="cross" id="cross21" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle21"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-cell="22" data-clicked="false">
                            <svg class="cross" id="cross22" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle22"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-cell="23" data-clicked="false">
                            <svg class="cross" id="cross23" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle23"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                    </tr>
                    <tr>
                        <td data-cell="31" data-clicked="false">
                            <svg class="cross" id="cross31" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle31"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-cell="32" data-clicked="false">
                            <svg class="cross" id="cross32" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle32"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-cell="33" data-clicked="false">
                            <svg class="cross" id="cross33" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle33"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection
<script src="js/ttt_mult.js"></script>
