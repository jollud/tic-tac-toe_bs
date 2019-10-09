<html lang="en"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Jekyll v3.8.5">
    <title>{{ config('app.name') }}</title>

    <!-- Bootstrap core CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link href="css/stylesheet.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

    <style>
        .bd-placeholder-img {
            font-size: 1.125rem;
            text-anchor: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        @media (min-width: 768px) {
            .bd-placeholder-img-lg {
                font-size: 3.5rem;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="col d-flex justify-content-end align-items-right">
        @if (Auth::guest())
            <a class="btn btn-light" href="{{ route('login') }}">Log in</a>
            <a class="btn btn-light" href="{{ route('register') }}">Register</a>
        @else
            <a class="btn btn-light" href="{{ route('home') }}" data-name="{{ Auth::user()->name }}" id="player" data-userid="{{ Auth::user()->id }}">Hello, {{Auth::user()->name}}</a>
            <a class="btn btn-light" href="{{ route('logout') }}">Logout</a>
        @endif

    </div>

    <div class="nav-scroller py-1 mb-2">
        <nav class="nav d-flex justify-content-center">
            <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" data-toggle="dropdown"><h1>Tic-tac-toe</h1></button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="ttt_single">Single player</a>
                    <a class="dropdown-item" href="ttt_mult_queue">Multiplayer</a>
                    <a class="dropdown-item" href="ttt_sdm">Single device multiplayer</a>
                </div>
            </div>
            <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" data-toggle="dropdown"><h1>Battleship</h1></button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="bs_single">Single player</a>
                    <a class="dropdown-item" href="bs_mult_queue">Multiplayer</a>
                </div>
            </div>
        </nav>
    </div>
    <main class="py-4">
        @yield('content')
    </main>

</body>
</html>
