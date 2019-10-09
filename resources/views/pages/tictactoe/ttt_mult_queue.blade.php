@extends('layouts.app')
@section('content')
    <div class="text-center my-4">
        <h4>Waiting for opponents...</h4>
    </div>
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
@endsection('content')
<script src="js/ttt_mult_queue.js"></script>
