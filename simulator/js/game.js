/**
 * obiekt odpowiedzialny za logike gry w zycie
 */
game = {

    //OBJECT FIELDS
    interval_id: undefined,
    time_step: null,
    is_running: false,
    mode: null, //tryb/status gry
    periods_finders: [], //'poszukiwacze okresow' -- zapetlenia ewolucji; okresowosci ukladu

    //OBJECT METHODS
    /**
     *metoda pobierajaca dane z formularza i aktualizujaca plansze
     */
    /*side_size_set: function(){
        var side_size = Number(document.forms[0].side_size.value);
        if( side_size ){
            board.canvas_h = side_size;
            board.canvas_w = side_size;
        }
    },*/

    /**
     *pobranie danych z formularza i zaktualizowanie planszy
     */
    /*cell_radius_set: function(){
        var cell_radius = Number(document.forms[0].cell_radius.value);
        if( cell_radius ){
            board.cell_radius = cell_radius;
        }
    },*/

    /**
     *pobranie danych z formularza
     */
    /*time_step_set: function(){
        var time_step = Number(document.forms[0].time_step.value);
        if( time_step ){
            this.time_step = time_step;
        }
        console.warn('change time step to: ', this.time_step);
    },*/

    /**
     * wywolanie inicjalizacji planszy w tryb ewolucji (pobiera pozycje komorek z planszy)
     * wykonanie jendego kroku ewolucji
     */
    next_step_button: function(){
        board.status = 'run';
        board.init_cells();
        game.next_step_op();
    },

    /**
     * inicjuje start trybu freeruning ewolucji ukladu -- automatycznej ewolucji
     * inicjuje gre w tryb ewolucji
     * wywoluje w interwale nstepne kroki ewolucji
     */
    start: function(event){
        if(!game.is_running) {
            board.status = 'run';
            board.init_cells();
            game.interval_id = window.setInterval(game.next_step_op, game.time_step);
            if(game.mode == 'zabawa')
                game.switch_control_panel(null, 'started/fun');
            else if(game.mode == 'symulacje')
                game.switch_control_panel(null, 'started/simulation');
            game.is_running = true;
        }
        else{
            window.clearInterval(game.interval_id);
            board.canvas_id.addEventListener('click', board.set_cell_event );
            if(game.mode == 'zabawa')
                game.switch_control_panel(null, 'stopped/fun');
            else if(game.mode == 'symulacje')
                game.switch_control_panel(null, 'stopped/simulation');
            game.is_running = false;
            game.interval_id = undefined;
            console.warn('interval_id: ', game.interval_id);
        }
    },

    /**
     * funkcja zatrzymujaca interwal -- ewolucje
     */
    stop: function (event) {
        window.clearInterval(game.interval_id);
        board.canvas_id.addEventListener('click', board.set_cell_event );
    },

    /**
     * wykonanie nastepnego kroku ewolucji, tzn.:
     *  zbadanie sasiadow wszystkich komorek operujac na kopii tablicy komorek;
     *  ustawianie stanu komorki na tablicy orginalnej;
     *  zapisanie planszy do historii;
     */
    next_step_op: function () {
        // kopiowanie
        var cell_copy = [];
        var cell_memento = [];

        for (var i = 0; i < board.size_i; i++) {
            var row = [];
            var memento_row = [];
            for (var j = 0; j < board.size_j; j++) {
                row.push(new Cell(board.cells[i][j].is_alive, i, j));
                memento_row.push(board.cells[i][j].is_alive);
            }
            cell_copy.push(row);
            cell_memento.push(memento_row);
        }

        memento.history.push(cell_memento);

        //przeliczanie na kopii
        for (var i = 0; i < board.size_i; i++)
            for (var j = 0; j < board.size_j; j++) {
                cell_copy[i][j].is_alive = board.cells[i][j].condition();
            }
        board.cells = cell_copy;

        board.set_cells();

        //inkrementacja licznika krokow
        var counter = parseInt($("#game_age").text());
        $("#game_age").text(counter+1);


        //uzupelnienie formularzy i sprawdzenie konca rozwoju ukladu
        if(game.mode == 'symulacje'){
            var game_state = memento.check_end();

            //uzupelnienie formularzy
            if(game_state !== undefined)
                $("#game_state").text(game_state);
            else
                $("#game_state").text('evoluating...');

            if(game_state !== undefined){
                board.status = 'done';
                $("aside input[name='start']").click();
            }
        }

        //TODO set count neighbours on cells
       /*
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
    },

    /**
     * metoda wspierojaca zmiane interwalu poprzez formularz;
     * gdy interwal jest wlaczony -- wylacza go i wlacza nowy z innym czasem
     */
    set_time_step: function(){
        game.time_step = 1000.0/document.forms[0].frequency.value;
        if(game.interval_id != undefined){
            window.clearInterval(game.interval_id);
            game.interval_id = window.setInterval(game.next_step_op, game.time_step);
        }
    },

    /**
     * metoda odpowiedzialna za zmiane dostepnosci formularza wg trybu w ktorym znajduje sie gra
     * @param mode_param -- tryb gry
     */
    switch_control_panel: function(event, mode_param){
        var mode = mode_param;
        if( mode == undefined )
            mode = $(this).data("mode");

        console.log("mode: ", mode);

        var set_disable = function(h_w, set_dim, range, start, next, save, mode, set_cells, reset){
            $("aside input[name='horizontal_amount']").prop('disabled', h_w);
            $("aside input[name='vertical_amount']").prop('disabled', h_w);
            $("aside input[name='set']").prop('disabled', set_dim);
            $("aside input[name='frequency']").prop('disabled', range);
            $("aside input[name='start']").prop('disabled', start);
            $("aside input[name='next']").prop('disabled', next);
            $("aside input[name='save']").prop('disabled', save);
            $("aside select[name='mode']").prop('disabled', mode);
            if(!set_cells)
                board.canvas_id.addEventListener('click', board.set_cell_event);
            else
                board.canvas_id.removeEventListener('click', board.set_cell_event);
            $("aside input[name='reset']").prop('disabled', reset);
        };

        switch(mode){

            case "init":
                set_disable(false, false, true, true, true, true, true, true, true);
                $("aside select[name='mode']").val(0);
                break;
            case "stopped/fun":
                set_disable(true, true, false, false, false, true, false, false, false);
                $("aside input[name='start']").attr('value', 'start');
                break;
            case "started/fun":
                set_disable(true, true, false, false, true, true, true, true, true);
                $("aside input[name='start']").attr('value', 'stop');
                break;
            case "stopped/simulation":
                set_disable(true, true, true, false, true, false, true, true, false);
                $("aside input[name='start']").attr('value', 'start');
                break;
            case "started/simulation":
                set_disable(true, true, true, false, true, false, true, true, true);
                $("aside input[name='start']").attr('value', 'stop');
                break;
            default:
                throw Error("Źle wybrany stan gry.");
        }
    },

    /**
     * metoda wspierajace zmiane trybu gry na zmiany zachodzace w formularzu
     */
    change_mode: function(){
        if($(this).find("option:selected").text() == 'symulacje') {
            game.switch_control_panel(null, 'stopped/simulation');
            game.mode = 'symulacje';
        }
        else{
            game.mode = 'zabawa';
        }


    },

    /**
     * metoda obslugujaca przycisk reset gry -- nie dziala w pelni
     */
    reset: function(){
        $("#game_age").text('0');
    }
};