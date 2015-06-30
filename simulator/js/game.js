game = {

    //OBJECT FIELDS
    interval_id: undefined,
    time_step: null,
    is_running: false,
    mode: null,
    memento: [],
    periods_finders: [],

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
    },

    /**
     *pobranie danych z formularza i zaktualizowanie planszy
     */
    cell_radius_set: function(){
        var cell_radius = Number(document.forms[0].cell_radius.value);
        if( cell_radius ){
            board.cell_radius = cell_radius;
        }
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
        if(!game.is_running) {
            board.init_cells();
            console.log('start evolutation with: ', game.time_step, 'ms time step');
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
     * funkcja zatrzymujaca interwal
     */
    stop: function (event) {
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
        var cell_memento = [];
        //console.log('board.cells: ', board.cells);
        //console.log('in next step i, j', board.size_i, board.size_j);
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

        game.memento.push(cell_memento);

        //przeliczanie na kopii
        for (var i = 0; i < board.size_i; i++)
            for (var j = 0; j < board.size_j; j++) {
                cell_copy[i][j].is_alive = board.cells[i][j].condition();
            }
        board.cells = cell_copy;

        board.set_cells();

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

        console.error('state game: ', game.check_end());
    },

    set_time_step: function(){
        game.time_step = 1000.0/document.forms[0].frequency.value;
        if(game.interval_id != undefined){
            window.clearInterval(game.interval_id);
            game.interval_id = window.setInterval(game.next_step_op, game.time_step);
        }
        console.log("set time_step: ", game.time_step);
    },

    //TODO sprawdzic poprawnosc zmiany stanu elementow
    //TODO poprawic mode by sprawdzanie warunkow byla tylko w trybie symulacji
    //TODO ukryc stan uklad w trybie zabawy
    //TODO zablokowac zmiane planszy w trybie symulacje
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
                set_disable(false, false, false, true, true, true, true, true, true);
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

                //board.canvas_id.addEventListener('click', board.set_cell_event);
                //$("aside input[name='start']").on('click', game.start);
                //$("aside input[name='stop']").on('click', game.stop);
                //$("aside input[name='next']").on('click', game.next_step_button);
                //$("aside input[name='start']").show();
                //$("aside input[name='stop']").hide();
                //$("aside input[name='frequency']").on('change', game.set_time_step);
                //$("aside input[name='reset']").on('change', board.drawing).on('change', board.init_draw_cells);
        }
    },


    change_mode: function(){
        if($(this).find("option:selected").text() == 'symulacje') {
            game.switch_control_panel(null, 'stopped/simulation');
            game.mode = 'symulacje';
        }
        else{
            game.mode = 'zabawa';
        }


    },

    check_end: function () {
        // TODO id ostatniego elementu do zmiany na parametr
        var last_id = game.memento.length-1;
        //console.warn('current id: ', last_id);

        if(last_id == 0) return undefined;

        // czy period_finder'y cos znalazly
        for(var i = 0; i < game.periods_finders.length; i++){
            var state = game.periods_finders[i].condition(game.memento.length-1);
            if(state == true) return 'periodic';
            else if(state == false) game.periods_finders.splice(i, 1);
        }

        // czy uklad wymarl
        var lived_amount = 0;
        for (var i = 0; i < board.size_i; i++) {
            for (var j = 0; j < board.size_j; j++) {
                if(game.memento[last_id][i][j])
                    lived_amount++;
            }
        }
        $('#lived_amount').text(lived_amount);

        if(lived_amount == 0) return 'died';

        // czy jest staly
        var is_identical = true;
        for (var i = 0; i < board.size_i; i++) {
            for (var j = 0; j < board.size_j; j++) {
                if(game.memento[last_id][i][j] != game.memento[last_id-1][i][j]) {
                    is_identical = false;
                    break;
                }
            }
            if(!is_identical) break;
        }

        if(is_identical) return 'const';

        // czy podejrzany o okresowosc
        for(var k = 0; k < last_id; k++) {
            is_identical = true;
            for (var i = 0; i < board.size_i; i++) {
                for (var j = 0; j < board.size_j; j++) {
                    if (game.memento[last_id][i][j] != game.memento[k][i][j]) {
                        is_identical = false;
                        break;
                    }
                }
                if (!is_identical) break;
            }
            if(is_identical){
                game.periods_finders.push(new PeriodFinder(k, last_id));
                console.warn('create PeriodFinder')
            }
        }

        return undefined;
    }




};