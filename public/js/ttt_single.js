document.addEventListener('DOMContentLoaded', function () {
var choice = prompt('Please, choose your side: X or O?', 'X').toLowerCase();
if (choice.toLowerCase() != 'x' && choice.toLowerCase() != 'o') {
    choice = 'x';
}


var namecheck_element = document.getElementById('player');
if (namecheck_element) {
    var logged = true;
    var name = namecheck_element.getAttribute('data-name');
    var userid = namecheck_element.getAttribute('data-userid');
} else {
    var logged = false;
    var name = 'Player 1';
    var userid = false;
}

var fields_left = ['11', '12', '13', '21', '22', '23', '31', '32', '33'];

var winning_combinations = [
    ['11', '12', '13'],
    ['21', '22', '23'],
    ['31', '32', '33'],
    ['11', '21', '31'],
    ['12', '22', '32'],
    ['13', '23', '33'],
    ['11', '22', '33'],
    ['31', '22', '13']
];

class Player {
    logged;
    name;
    id;
    side;
    turn;
    marked_fields = [];
    moves_made = 0;
    state = 'play';
    win_combo;
    constructor (side, name, logged, id) {
        this.side = side === 'x' ? 'cross' : 'circle';
        this.name = name;
        this.turn = side === 'x';
        this.logged = logged;
        this.id = id;
    }

    checkWinner (combo) {
        let inclusions = combo.filter(x => this.marked_fields.includes(x));
        if (inclusions.length === 3) {
            this.win_combo = inclusions;
            return true;
        }
    }

    record () {
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", "ttt_single/record?result="+this.state+"&id="+this.id, true);
        xhttp.send();
    }
}

class AI extends Player {
    constructor (side) {
        super(side === 'x' ? 'o' : 'x', 'Computer', false, false);
    }

    makeMove (player1, computer) {
        if (computer.turn) {
            let rand = Math.random();
            let cellsLeft = fields_left.length;
            let randIndex = Math.floor(rand * cellsLeft);
            document.getElementById(computer.side + fields_left[randIndex]).style.display = 'initial';

            computer.last_marked_cell = document.getElementById(computer.side + fields_left[randIndex]).parentElement;

            computer.last_marked_cell.setAttribute('data-clicked', 'true');

            computer.marked_fields.push(fields_left[randIndex]);

            fields_left = fields_left.filter(function (value) {
                return value != fields_left[randIndex];
            });

            player1.turn = !player1.turn;
            computer.turn = !computer.turn;

            computer.moves_made += 1;
        }

    }
}

let computer = new AI(choice);
let player1 = new Player(choice, name, logged, userid);

/*
function reset () {
    choice = prompt('Please, choose your side: X or O?', 'X').toLowerCase();
    if (choice.toLowerCase() != 'x' && choice.toLowerCase() != 'o') {
        choice = 'x';
    }
    computer = new AI(choice);
    player1 = new Player(choice, name);

    document.getElementById('testdiv').classList.remove('fadein');
    document.getElementById('ttt').classList.remove('fadeout');

    let svgs = document.getElementsByTagName("svg");
    for (let i = 0; i < svgs.length; i++) {
        svgs[i].style.display = 'none';
        svgs[i].style.opacity = '0';
    }

    let cells = document.getElementsByTagName('td');
    for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = 'none';
        cells[i].setAttribute('data-clicked', 'false');
    }


    play();
}
 */

function check (cells) {
    if (player1.moves_made >= 3 || computer.moves_made >= 3) {
        for (let x = 0; x < winning_combinations.length; x++) {
            if (player1.checkWinner(winning_combinations[x])) {
                player1.state = 'win';
                computer.state = 'lose';
                for (let i = 0; i < cells.length; i++) {
                    for (let num = 0; num < player1.win_combo.length; num++){
                        if (cells[i].getAttribute('data-col') === player1.win_combo[num].charAt(1) && cells[i].getAttribute('data-row') === player1.win_combo[num].charAt(0)) {
                            if (player1.side === 'cross') {
                                cells[i].style.backgroundColor = '#212529';
                            } else {
                                cells[i].style.backgroundColor = '#e3342f';
                            }
                        }
                    }
                }
                document.getElementById('testdiv').innerHTML = '<h1>'+ player1.name +' wins!</h1><a class="btn btn-light" id = "reset" href="ttt_single">Play again?</a>'
                document.getElementById('testdiv').style.display = 'inline-block';
                document.getElementById('testdiv').classList.add('fadein');
                document.getElementById('ttt').classList.add('fadeout');
            } else if (computer.checkWinner(winning_combinations[x])) {
                player1.state = 'lose';
                computer.state = 'win';
                for (let i = 0; i < cells.length; i++) {
                    for (let num = 0; num < computer.win_combo.length; num++){
                        if (cells[i].getAttribute('data-col') === computer.win_combo[num].charAt(1) && cells[i].getAttribute('data-row') === computer.win_combo[num].charAt(0)) {
                            if (computer.side === 'cross') {
                                cells[i].style.backgroundColor = '#212529';
                            } else {
                                cells[i].style.backgroundColor = '#e3342f';
                            }
                        }
                    }
                }
                document.getElementById('testdiv').innerHTML = '<h1>'+ computer.name +' wins!</h1><a class="btn btn-light" id = "reset" href="ttt_single">Play again?</a>';
                document.getElementById('testdiv').style.display = 'inline-block';
                document.getElementById('testdiv').classList.add('fadein');
                document.getElementById('ttt').classList.add('fadeout');

            }
        }
        if ((player1.moves_made + computer.moves_made) >= 9 && player1.state === 'play' && computer.state === 'play') {
            console.log(123);
            player1.state = 'draw';
            computer.state = 'draw';
            document.getElementById('testdiv').innerHTML = '<h1>Draw!</h1><a class="btn btn-light" id = "reset" href="ttt_single">Play again?</a>';
            document.getElementById('testdiv').style.display = 'inline-block';
            document.getElementById('testdiv').classList.add('fadein');
            document.getElementById('ttt').classList.add('fadeout');
        }
    }
    if (player1.state !== 'play') {
        player1.record();
    }
}

function listenerFunction (cells, i) {
    if (cells[i].getAttribute('data-clicked') === 'false') {
        if (player1.turn) {
            let clickedCell = cells[i].getAttribute('data-row').toString() + cells[i].getAttribute('data-col').toString();
            let id = player1.side + clickedCell;
            player1.marked_fields.push(clickedCell);

            document.getElementById(id).style.display = 'initial';
            document.getElementById(id).style.opacity = '1';

            cells[i].setAttribute('data-clicked', 'true');

            fields_left = fields_left.filter(function (value) {
                return value != clickedCell;
            });

            player1.turn = !player1.turn;
            computer.turn = !computer.turn;

            player1.moves_made += 1;

            check(cells);

            if (player1.state !== 'play') {
                for (let i = 0; i < cells.length; i++) {
                    cells[i].setAttribute('data-clicked', 'true');
                }
            } else {
                computer.makeMove(player1, computer);

                check(cells);

                if (computer.state !== 'play') {
                    for (let i = 0; i < cells.length; i++) {
                        cells[i].setAttribute('data-clicked', 'true');
                    }
                }
            }
        }
    }
}

function play () {
    let cells = document.getElementsByTagName('td');

    if (computer.turn) {
        computer.makeMove(player1, computer);
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
});


