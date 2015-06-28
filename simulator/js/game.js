/**
 * Created by mcmushroom on 14.06.15.
 */

game = {

    //OBJECT FIELDS
    interval_id: null,
    time_step: null,

    //OBJECT METHODS
    /**
     *pobranie danych z formularza i zaktualizowanie planszy
     */
    side_size_set: function(){
        var side_size = Number(document.forms[0].side_size.value);
        if( side_size ){
            board.canvas_h = side_size;
            board.canvas_w = side_size;
        }
        // TODO tu byl beggening
    },

    /**
     *pobranie danych z formularza i zaktualizowanie planszy
     */
    cell_radius_set: function(){
        var cell_radius = Number(document.forms[0].cell_radius.value);
        if( cell_radius ){
            board.cell_radius = cell_radius;
        }
        // TODO tu byl beggening
    },

    /**
     *pobranie danych z formularza
     */
    time_step_set: function(){
        var time_step = Number(document.forms[0].time_step.value);
        if( time_step ){
            this.time_step = time_step;
        }
        console.warn('change time step to: ', this.time_step);
    },

    /**
     * wywolanie inicjalizacji planszy pod ewolucje
     * wykonanie kroku ewolucji
     */
    next_step_button: function(){
        board.init_cells();
        game.next_step_op();
    },

    /**
     * inicjuje start trybu freeruning ewolucji ukladu
     * @param event
     */
    start: function(event){
    // TODO schowac/wylaczyc wszystkie inputy jakie trzeba przy starcie gry
        $("aside input[name='start']").hide();
        $("aside input[name='stop']").show();
        board.canvas_id.removeEventListener('click', board.set_cell_event );
        board.init_cells();
        game.start_evolution(event);
    },

    /**
     * uruchomienie interwalu, ktory wywoluje funkcje nastepnego kroku ewolucji...
     * ...z zadanym czasem
     */
    start_evolution: function (event) {
        /*//TODO set count neighbours on cells
         board.c.font = "15px Arial";
         board.c.textAlign = "center";
         old_fillstyle = board.c.fillStyle;
         console.warn('old_filestyle: ', old_fillstyle);
         board.c.fillStyle = 'white';

         //console.error('xy: ', board.pos_tab[i][j].x, )
         for (var i = 0; i < board.size_i; i++) {
         for (var j = 0; j < board.size_j; j++)

         board.c.fillText(String(board.numberOfNeightbour(i, j)), board.pos_tab[i][j].x, board.pos_tab[i][j].y);
         }

         board.c.fillStyle = old_fillstyle;*/

        console.log('start evolutation with: ', game.time_step, 'ms time step');
        game.interval_id = window.setInterval(game.next_step_op, game.time_step);
    },

    /**
     * funkcja zatrzymujaca interwal
     */
    stop: function (event) {
        $("aside input[name='start']").show();
        $("aside input[name='stop']").hide();
        window.clearInterval(game.interval_id);
        board.canvas_id.addEventListener('click', board.set_cell_event );
    },

    /**
     * wykonanie nastepnego kroku ewolucji, tzn...
     * ...zbadanie sasiadow wszystkich komorek opoerujac na...
     * ...kopii tablicy komorek i ustawianie stanu komorki na...
     * ...tablicy orginalnej
     */
    next_step_op: function () {
        // kopiowanie
        var cell_copy = [];
        //console.log('board.cells: ', board.cells);
        //console.log('in next step i, j', board.size_i, board.size_j);
        for (var i = 0; i < board.size_i; i++) {
            var row = [];
            for (var j = 0; j < board.size_j; j++)
                row.push(new Cell(board.cells[i][j].is_alive, i, j));
            cell_copy.push(row);
        }

        //console.warn('cell copy: ', cell_copy);

        //przeliczanie na kopii
        for (var i = 0; i < board.size_i; i++)
            for (var j = 0; j < board.size_j; j++) {
                cell_copy[i][j].is_alive = board.cells[i][j].condition();
            }
        board.cells = cell_copy;

        board.set_cells();

       /* //TODO set count neighbours on cells
        board.c.font = "15px Arial";
        board.c.textAlign = "center";
        old_fillstyle = board.c.fillStyle;
        console.warn('old_filestyle: ', old_fillstyle);
        board.c.fillStyle = 'white';

        //console.error('xy: ', board.pos_tab[i][j].x, )
        for (var i = 0; i < board.size_i; i++) {
            for (var j = 0; j < board.size_j; j++)

                board.c.fillText(String(board.numberOfNeightbour(i, j)), board.pos_tab[i][j].x, board.pos_tab[i][j].y);
        }

        board.c.fillStyle = old_fillstyle;*/

        //console.log('next step -- board.cells: ', JSON.stringify(board.cells));
    },

    set_time_step: function(){
        game.time_step = 1000.0/document.forms[0].frequency.value;
        console.log("set time_step: ", game.time_step);
    }

};