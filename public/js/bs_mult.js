document.addEventListener('DOMContentLoaded', function () {

    window.onbeforeunload = function () {
        //Removes all Redis records related to this game when the player leaves the page.
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', 'bs_mult/leave?game_number=' + game_number + '&id=' + userid + '&ship_names=' + ship_names_JSON, true);
        xhttp.send();
    };

    //Defining main variables related to the game process.
    let name = document.getElementById('player').getAttribute('data-name');
    let userid = document.getElementById('player').getAttribute('data-userid');
    let game_number;
    let turn;
    let opponent_name;
    let opponent_id;
    let total_hit = 0;

    //Requesting all game information (i.e. game number, opponent's name and id, etc.)
    //in order to make further requests.
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'bs_mult/game_data', true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let game_data = JSON.parse(this.responseText);
            game_number = game_data['game_number'];
            opponent_name = game_data['opponent_name'];
            opponent_id = game_data['opponent_id'];
        }
    };

    //SVGs, which indicate marked cells.
    let injured = '<svg viewBox="0 0 38 39">' +
        '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #e3342f; stroke-width: 2px"/>' +
        '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #e3342f; stroke-width: 2px"/>' +
        '</svg>';

    let killed = '<svg viewBox="0 0 38 39">' +
        '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #212529; stroke-width: 2px"/>' +
        '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #212529; stroke-width: 2px"/>' +
        '</svg>';

    let miss = '<svg viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="30" fill="#6cb2eb"/>' +
        '</svg>';

    let enemy_miss = '<svg viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="30" fill="#e3342f"/>' +
        '</svg>';


    // Declaration of classes
    class Ship {
        orientation = 'vertical';
        current_html;
        vertical_html;
        horizontal_html;
        ship_id;
        deck_quantity;
        initial_cell_y;
        initial_cell_x;
        initial_cell;
        affected_cells = [];
        occupied_cells = [];
        injured_cells = [];
        vertical_restricted_cells = [];
        horizontal_restricted_cells = [];
        //Saves each ship instance as an array element in order to process their properties iteratively.
        static ship_objects_array = [];

        constructor (cell_id, ship_id) {
            this.initial_cell = cell_id;
            this.initial_cell_y = parseInt(cell_id.charAt(0));
            this.initial_cell_x = parseInt(cell_id.charAt(cell_id.length - 1));
            this.ship_id = ship_id;
            Ship.ship_objects_array.push(this);
        }

        updateInitialCell (cell_id) {
            this.initial_cell = cell_id;
            this.initial_cell_y = parseInt(cell_id.charAt(0));
            this.initial_cell_x = parseInt(cell_id.charAt(cell_id.length - 1));
        }

        getAffectedCells () {
            if (this.deck_quantity === 1) {
                this.affected_cells = [];
                this.affected_cells.push(this.initial_cell);
            } else {
                if (this.orientation === 'vertical') {
                    this.affected_cells = [];
                    for (let i = 0; i < this.deck_quantity; i++) {
                        this.affected_cells.push((this.initial_cell_y + i) + '_' + this.initial_cell_x);

                    }
                } else {
                    this.affected_cells = [];
                    for (let i = 0; i < this.deck_quantity; i++) {
                        this.affected_cells.push(this.initial_cell_y + '_' + (this.initial_cell_x + i));
                    }
                }
            }
        }

        insertShip () {
            document.getElementById(this.initial_cell).innerHTML = this.current_html;
            let element = document.getElementById(this.ship_id);
            //Making a ship draggable.
            element.ondragstart = function (event) {
                event.dataTransfer.setData('text/plain', event.target.id);
            };
            //Making a ship able to change orientation.
            element.ondblclick = function () {
                let ship_object = eval(this.id);
                console.log(ship_object.orientation);
                // Check whether reoriented ship interferes any restricted cells.
                if (ship_object.orientation === 'vertical' && !ship_object.horizontal_restricted_cells.includes(ship_object.initial_cell)) {
                    ship_object.orientation = 'horizontal';
                    ship_object.current_html = ship_object.horizontal_html;
                    ship_object.insertShip();
                    ship_object.getAffectedCells();
                    setOccupiedCells(Ship.ship_objects_array);
                } else if (ship_object.orientation === 'horizontal' && !ship_object.vertical_restricted_cells.includes(ship_object.initial_cell)){
                    ship_object.orientation = 'vertical';
                    ship_object.current_html = ship_object.vertical_html;
                    ship_object.insertShip();
                    ship_object.getAffectedCells();
                    setOccupiedCells(Ship.ship_objects_array);
                }
            };
        }

        setRestrictedCells () {
            this.vertical_restricted_cells = [];
            this.horizontal_restricted_cells = [];
            let y;
            let x;
            let cell;
            if (this.deck_quantity > 1) {
                for (let i = 0; i < 10; i++) {
                    for (let deck_counter = this.deck_quantity; deck_counter > 1; deck_counter--) {
                        this.vertical_restricted_cells.push((11 - deck_counter) + '_' + i);
                        this.horizontal_restricted_cells.push(i + '_' + (11 - deck_counter));
                    }
                }
            }
            for (let i = 0; i < this.occupied_cells.length; i++) {
                y = parseInt(this.occupied_cells[i].charAt(0));
                x = parseInt(this.occupied_cells[i].charAt(2));
                for (let cap_y = y, deck_counter = 0; deck_counter < this.deck_quantity; cap_y--, deck_counter++) {
                    if (cap_y >=0) {
                        cell = cap_y + '_' + x;
                        if (!this.vertical_restricted_cells.includes(cell)) {
                            this.vertical_restricted_cells.push(cell);
                        }
                    }
                }
                for (let cap_x = x, deck_counter = 0; deck_counter < this.deck_quantity; cap_x--, deck_counter++) {
                    if (cap_x >=0) {
                        cell = y + '_' + cap_x;
                        if (!this.horizontal_restricted_cells.includes(cell)) {
                            this.horizontal_restricted_cells.push(cell);
                        }
                    }
                }
            }
        }
    }

    class FourDecker extends Ship {
        constructor (cell_id, ship_id) {
            super (cell_id, ship_id);
            this.deck_quantity = 4;
            this.vertical_html = '<div class="ship four-decker-vert" draggable="true" id=' + this.ship_id + '>' +
                '<div class="ship_cell_vert" data-cell="0">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '<div class="ship_cell_vert" data-cell="1">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div><div class="ship_cell_vert" data-cell="2">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div><div class="ship_cell_vert" data-cell="3">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '</div>';
            this.horizontal_html = '<div class="ship four-decker-hor" draggable="true" id=' + this.ship_id + '>' +
                '<div class="ship_cell_hor" data-cell="0">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '<div class="ship_cell_hor" data-cell="1">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div><div class="ship_cell_hor" data-cell="2">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div><div class="ship_cell_hor" data-cell="3">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '</div>';
            this.current_html = this.vertical_html;
        }
    }

    class ThreeDecker extends Ship {
        constructor (cell_id, ship_id) {
            super (cell_id, ship_id);
            this.deck_quantity = 3;
            this.vertical_html = '<div class="ship three-decker-vert" draggable="true" id=' + this.ship_id + '>' +
                '<div class="ship_cell_vert" data-cell="0">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '<div class="ship_cell_vert" data-cell="1">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div><div class="ship_cell_vert" data-cell="2">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>';
            this.horizontal_html = '<div class="ship three-decker-hor" draggable="true" id=' + this.ship_id + '>' +
                '<div class="ship_cell_hor" data-cell="0">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '<div class="ship_cell_hor" data-cell="1">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div><div class="ship_cell_hor" data-cell="2">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>';
            this.current_html = this.vertical_html;
        }
    }

    class TwoDecker extends Ship {
        constructor (cell_id, ship_id) {
            super (cell_id, ship_id);
            this.deck_quantity = 2;
            this.vertical_html = '<div class="ship two-decker-vert" draggable="true" id=' + this.ship_id + '>' +
                '<div class="ship_cell_vert" data-cell="0">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '<div class="ship_cell_vert" data-cell="1">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>';
            this.horizontal_html = '<div class="ship two-decker-hor" draggable="true" id=' + this.ship_id + '>' +
                '<div class="ship_cell_hor" data-cell="0">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>' +
                '<div class="ship_cell_hor" data-cell="1">' +
                '<svg viewBox="0 0 39 38">' +
                '<line x1="0" y1="0" x2="39" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="39" y1="0" x2="0" y2="38" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>';
            this.current_html = this.vertical_html;
        }
    }

    class SingleDecker extends Ship {
        constructor (cell_id, ship_id) {
            super (cell_id, ship_id);
            this.deck_quantity = 1;
            this.vertical_html = '<div class="ship single-decker" draggable="true" id=' + this.ship_id + '>' +
                '<div class="ship_cell_vert" data-cell="0">' +
                '<svg viewBox="0 0 38 39">' +
                '<line x1="0" y1="0" x2="38" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '<line x1="38" y1="0" x2="0" y2="39" style="stroke: #0000cc; stroke-width: 2px"/>' +
                '</svg>' +
                '</div>';
            this.horizontal_html = this.vertical_html;
            this.current_html = this.vertical_html;
        }
    }

    //This function walks through all ship instances and makes a list of restricted cells for each ship specific.
    function setOccupiedCells (ship_array) {
        let occupied_cell;
        let occupied_cell_y;
        let occupied_cell_x;
        let left_cell;
        let right_cell;
        let top_cell;
        let bottom_cell;
        for (let i = 0; i < ship_array.length; i++) {
            ship_array[i].occupied_cells = [];
            for (let n = 0; n < ship_array.length; n++) {
                if (ship_array[n] != ship_array[i]) {
                    for (let cell = 0; cell < ship_array[n].affected_cells.length; cell++) {
                        occupied_cell = ship_array[n].affected_cells[cell];
                        occupied_cell_y = parseInt(occupied_cell.charAt(0));
                        occupied_cell_x = parseInt(occupied_cell.charAt(2));
                        right_cell = (occupied_cell_x < 9) ? occupied_cell.slice(0, 2) + (occupied_cell_x + 1) : false;
                        left_cell = (occupied_cell_x > 0) ? occupied_cell.slice(0, 2) + (occupied_cell_x - 1) : false;
                        top_cell = (occupied_cell_y > 0) ? (occupied_cell_y - 1) + occupied_cell.slice(1) : false;
                        bottom_cell = (occupied_cell_y < 9) ? (occupied_cell_y + 1) + occupied_cell.slice(1) : false;
                        !ship_array[i].occupied_cells.includes(right_cell) && right_cell ? ship_array[i].occupied_cells.push(right_cell) : null;
                        !ship_array[i].occupied_cells.includes(left_cell) && left_cell ? ship_array[i].occupied_cells.push(left_cell) : null;
                        !ship_array[i].occupied_cells.includes(top_cell) && top_cell ? ship_array[i].occupied_cells.push(top_cell) : null;
                        !ship_array[i].occupied_cells.includes(bottom_cell) && bottom_cell ? ship_array[i].occupied_cells.push(bottom_cell) : null;
                    }
                }
            }
        }
        for (let i = 0; i < ship_array.length; i++) {
            ship_array[i].setRestrictedCells();
        }
    }

    //Instancing specific objects aka ships.
    let four_decker = new FourDecker('0_0', 'four_decker');
    four_decker.getAffectedCells();
    four_decker.insertShip();

    let first_three_decker = new ThreeDecker('0_5', 'first_three_decker');
    first_three_decker.getAffectedCells();
    first_three_decker.insertShip();

    let second_three_decker = new ThreeDecker('7_1', 'second_three_decker');
    second_three_decker.getAffectedCells();
    second_three_decker.insertShip();

    let first_two_decker = new TwoDecker('2_3', 'first_two_decker');
    first_two_decker.getAffectedCells();
    first_two_decker.insertShip();

    let second_two_decker = new TwoDecker('7_5', 'second_two_decker');
    second_two_decker.getAffectedCells();
    second_two_decker.insertShip();

    let third_two_decker = new TwoDecker('4_9', 'third_two_decker');
    third_two_decker.getAffectedCells();
    third_two_decker.insertShip();

    let first_single_decker = new SingleDecker('5_5', 'first_single_decker');
    first_single_decker.getAffectedCells();
    first_single_decker.insertShip();

    let second_single_decker = new SingleDecker('8_9', 'second_single_decker');
    second_single_decker.getAffectedCells();
    second_single_decker.insertShip();

    let third_single_decker = new SingleDecker('5_2', 'third_single_decker');
    third_single_decker.getAffectedCells();
    third_single_decker.insertShip();

    let fourth_single_decker = new SingleDecker('3_8', 'fourth_single_decker');
    fourth_single_decker.getAffectedCells();
    fourth_single_decker.insertShip();

    setOccupiedCells(Ship.ship_objects_array); //Function is declared in Ship.js.

    //Implementation on ship configuration set-up capabilities.
    let cells = document.getElementsByClassName('droppable');
    for (let i = 0; i < cells.length; i++) {
        //Drag implementation.
        cells[i].ondragover = function (event) {
            event.preventDefault();
        };
        let cell_id;
        cells[i].ondrop = function (event) {
            let id = event.dataTransfer.getData('text');
            let ship_object = eval(id);

            //The following condition determines id of a cell, into which a ship should be inserted.
            if (event.target.id) {
                cell_id = event.target.id;
            } else {
                if (event.target.closest('div').className === 'ship_cell_vert') {
                    let data_cell = parseInt(event.target.closest('div').getAttribute('data-cell'));
                    let initial_cell_id = event.target.closest('.droppable').id;
                    cell_id = (parseInt(initial_cell_id.charAt(0)) + data_cell) + initial_cell_id.slice(1);
                } else if (event.target.closest('div').className === 'ship_cell_hor') {
                    let data_cell = parseInt(event.target.closest('div').getAttribute('data-cell'));
                    let initial_cell_id = event.target.closest('.droppable').id;
                    cell_id = initial_cell_id.slice(0,2) + (parseInt(initial_cell_id.charAt(2)) + data_cell);
                } else {
                    return
                }
            }

            document.getElementById(id).parentElement.innerHTML = '';

            //Check whether a ship fits the field and does not collide with other ships or their neighbouring cells.
            let setCells = true; //Stores whether reset of restricted fields is necessary.
            if (ship_object.orientation === 'vertical' && ship_object.vertical_restricted_cells.includes(cell_id)) {
                cell_id = ship_object.initial_cell;
                setCells = false;
            } else if (ship_object.orientation === 'horizontal' && ship_object.horizontal_restricted_cells.includes(cell_id)) {
                cell_id = ship_object.initial_cell;
                setCells = false;
            }


            ship_object.updateInitialCell(cell_id);
            ship_object.getAffectedCells();
            ship_object.insertShip();
            setCells ? setOccupiedCells(Ship.ship_objects_array) : null;
            let element = document.getElementById(id);
            element.ondragstart = function (event) {
                event.dataTransfer.setData('text/plain', event.target.id);
            }
        }
    }

    //Submission of ship set-up.
    document.getElementById('submit_setup').onclick = function () {
        let ship = document.getElementsByClassName('ship');
        for (let i = 0; i < ship.length; i++) {
            ship[i].setAttribute('draggable', 'false');
            ship[i].style.cursor = 'default';
            ship[i].ondblclick = function () {
                return false;
            };
        }
        document.getElementById('submit_setup').setAttribute('disabled', 'true');

        let ship_location_info = {};
        for (let i = 0; i < Ship.ship_objects_array.length; i++) {
            ship_location_info[Ship.ship_objects_array[i].ship_id] = Ship.ship_objects_array[i].affected_cells;
        }
        let JSON_ship_info = JSON.stringify(ship_location_info);

        let submit = new XMLHttpRequest();
        submit.open('GET', '/bs_mult/submit?info=' + JSON_ship_info +'&game_number=' + game_number, true);
        submit.send();
        submit.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                turn = this.responseText == userid;
            }
        }
    };

    //Display the announcement in the case the player wins.
    function displayPlayerWin () {
        document.getElementById('testdiv').innerHTML = '<h1>'+ name +' wins!</h1><a class="btn btn-light" id = "reset" href="bs_mult_queue">Play again?</a>'
        document.getElementById('testdiv').style.display = 'inline-block';
        document.getElementById('testdiv').classList.add('fadein');
        document.getElementById('player_field').classList.add('fadeout');
        document.getElementById('opponent_field_container').classList.add('fadeout');
    }

    //Display the announcement in the case the opponent wins.
    function displayOpponentWin () {
        document.getElementById('testdiv').innerHTML = '<h1>'+ opponent_name +' wins!</h1><a class="btn btn-light" id = "reset" href="bs_mult_queue">Play again?</a>'
        document.getElementById('testdiv').style.display = 'inline-block';
        document.getElementById('testdiv').classList.add('fadein');
        document.getElementById('player_field').classList.add('fadeout');
        document.getElementById('opponent_field_container').classList.add('fadeout');
    }

    let ship_names = [];
    for (let i = 0; i < Ship.ship_objects_array.length; i++) {
        ship_names.push(Ship.ship_objects_array[i].ship_id);
    }
    let ship_names_JSON = JSON.stringify(ship_names);

    let opponent_ship_info; //Information on the opponent's ship set-up.
    let opponent_remaining_ship;
    let update_repeat; //Variable for updateRequest function clearInterval.

    //Checking whether the opponent has submitted his ship set-up. Is repeatedly executed until the
    //opponent's suet-up submission.
    function checkOpponent () {
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', 'bs_mult/check_opponent?id=' + opponent_id + '&game_number=' + game_number + '&ship_names=' + ship_names_JSON, true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                if (this.responseText !== 'wait') {
                    opponent_ship_info = JSON.parse(this.responseText)[0];
                    opponent_remaining_ship = JSON.parse(this.responseText)[0];
                    turn = JSON.parse(this.responseText)[1];
                    document.getElementById('spinner').remove();
                    clearInterval(check_request);
                    if (turn) {
                        document.getElementById('player_field').style.opacity = 0.5;
                        document.getElementById('opponent_field').style.opacity = 1;
                    } else {
                        update_repeat = setInterval(updateRequest, 1000);
                    }
                }
            }
        }
    }
    let check_request = setInterval(checkOpponent, 1000);

    let last_move; //Information regarding the opponent's last move.
    let hit_indicator = false;

    //Check whether the opponent has made a move, as well as a result of this move.
    function updateRequest () {
        let update_request = new XMLHttpRequest();
        last_move = last_move != undefined ? last_move : '';
        update_request.open('GET', 'bs_mult/update?game_number=' + game_number +
            '&opponent_id=' + opponent_id + '&last_move=' + last_move,true);
        update_request.send();
        console.log('bs_mult/update?game_number=' + game_number + '&id=' + userid +
            '&opponent_id=' + opponent_id + '&last_move=' + last_move);
        console.log('early turn log: ' + turn);
        update_request.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(this.responseText);
                update_cycle:
                if (this.responseText != 'wait') {
                    if (JSON.parse(this.responseText)[2] == 20) {
                        clearInterval(update_repeat);
                        displayOpponentWin();
                        break update_cycle;
                    }
                    let hit_indicator = false;
                    turn = JSON.parse(this.responseText)[0] == userid;
                    console.log('turn log: ' + turn);
                    // console.log('json parse log: ' + JSON.parse(this.responseText)[0]);
                    last_move = JSON.parse(this.responseText)[1];
                    for (let i = 0; i < Ship.ship_objects_array.length; i++) {
                        if (Ship.ship_objects_array[i].affected_cells.includes(last_move)) {
                            Ship.ship_objects_array[i].injured_cells.push(last_move);
                            let injured_deck = Ship.ship_objects_array[i].affected_cells.findIndex(function (element) {
                                return element == last_move;
                            });
                            let child_divs = document.getElementById(Ship.ship_objects_array[i].initial_cell).querySelectorAll('[data-cell]');
                            console.log(child_divs);
                            if (Ship.ship_objects_array[i].injured_cells.length == Ship.ship_objects_array[i].deck_quantity) {
                                document.getElementById(Ship.ship_objects_array[i].initial_cell)
                                    .getElementsByTagName('div')[0].style.backgroundColor = '#212529';
                                for (let div = 0; div < child_divs.length; div++) {
                                        child_divs[div].innerHTML = injured;
                                        child_divs[div].style.borderColor = '#e3342f';
                                        child_divs[div].style.backgroundColor = '#212529';
                                    }
                            } else {
                                for (let div = 0; div < child_divs.length; div++) {
                                    if (child_divs[div].getAttribute('data-cell') == injured_deck) {
                                        child_divs[div].innerHTML = injured;
                                        child_divs[div].style.borderColor = '#e3342f';
                                        break
                                    }
                                }
                            }
                            hit_indicator = true;
                            break
                        }
                    }
                    if (!hit_indicator) {
                        document.getElementById(last_move).innerHTML = enemy_miss;
                    }
                    if (turn) {
                        document.getElementById('player_field').style.opacity = 0.5;
                        document.getElementById('opponent_field').style.opacity = 1;
                        clearInterval(update_repeat);
                    }
                }
            }
        }
    }

    //Implementation of onclick event on the opponent's field cells.
    let opponent_cells = document.getElementsByClassName('opponent_cell');
    for (let i = 0; i < opponent_cells.length; i++) {
        opponent_cells[i].onclick = function () {
            if (turn) {
                opponent_cells[i].onclick = false;
                opponent_cells[i].classList.remove('clickable');

                for (let s = 0; s < ship_names.length; s++) {
                    if (opponent_ship_info[ship_names[s]].includes(opponent_cells[i].id.slice(1))) {
                        opponent_remaining_ship[ship_names[s]] = opponent_remaining_ship[ship_names[s]]
                            .filter(item => item != opponent_cells[i].id.slice(1));
                        total_hit++;
                        console.log(total_hit);
                        let submit = new XMLHttpRequest();
                        submit.open('GET', 'bs_mult/move_made?id=' + userid + '&cell=' + opponent_cells[i].id.slice(1) +
                            '&turn=' + userid + '&game_number=' + game_number + '&total_hit=' + total_hit, true);
                        submit.send();
                        if (opponent_remaining_ship[ship_names[s]].length > 0) {
                            opponent_cells[i].innerHTML = injured;
                        } else {
                            for (let c = 0; c < opponent_ship_info[ship_names[s]].length; c++) {
                                document.getElementById('o' + opponent_ship_info[ship_names[s]][c]).innerHTML = killed;
                                document.getElementById('o' + opponent_ship_info[ship_names[s]][c]).style.backgroundColor = '#e3342f';
                                let top_cell = (parseInt(opponent_ship_info[ship_names[s]][c].charAt(0)) - 1) + opponent_ship_info[ship_names[s]][c].slice(1);
                                let bottom_cell = (parseInt(opponent_ship_info[ship_names[s]][c].charAt(0)) + 1) + opponent_ship_info[ship_names[s]][c].slice(1);
                                let left_cell = opponent_ship_info[ship_names[s]][c].slice(0,2) + (parseInt(opponent_ship_info[ship_names[s]][c].charAt(2)) - 1);
                                let right_cell = opponent_ship_info[ship_names[s]][c].slice(0,2) + (parseInt(opponent_ship_info[ship_names[s]][c].charAt(2)) + 1);
                                console.log(top_cell, bottom_cell, right_cell, left_cell);
                                if (opponent_ship_info[ship_names[s]][c].charAt(0) > 0 && !opponent_ship_info[ship_names[s]].includes(top_cell)) {
                                    document.getElementById('o' + top_cell).innerHTML = miss;
                                    document.getElementById('o' + top_cell).onclick = false;
                                    document.getElementById('o' + top_cell).classList.remove('clickable');
                                }
                                if (opponent_ship_info[ship_names[s]][c].charAt(0) < 9 && !opponent_ship_info[ship_names[s]].includes(bottom_cell)) {
                                    document.getElementById('o' + bottom_cell).innerHTML = miss;
                                    document.getElementById('o' + bottom_cell).onclick = false;
                                    document.getElementById('o' + bottom_cell).classList.remove('clickable');
                                }
                                if (opponent_ship_info[ship_names[s]][c].charAt(2) > 0 && !opponent_ship_info[ship_names[s]].includes(left_cell)) {
                                    document.getElementById('o' + left_cell).innerHTML = miss;
                                    document.getElementById('o' + left_cell).onclick = false;
                                    document.getElementById('o' + left_cell).classList.remove('clickable');
                                }
                                if (opponent_ship_info[ship_names[s]][c].charAt(2) < 9 && !opponent_ship_info[ship_names[s]].includes(right_cell)) {
                                    document.getElementById('o' + right_cell).innerHTML = miss;
                                    document.getElementById('o' + right_cell).onclick = false;
                                    document.getElementById('o' + right_cell).classList.remove('clickable');
                                }
                            }
                        }
                        if (total_hit === 20) {
                            displayPlayerWin();
                        }
                        hit_indicator = true;
                        break;
                    }
                }
                if (!hit_indicator){
                    let submit = new XMLHttpRequest();
                    submit.open('GET', 'bs_mult/move_made?id=' + userid + '&cell=' + opponent_cells[i].id.slice(1) +
                        '&turn=' + opponent_id + '&game_number=' + game_number + '&total_hit=' + total_hit,true);
                    submit.send();
                    document.getElementById('player_field').style.opacity = 1;
                    document.getElementById('opponent_field').style.opacity = 0.5;
                    turn = !turn;
                    opponent_cells[i].innerHTML = miss;
                    update_repeat = setInterval(updateRequest, 1000);
                }
                hit_indicator = false;
            }
        }
    }
});
