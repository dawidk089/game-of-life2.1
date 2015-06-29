/**
 * Created by mcmushroom on 14.06.15.
 */
// TODO index i, j => j, i
board = {

    //OBJECT FIELDS
    c: undefined,
    pos_tab: null,
    cell_radius: null,
    canvas_h: null,
    canvas_w: null,
    cell_padding: null,
    size_i: 0,
    size_j: 0,
    cells: [],
    canvas_id: undefined,

    //OBJECT METHODS

    /**
     * z ustawien poczatkowych planszy inicjuje zbior komorek...
     * ...i nadaje im wlasnosci poczatkowe
     */
    init_cells: function () {

        board.cells = [];

        for (var i = 0; i < board.size_i; i++) {
            var row = [];
            for (var j = 0; j < board.size_j; j++)

                if(board.pos_tab[i][j]['state'] == 'live')
                    row.push(new Cell(true, i, j));
                else if(this.pos_tab[i][j]['state'] == 'dead')
                    row.push(new Cell(false, i, j));
            board.cells.push(row);
        }
        console.log('board init done');
    },

    /**
     * przenosi wlasnosci zbioru komorek na plansze
     */
    set_cells: function(){
        for (var i = 0; i < this.size_i; i++)
            for (var j = 0; j < this.size_j; j++) {
                if(this.cells[i][j].is_alive == true)
                    this.set_field(i, j, 'live');
                else if(this.cells[i][j].is_alive == false)
                    this.set_field(i, j, 'dead');
            }

    },
    /**
     * wspiera obliczanie sasiadow zadanej komorki
     * @param x
     * @param y -- id's komorki
     * @returns {number} -- liczba sasiadow
     */
    numberOfNeightbour: function(x, y) {
        //console.log(x, y);
        var alive = 0;
        if (this.cells[x][y - 1] != undefined && this.cells[x][y - 1].is_alive)
            ++alive;
        if (this.cells[x][y + 1] != undefined && this.cells[x][y + 1].is_alive)
            ++alive;
        if (this.cells[x - 1] != undefined && this.cells[x - 1][y] != undefined && this.cells[x - 1][y].is_alive)
            ++alive;
        if (this.cells[x + 1] != undefined && this.cells[x + 1][y] != undefined && this.cells[x + 1][y].is_alive)
            ++alive;
        if (this.cells[x - 1] != undefined && this.cells[x - 1][y - 1] != undefined && this.cells[x - 1][y - 1].is_alive)
            ++alive;
        if (this.cells[x + 1] != undefined && this.cells[x + 1][y - 1] != undefined && this.cells[x + 1][y - 1].is_alive)
            ++alive;
        if (this.cells[x - 1] != undefined && this.cells[x - 1][y + 1] != undefined && this.cells[x - 1][y + 1].is_alive)
            ++alive;
        if (this.cells[x + 1] != undefined && this.cells[x + 1][y + 1] != undefined && this.cells[x + 1][y + 1].is_alive)
            ++alive;
        return alive;
    },
    /**
     * wspiera rysowanie komorek
     * @param i
     * @param j -- pozycja na planszy canvas
     * @param state -- stan komorki: zywa/martwa
     */
    set_field: function(i, j, state){

        //console.error('set_field: ', this.pos_tab);
        //console.warn('size (first row) of pos_tab: ', pos_tab.length, pos_tab[0].length);
        //console.warn('i: ', i, 'j: ', j);
        //console.log('row of pos_tab: ', this.pos_tab[i]);
        var x = this.pos_tab[i][j]['x'];
        var y = this.pos_tab[i][j]['y'];
        //console.warn('xy: ', x, y);

        this.c.strokeStyle = 'black';

        if(state == 'dead')
            this.c.fillStyle = '#222';
        else if(state == 'live')
            this.c.fillStyle = '#f60';
        this.c.beginPath();
        this.c.arc(x, y, this.cell_radius, 0, Math.PI * 2, false);
        this.c.closePath();
        this.c.stroke();
        this.c.fill();

        this.pos_tab[i][j]['state'] = state;
    },

    /**
     * definicja funkcja, która ma wprowadzić zmiany po kliknięciu na komórke w planszy
     * @param event
     */
    set_cell_event: function(event) {

        var x = event.layerX - board.canvas_id.offsetLeft, // - elemLeft,
            y = event.layerY - board.canvas_id.offsetTop; // - elemTop;

        console.log('clicked coordination: ['+x + '; ' + y + ']');

        for (var i=0; i<board.pos_tab.length; i++) {
            for (var j = 0; j < board.pos_tab[i].length; j++) {

                //econsole.log("check pos_tab");

                var x_c = board.pos_tab[i][j]['x'];
                var y_c = board.pos_tab[i][j]['y'];
                var r_c = board.cell_radius;
                var state_c = board.pos_tab[i][j]['state'];

                if (Math.abs(x - x_c) < +board.cell_padding+r_c && Math.abs(y - y_c) < board.cell_padding+r_c) {
                    //console.log('board.c: ' + i + ' ' + j);
                    if(state_c=='dead')
                        board.set_field(i, j, 'live');
                    else if(state_c=='live')
                        board.set_field(i, j, 'dead');
                    break;
                }
            }
        }
    },

    /**
     * wstawianie canvas o proporcjonalnych wymiarach
     */
    drawing: function() {

        var canvas_init_text = '\
        <canvas id="game_canvas"  \
        width="' + board.canvas_w + '" \
        height="' + board.canvas_h + '"> \
        <p>Twoja przeglądarka nie obsługuje canvas.</p> \
        </canvas>';

        document.getElementById('scaling_area').innerHTML = canvas_init_text;
        board.canvas_id = document.getElementById('game_canvas');

        console.log("set a box handle: ", board.canvas_id);

        board.c = board.canvas_id.getContext('2d');

        console.log('set a canvas: ', board.c);
    },

    /**
     * rysowanie martwych komórek -- zapełnianie planszy
     */
    init_draw_cells: function(){
        board.clear();

        board.canvas_w = 2*(board.cell_radius+board.cell_padding)*document.forms[0].horizontal_amount.value;
        board.canvas_h = 2*(board.cell_radius+board.cell_padding)*document.forms[0].vertical_amount.value;

        console.log("set canvas_w: ", board.canvas_w);
        console.log("set canvas_h: ", board.canvas_h);

        var min_pos_x = board.cell_padding + board.cell_radius;
        var max_pos_x = board.canvas_w - (board.cell_padding + board.cell_radius);
        var min_pos_y = board.cell_padding + board.cell_radius;
        var max_pos_y = board.canvas_h - (board.cell_padding + board.cell_radius);
        var distance = (board.cell_radius+board.cell_padding)*2;


        board.pos_tab = [];

        for (var x = min_pos_x; x < max_pos_x; x += distance) {
            var pos_row = [];
            for (var y = min_pos_y; y < max_pos_y; y += distance) {
                pos_row.push({'x': x, 'y': y, 'state': 'dead'});
            }

            board.pos_tab.push(pos_row);
        }
        board.size_i = board.pos_tab.length;
        board.size_j = board.pos_tab[0].length;


        for (var i = 0; i < board.pos_tab.length; i++)
            for (var j = 0; j < board.pos_tab[i].length; j++) {

                var x = board.pos_tab[i][j].x;
                var y = board.pos_tab[i][j].y;
                var state = board.pos_tab[i][j]['state'];
                board.set_field(i, j, state);
            }


    },

    clear: function(){
        board.c.clearRect(0,0,board.canvas_w, board.canvas_h);
    }

};

