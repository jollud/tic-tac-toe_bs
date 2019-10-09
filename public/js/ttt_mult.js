document.addEventListener('DOMContentLoaded', function () {

    let game_number;
    let turn;
    let side;
    let opponent_name;
    let opponent_id;
    let player1;

    class Player {
        name;
        id;
        side;
        turn;
        opponent_id;
        opponent_name;
        opponent_side;
        game_number;
        marked_fields = [];
        opponent_fields = [];
        moves_made = 0;
        state = 'play';
        win_combo;

        constructor (name, id, side, turn, opponent_id, opponent_name, game_number) {
            this.name = name;
            this.id = id;
            this.side = side;
            this.turn = turn === id;
            this.opponent_name = opponent_name;
            this.opponent_id = opponent_id;
            this.opponent_side = side === 'cross' ? 'circle' : 'cross';
            this.game_number = game_number;
        }

        checkMe (combo) {
            let inclusions = combo.filter(x => this.marked_fields.includes(x));
            if (inclusions.length === 3) {
                this.win_combo = inclusions;
                return true;
            }
        }

        checkOpponent (combo) {
            let inclusions = combo.filter(x => this.opponent_fields.includes(x));
            if (inclusions.length === 3) {
                this.win_combo = inclusions;
                return true;
            }
        }

        record () {
            let xhttp = new XMLHttpRequest();
            xhttp.open("GET", "ttt_mult/record?result="+this.state+"&id="+this.id, true);
            xhttp.send();
        }
    }

    let name = document.getElementById('player').getAttribute('data-name');

    let userid = document.getElementById('player').getAttribute('data-userid');

    let fields_left = ['11', '12', '13', '21', '22', '23', '31', '32', '33'];

    let winning_combinations = [
        ['11', '12', '13'],
        ['21', '22', '23'],
        ['31', '32', '33'],
        ['11', '21', '31'],
        ['12', '22', '32'],
        ['13', '23', '33'],
        ['11', '22', '33'],
        ['31', '22', '13']
    ];

    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'ttt_mult/game_data', true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let game_data = JSON.parse(this.responseText);
            game_number = game_data['game_number'];
            turn = game_data['turn'];
            side = game_data['side'];
            opponent_name = game_data['opponent_name'];
            opponent_id = game_data['opponent_id'];
            player1 = new Player(name, userid, side, turn, opponent_id, opponent_name, game_number);
            console.log(game_data);

            if (game_data['my_fields'] != undefined) {
                player1.marked_fields = game_data['my_fields'];
                player1.moves_made = game_data['my_fields'].length;
                for (let i = 0; i < game_data['my_fields'].length; i++) {
                    document.getElementById(player1.side + game_data['my_fields'][i]).style.display = 'initial';
                    document.getElementById(player1.side + game_data['my_fields'][i]).style.opacity = '1';
                    document.getElementById(player1.side + game_data['my_fields'][i]).parentElement.setAttribute('data-clicked', 'true');
                }
            }
            if (game_data['opponent_fields'] != undefined) {
                player1.opponent_fields = game_data['my_fields'];
                for (let i = 0; i < game_data['opponent_fields'].length; i++) {
                    document.getElementById(player1.opponent_side + game_data['opponent_fields'][i]).style.display = 'initial';
                    document.getElementById(player1.opponent_side + game_data['opponent_fields'][i]).style.opacity = '1';
                    document.getElementById(player1.opponent_side + game_data['opponent_fields'][i]).parentElement.setAttribute('data-clicked', 'true');
                }
            }

            document.getElementById('self').innerHTML = '<p class="player_name">' + player1.name + ': </p>' +
                '<p style="text-align: center">' + player1.side.charAt(0).toUpperCase() + player1.side.slice(1) + '</p>';
            document.getElementById('opponent').innerHTML = '<p class="player_name">' + player1.opponent_name + ': </p>' +
                '<p style="text-align: center">' + player1.opponent_side.charAt(0).toUpperCase() + player1.opponent_side.slice(1) + '</p>';

    function check (cells) {
        if (player1.moves_made >= 2) {
            console.log('check');
            for (let x = 0; x < winning_combinations.length; x++) {
                if (player1.checkMe(winning_combinations[x])) {
                    player1.state = 'win';
                    for (let i = 0; i < cells.length; i++) {
                        for (let num = 0; num < player1.win_combo.length; num++){
                            if (cells[i].getAttribute('data-cell') === player1.win_combo[num]) {
                                if (player1.side === 'cross') {
                                    cells[i].style.backgroundColor = '#212529';
                                } else {
                                    cells[i].style.backgroundColor = '#e3342f';
                                }
                            }
                        }
                    }
                    document.getElementById('testdiv').innerHTML = '<h1>'+ player1.name +' wins!</h1><a class="btn btn-light" id = "reset" href="ttt_mult_queue">Play again?</a>'
                    document.getElementById('testdiv').style.display = 'inline-block';
                    document.getElementById('testdiv').classList.add('fadein');
                    document.getElementById('ttt').classList.add('fadeout');
                } else if (player1.checkOpponent(winning_combinations[x])) {
                    player1.state = 'lose';
                    for (let i = 0; i < cells.length; i++) {
                        for (let num = 0; num < player1.win_combo.length; num++){
                            if (cells[i].getAttribute('data-cell') === player1.win_combo[num]) {
                                if (player1.side !== 'cross') {
                                    cells[i].style.backgroundColor = '#212529';
                                } else {
                                    cells[i].style.backgroundColor = '#e3342f';
                                }
                            }
                        }
                    }
                    document.getElementById('testdiv').innerHTML = '<h1>'+ player1.opponent_name +' wins!</h1><a class="btn btn-light" id = "reset" href="ttt_mult_queue">Play again?</a>';
                    document.getElementById('testdiv').style.display = 'inline-block';
                    document.getElementById('testdiv').classList.add('fadein');
                    document.getElementById('ttt').classList.add('fadeout');

                }
            }
            if ((player1.marked_fields.length + player1.opponent_fields.length) >= 9 && player1.state === 'play') {
                player1.state = 'draw';
                document.getElementById('testdiv').innerHTML = '<h1>Draw!</h1><a class="btn btn-light" id = "reset" href="ttt_mult_queue">Play again?</a>';
                document.getElementById('testdiv').style.display = 'inline-block';
                document.getElementById('testdiv').classList.add('fadein');
                document.getElementById('ttt').classList.add('fadeout');
            }
        }
        if (player1.state !== 'play') {
            document.getElementById('your_move_div').style.display = 'none';
            document.getElementById('opponent_move_div').style.display = 'none';
            player1.record();
        }
    }

    function listenerFunction (cells, i) {
        if (cells[i].getAttribute('data-clicked') === 'false') {
            if (player1.turn) {
                document.getElementById('opponent_move_div').style.display = 'block';
                document.getElementById('opponent_move_div').innerText = player1.opponent_name + '\'s move!';
                document.getElementById('your_move_div').style.display = 'none';
                let clickedCell = cells[i].getAttribute('data-cell').toString();
                let id = player1.side + clickedCell;
                player1.marked_fields.push(clickedCell);

                document.getElementById(id).style.display = 'initial';
                document.getElementById(id).style.opacity = '1';

                cells[i].setAttribute('data-clicked', 'true');

                fields_left = fields_left.filter(function (value) {
                    return value != clickedCell;
                });

                player1.turn = !player1.turn;

                let xhttp = new XMLHttpRequest();
                xhttp.open('GET', 'ttt_mult/move_completed?game_number='+player1.game_number+'&turn='+player1.opponent_id+'&field='+clickedCell+'&side='+player1.side, true);
                xhttp.send();

                player1.moves_made += 1;

                check(cells);

                if (player1.state !== 'play') {
                    for (let i = 0; i < cells.length; i++) {
                        cells[i].setAttribute('data-clicked', 'true');
                    }
                }

                let timeint = setInterval(function () {
                    xhttp.open('GET', 'ttt_mult/check_opponent?game_number=' + player1.game_number + '&id=' + player1.id, true);
                    xhttp.send();
                    xhttp.onreadystatechange = function () {
                        if (this.readyState === 4 && this.status === 200) {
                            if (this.responseText != 'wait') {
                                document.getElementById('your_move_div').style.display = 'block';
                                document.getElementById('opponent_move_div').style.display = 'none';
                                let game_update = JSON.parse(this.responseText);
                                let new_opponent_fields = game_update['opponent'];

                                if (player1.opponent_fields.length == 0) {
                                    document.getElementById(player1.opponent_side + game_update['opponent'].join('')).style.display = 'initial';
                                    document.getElementById(player1.opponent_side + game_update['opponent'].join('')).style.opacity = '1';
                                    document.getElementById(player1.opponent_side + game_update['opponent'].join('')).parentElement.setAttribute('data-clicked', 'true');
                                    player1.opponent_fields = new_opponent_fields;
                                } else {
                                    let difference = new_opponent_fields.filter(field => !player1.opponent_fields.includes(field));
                                    document.getElementById(player1.opponent_side + difference.join('')).style.display = 'initial';
                                    document.getElementById(player1.opponent_side + difference.join('')).style.opacity = '1';
                                    document.getElementById(player1.opponent_side + difference.join('')).parentElement.setAttribute('data-clicked', 'true');
                                    player1.opponent_fields = new_opponent_fields;
                                }

                                check(cells);
                                player1.turn = !player1.turn;
                                clearInterval(timeint);
                            }
                        }
                    }
                }, 2000);
            }
        }

    }
    function play () {

        let cells = document.getElementsByTagName('td');
        if (!player1.turn) {
            document.getElementById('opponent_move_div').style.display = 'block';
            document.getElementById('opponent_move_div').innerText = player1.opponent_name + '\'s move!';
            document.getElementById('your_move_div').style.display = 'none';
            let xhttp = new XMLHttpRequest();
            let timeint = setInterval(function () {
                xhttp.open('GET', 'ttt_mult/check_opponent?game_number=' + player1.game_number + '&id=' + player1.id, true);
                xhttp.send();
                xhttp.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        if (this.responseText != 'wait') {
                            document.getElementById('your_move_div').style.display = 'block';
                            document.getElementById('opponent_move_div').style.display = 'none';

                            let game_update = JSON.parse(this.responseText);
                            let new_opponent_fields = game_update['opponent'];
                            if (player1.opponent_fields.length == 0) {
                                document.getElementById(player1.opponent_side + game_update['opponent'].join('')).style.display = 'initial';
                                document.getElementById(player1.opponent_side + game_update['opponent'].join('')).style.opacity = '1';
                                document.getElementById(player1.opponent_side + game_update['opponent'].join('')).parentElement.setAttribute('data-clicked', 'true');
                                player1.opponent_fields = new_opponent_fields;
                            } else {
                                let difference = new_opponent_fields.filter(field => !player1.opponent_fields.includes(field));
                                document.getElementById(player1.opponent_side + difference.join('')).style.display = 'initial';
                                document.getElementById(player1.opponent_side + difference.join('')).style.opacity = '1';
                                document.getElementById(player1.opponent_side + difference.join('')).parentElement.setAttribute('data-clicked', 'true');
                                player1.opponent_fields = new_opponent_fields;

                            }
                            check(cells);
                            player1.turn = !player1.turn;
                            clearInterval(timeint);
                        }
                    }
                }
            }, 2000);
        } else {
            document.getElementById('your_move_div').style.display = 'block';
            document.getElementById('opponent_move_div').style.display = 'none';
            document.getElementById('opponent_move_div').innerText = player1.opponent_name + '\'s move!';
        }

        for (let i = 0; i < cells.length; i++) {

            cells[i].addEventListener('click', function () {
                listenerFunction(cells, i);
            });
        }
        if (player1.state === 'win') {
            document.getElementById('testdiv').style.display = 'initiate';
        }
    }

    play();
        }
    }
});
