@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 justify-content-center" style="position: relative">
                <div id="testdiv">
                </div>
                <table class="table" id="ttt" style="z-index: 10">
                    <tbody>
                    <tr>
                        <td data-col="1" data-row="1" data-clicked="false">
                            <svg class="cross" id="cross11" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle11"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-col="2" data-row="1" data-clicked="false">
                            <svg class="cross" id="cross12" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle12"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-col="3" data-row="1" data-clicked="false">
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
                        <td data-col="1" data-row="2" data-clicked="false">
                            <svg class="cross" id="cross21" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle21"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-col="2" data-row="2" data-clicked="false">
                            <svg class="cross" id="cross22" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle22"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-col="3" data-row="2" data-clicked="false">
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
                        <td data-col="1" data-row="3" data-clicked="false">
                            <svg class="cross" id="cross31" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle31"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-col="2" data-row="3" data-clicked="false">
                            <svg class="cross" id="cross32" viewBox="0 0 100 100">
                                <line x1="0" y1="0" x2="100" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                                <line x1="100" y1="0" x2="0" y2="100" style="stroke: #e3342f; stroke-width: 4px"/>
                            </svg>
                            <svg class="circle" id="circle32"viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" style="stroke: #212529; stroke-width: 4px; fill: none"/>
                            </svg>
                        </td>
                        <td data-col="3" data-row="3" data-clicked="false">
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
<script src="js/ttt_single.js"></script>
