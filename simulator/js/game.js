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
    current_step: undefined,
    is_restore: false,

    //OBJECT METHODS

    //obsluga przycisku start
    start: function(event){
        if(!game.is_running) {
            board.init_cells();
            if(game.mode == 'zabawa') {
                game.switch_control_panel(null, 'started/fun');
                game.interval_id = window.setInterval(game.switch_to_last, game.time_step);
            }
            else if(game.mode == 'symulacje') {
                game.switch_control_panel(null, 'started/simulation');
                game.interval_id = window.setInterval(game.next_step_op, game.time_step);
            }
            game.is_running = true;
        }
        else{
            window.clearInterval(game.interval_id);
            board.canvas_id.addEventListener('click', board.set_cell_event );
            if(game.mode == 'zabawa')
                game.switch_control_panel(null, 'stopped/fun');
            else if(game.mode == 'symulacje') {
                game.switch_control_panel(null, 'stopped/simulation');
            }
            game.is_running = false;
            game.interval_id = undefined;
        }
    },

    //wykonanie kroku ewolucji
    next_step_op: function() {
        //<debug>
        if(sim_storage.current_simulation && sim_storage.current_simulation.boards.length == 1)
            console.log('stan pierwszej planszy po wejsciu w |next_step_op|: '+JSON.stringify(info.board_state));
        //</debug>


        if(board.cells === undefined)
            throw Error("boards.cells doesnt exist -> you should init them!");
        else if( info.board_state.create && info.board_state.storage && info.board_state.check) {
            ++info.current_step;
            info.board_state.create = false;
            info.board_state.storage = false;
            info.board_state.check = false;
            //<debug>
            console.log('resetowanie stanu planszy, zwiekszenie iteratora');
            //</debug>
        }

        if(!info.board_state.create || game.mode == 'zabawa') {
            // kopiowanie
            var cell_copy = [];

            for (var i = 0; i < board.size_i; i++) {
                var row = [];
                for (var j = 0; j < board.size_j; j++) {
                    row.push(new Cell(board.cells[i][j].is_alive, i, j));
                }
                cell_copy.push(row);
            }

            /*//dodawanie do storage
             if(!info.board_state.storage) {
             if (game.mode == 'symulacje')
             //+spr warunku koncowego
             sim_storage.current_simulation.add_board(cell_memento);
             else if (game.mode == 'zabawa')
             fun_storage.history.push(cell_memento);
             info.current_step+=1;
             info.board_state.storage = true;
             }

             console.log('step '+ info.current_step +': dodano do storage\n', info.board_state);
             */
            //przeliczanie na kopii
            for (var i = 0; i < board.size_i; i++)
                for (var j = 0; j < board.size_j; j++) {
                    cell_copy[i][j].is_alive = board.cells[i][j].condition();
                }

            //przenoszenie nowo wygenerowanej planszy
            board.cells = cell_copy;
            info.board_state.create = true;
            board.set_cells();
            //<debug>
            console.log('utworzenie nowej planszy');
            //</debug>
        }

        //dodawanie do storage
        if (!info.board_state.storage || game.mode == 'zabawa') {
            // kopiowanie
            var new_board = [];
            for (var i = 0; i < board.size_i; i++) {
                var new_board_row = [];
                for (var j = 0; j < board.size_j; j++)
                    new_board_row.push(board.cells[i][j].is_alive);
                new_board.push(new_board_row);
            }

            if (game.mode == 'symulacje') {
                //+spr warunku koncowego
                sim_storage.current_simulation.add_board(new_board);
                //<debug>
                console.log('dodanie planszy do storage');
                //</debug>
            }
            else if (game.mode == 'zabawa') {
                fun_storage.history.push(new_board);
                ++info.current_step;
                info.board_state.storage = true;
            }
        }

        //reakcja na stan symulacji
        if(game.mode == 'symulacje'){
            if(info.simulation_state !== undefined && info.simulation_state !== 'evoluating...') {
                $("aside #simulation_control input[name='start']").click();
                game.switch_control_panel(null, "done/simulation");
                info.set_diode();
            }
            else
                info.simulation_state = 'evoluating...';
        }
        info.set_game();
    },

    /*init_first_board: function(){
        board.current_step = 0;
        memento.new_simulation();
        board.init_cells();
        var cell_memento = [];
        for (var i = 0; i < board.size_i; i++) {
            var memento_row = [];
            for (var j = 0; j < board.size_j; j++) {
                memento_row.push(board.cells[i][j].is_alive);
            }
            cell_memento.push(memento_row);
        }
        memento.add_board(cell_memento);

    },*/

    /**
     * metoda wspierojaca zmiane interwalu poprzez formularz;
     * gdy interwal jest wlaczony -- wylacza go i wlacza nowy z innym czasem
     */
    set_time_step: function(){
        game.time_step = 1000.0/parseFloat($("aside input[name='frequency']").val());
        //console.log('change frequency to: ', game.time_step);
        if(game.interval_id != undefined){
            window.clearInterval(game.interval_id);
            game.interval_id = window.setInterval(game.next_step_op, game.time_step);
        }
    },

    cell_unable: function(is_unable){
        if(is_unable || is_unable === undefined)
            board.canvas_id.addEventListener('click', board.set_cell_event);
        else
            board.canvas_id.removeEventListener('click', board.set_cell_event);
    },

    button_unable: function(name, is_unable){
        if(is_unable === undefined) {
            var button_set = false;
        }
        else {
            var button_set = !is_unable;
        }
        $("aside input[name='"+name+"']").prop('disabled', button_set);
    },

    /**
     * metoda odpowiedzialna za zmiane dostepnosci formularza wg trybu w ktorym znajduje sie gra
     * @param mode_param -- tryb gry
     */
    switch_control_panel: function(event, mode_param){
        var mode = mode_param;
        if( mode == undefined )
            mode = $(this).data("mode");

        //info.control_panel_state = mode;

        //console.log("mode: ", mode);

        /*var set_disable = function(h_w, set_dim, range, start, next, save, mode, set_cells, reset){
            $("aside input[name='horizontal_amount']").prop('disabled', h_w);
            $("aside input[name='vertical_amount']").prop('disabled', h_w);
            $("aside input[name='set']").prop('disabled', set_dim);
            $("aside input[name='frequency']").prop('disabled', range);
            $("aside input[name='start']").prop('disabled', start);
            $("aside input[name='prev'], aside input[name='next']").prop('disabled', next);
            $("aside input[name='save']").prop('disabled', save);
            $("aside select[name='mode']").prop('disabled', mode);
            if(!set_cells)
                board.canvas_id.addEventListener('click', board.set_cell_event);
            else
                board.canvas_id.removeEventListener('click', board.set_cell_event);
            $("aside input[name='reset']").prop('disabled', reset);
        };*/

        switch(mode){
            case "init/fun":
                $('.input_wrapping').hide();
                $('#state').hide();
                $("#dimension_setting").show();




                /*$('.input_wrapping').hide();
                $("#mode, #fun_control").show();
                $("aside select[name='mode']").val(0);

                $("aside input").show();
                $("aside input[name='horizontal_amount']," +
                  "aside input[name='horizontal_amount']").prop('disabled', h_w);
                //set_disable(false, false, true, true, true, true, true, true, true);*/
                break;
            case "stopped/fun":
                $('#state').show();
                $("aside input[name='start']").attr('value', 'start');
                game.cell_unable();
                $("aside input[name='frequency']").show();
                $("aside #mode select").prop('disabled', false);


                game.button_unable('start');
                game.button_unable('mode');
                game.button_unable('prev_step');
                game.button_unable('next_step');
                game.button_unable('last');
                game.button_unable('reset');

                break;
            case "started/fun":
                $('#state').show();
                game.cell_unable(false);
                $("aside input[name='start']").attr('value', 'stop');
                $("aside input[name='frequency']").show();
                $("aside #mode select").prop('disabled', true);


                game.button_unable('start');
                game.button_unable('mode', false);
                game.button_unable('prev_step', false);
                game.button_unable('next_step', false);
                game.button_unable('last', false);
                game.button_unable('reset', false);
                break;
            case "stopped/simulation":
                $('#state').show();
                game.cell_unable(false);
                $("aside input[name='start']").attr('value', 'start');
                $("aside input[name='frequency']").hide();
                $("aside #mode select").prop('disabled', false);

                $("#simulation_control input, #sim_save_state").show();
                $("aside input[name='init']").hide();
                $("aside input[name='cancel']").hide();

                game.button_unable('start');
                game.button_unable('new_sim');
                game.button_unable('prev_sim');
                game.button_unable('next_sim');
                game.button_unable('save');
                game.button_unable('restore');
                game.button_unable('delete');

                break;
            case "started/simulation":
                $('#state').show();
                game.cell_unable(false);
                $("aside input[name='start']").attr('value', 'stop');
                $("aside input[name='frequency']").hide();
                $("aside #mode select").prop('disabled', true);

                $("#simulation_control input, #sim_save_state").show();
                $("aside input[name='init']").hide();
                $("aside input[name='cancel']").hide();

                game.button_unable('start', true);
                game.button_unable('new_sim', false);
                game.button_unable('prev_sim', false);
                game.button_unable('next_sim', false);
                game.button_unable('save', false);
                game.button_unable('restore', false);
                game.button_unable('delete', false);


                break;
            case "init/simulation":
                $('#state').hide();
                game.cell_unable();
                //info.set_simulation();//?
                $("aside input[name='frequency']").hide();

                $("#simulation_control input, #sim_save_state").hide();
                $("aside input[name='init']").show();
                $("aside input[name='cancel']").show();

                if(sim_storage.simulations.length === 0)
                    game.button_unable('cancel', false);
                else
                    game.button_unable('cancel');

                break;

            case "done/simulation":
                $('#state').show();
                game.cell_unable(false);

                $("aside input[name='frequency']").hide();
                $("#simulation_control input, #sim_save_state").show();
                $("aside input[name='init']").hide();
                $("aside input[name='cancel']").hide();

                game.button_unable('start', false);
                break;

            default:
                throw Error("Źle wybrany stan gry.");
        }
    },

    /**
     * metoda wspierajace zmiane trybu gry na zmiany zachodzace w formularzu
     */
    change_mode: function(){
        var mode_game = $("aside select[name='mode']").find("option:selected").text();
            console.log('mode is: ', mode_game);

        if(mode_game == 'symulacje') {
            game.switch_control_panel(null, 'init/simulation');
            game.mode = 'symulacje';
            $('.input_wrapping').hide();
            $('.input_wrapping').eq(1).show();
            $('.input_wrapping').eq(3).show();
            fun.reset();
            if(game.is_restore) {
                info.restore();
                //console.log('info after restore: '+JSON.stringify(info));
                //info.get_from_storage();
                info.set_game();
                info.set_simulation();
                board.set_cells();
                if(info.simulation_state !== undefined && info.simulation_state !== 'evoluating...')
                    game.switch_control_panel(null, 'done/simulation');
                else
                    game.switch_control_panel(null, "stopped/simulation");
                //console.log('change mode set test:: \n', 'simulation: ', sim_storage.current_simulation, '\ninfo: ', info);
                if(!board.set_board(sim_storage.current_simulation.boards[info.current_step-1]))
                    throw Error('niepowodzenie ustawienia planszy');
            }

        }
        else if(mode_game == 'zabawa'){
            //console.log("game.change_mode case 'zabawa'");
            game.mode = 'zabawa';
            $('.input_wrapping').hide();
            $('.input_wrapping').eq(1).show();
            $('.input_wrapping').eq(2).show();
            game.switch_control_panel(null, 'stopped/fun');
            info.reset_game();
        }


    },

    /**
     * metoda obslugujaca przycisk reset gry -- nie dziala w pelni
     */
    reset: function(){
        $("#game_age").text('0');
        if(game.mode === 'zabawa')
            fun.reset();
        else if(game.mode === 'symulacje')
            sim.reset();

    },

    init_from_storage: function(){
        if(!board.set_board(sim_storage.current_simulation.boards[sim_storage.current_simulation.step_amount - 1]))
            throw Error('niepowodzenie ustawienia planszy');
        info.set_game();
    },

    status_bar: function(color, messeage){
        $("#status").html(messeage).css({ "color": color});
    },

    get_first_board: function(){
        board.init_cells();
        sim_storage.current_simulation.add_board(board.get_board());
        info.board_state.create = true;
        info.simulation_state = 'evoluating...';
        info.current_step = 1;
        info.simulation_state.create = true;
    }
};

fun = {

    start: function(event){
        if(!game.is_running) {
            board.init_cells();
            game.switch_control_panel(null, 'started/fun');
            game.interval_id = window.setInterval(fun.switch_to_last, game.time_step);
            game.is_running = true;
        }
        else{
            window.clearInterval(game.interval_id);
            board.canvas_id.addEventListener('click', board.set_cell_event );
            game.switch_control_panel(null, 'stopped/fun');
            game.is_running = false;
            game.interval_id = undefined;
        }
    },

    //funkcja interwalu przejscia do konca wszystkich juz wygenerowanych plansz
    switch_to_last: function(){
        if(info.current_step >= fun_storage.history.length-1) {
            window.clearInterval(game.interval_id);
            game.interval_id = window.setInterval(game.next_step_op, game.time_step);
        }
        else
            board.next_board(fun_storage.history);
    },

    //przesuwanie planszy w trybie zabawy
    prev_one_step: function(){
        console.log('fun.prev_one_step with info.current_step: ', info.current_step);
        if(info.current_step !== undefined && info.current_step-1>=0)
            board.prev_board();
    },

    next_one_step: function(){
        if(info.current_step === undefined)
            fun_storage.history = [];
            board.init_cells();
        if(info.current_step >= fun_storage.history.length-1)
            fun.generate_next_board();
        else {
            board.next_board();
        }
    },

    generate_next_board: function(){
        board.status = 'run';
        board.init_cells();
        game.next_step_op(fun_storage.history);
    },

    set_last: function(){
        if(info.current_step !== undefined)
            board.set_generated(fun_storage.history.length-1)
    },

    reset: function(){
        info.current_step = undefined;
        fun_storage.history = [];
    }
};

sim = {
    start: function(event){
        if(!game.is_running) {
            board.init_cells();
            game.switch_control_panel(null, 'started/simulation');
            game.interval_id = window.setInterval(game.next_step_op, game.time_step);
            game.is_running = true;
        }
        else{
            window.clearInterval(game.interval_id);
            board.canvas_id.addEventListener('click', board.set_cell_event );
            game.switch_control_panel(null, 'stopped/simulation');
            game.is_running = false;
            game.interval_id = undefined;
        }
    },

    init: function(){
        if(board.init_cells()){
            game.is_restore = true;
            info.current_step = 0;
            sim_storage.new_simulation();
            info.set_simulation();
            game.get_first_board();
            board.count_alives(sim_storage.current_simulation.boards[0]);
            info.set_game();
            sim_storage.current_simulation.set_state();
            game.switch_control_panel(null, 'stopped/simulation');
        }
        else {
            board.cells = [];
            game.status_bar("orange", "Nie zaznaczono żadnej komórki.");
        }
    },

    del: function(){
        game.periods_finders = [];
        sim_storage.del();
        if(sim_storage.simulations.length === 0) {
            game.is_restore = false;
            info.clear();
            game.switch_control_panel(null, "init/simulation");
            info.reset_game();
            board.init_draw_cells();
        }
        else{
            sim_storage.switch_sim();
            if(!board.set_board(sim_storage.current_simulation.boards[sim_storage.current_simulation.step_amount-1]))
                throw Error('niepowodzenie ustawienia planszy');
            //#
        }
        info.set_simulation();
        info.set_game();
       },

    restore: function(){
        console.log('checkpoint ', ++checkpoint);
        game.periods_finders = [];
        console.log('checkpoint ', ++checkpoint);
        if(!board.set_board(sim_storage.current_simulation.boards[0]))
            throw Error('niepowodzenie ustawienia planszy');
        console.log('checkpoint ', ++checkpoint);
        sim_storage.del();
        console.log('checkpoint ', ++checkpoint);
        game.switch_control_panel(null, "init/simulation");
        console.log('checkpoint ', ++checkpoint);
        info.reset_game();
        console.log('checkpoint ', ++checkpoint);
        info.clear();
        console.log('checkpoint ', ++checkpoint);
    },

    new_sim: function(){
        if(!info.board_state.create) {
            game.get_first_board();
            info.board_state.create = true;
        }
        if(!info.board_state.storage) {
            sim_storage.current_simulation.add_board(board.get_board());
            ++info.current_step;
        }
        console.log('new_sim: ', JSON.stringify(info));
        sim_storage.current_simulation.set_state();
        info.clear();
        sim_storage.current_simulation = undefined;
        game.periods_finders = [];
        game.switch_control_panel(null, "init/simulation");
        info.reset_game();
        board.init_draw_cells();
    },

    prev_sim: function(){
        if(info.current_sim_id > 0) {
            if(sim_storage.current_simulation.boards === undefined)
                game.get_first_board();
            if(!info.board_state.storage) {
                sim_storage.current_simulation.add_board(board.get_board());
                ++info.current_step;
            }
            //console.log('prev_sim: ', JSON.stringify(info));
            sim_storage.current_simulation.set_state();
            sim_storage.switch_sim('prev');
            //<debug>
            console.log('current simulation: ', sim_storage.current_simulation);
            //</debug>
            if(!board.set_board(sim_storage.current_simulation.boards[sim_storage.current_simulation.step_amount-1]))
                throw Error('niepowodzenie ustawienia planszy');
            game.init_from_storage();
            info.set_simulation();
        }
    },

    next_sim: function(){
        if(info.current_sim_id < sim_storage.simulations.length-1) {
            if(sim_storage.current_simulation.boards === undefined)
                game.get_first_board();
            if(!info.board_state.storage) {
                sim_storage.current_simulation.add_board(board.get_board());
                ++info.current_step;
            }
            //console.log('next_sim: ', JSON.stringify(info));
            sim_storage.current_simulation.set_state();
            sim_storage.switch_sim('next');
            if(!board.set_board(sim_storage.current_simulation.boards[sim_storage.current_simulation.step_amount-1]))
                throw Error('niepowodzenie ustawienia planszy');
            game.init_from_storage();
            info.set_simulation();
        }
    },

    check_done: function(){
        if(info.simulation_state !== undefined && info.simulation_state !== 'evoluating...') {
            game.switch_control_panel(null, "done/simulation")
        }
        else
            game.switch_control_panel(null, "stopped/simulation");
    },

    cancel: function(){
        //przywroc ostatnia plansze
        sim_storage.switch_sim('last');
        if(!board.set_board(sim_storage.current_simulation.boards[sim_storage.current_simulation.step_amount-1]))
            throw Error('niepowodzenie ustawienia planszy');
        game.init_from_storage();
        info.set_simulation();
    },

    save: function(){
        if(sim_storage.current_simulation.boards === undefined)
            game.get_first_board();
        if(!info.board_state.storage)
            sim_storage.current_simulation.add_board(board.get_board());
        sim_storage.current_simulation.set_state();
        sim_storage.current_simulation.save_status = 'waiting';
        info.set_diode();
        if(!sim_storage.id_send_interval)
            sim_storage.id_send_interval = window.setInterval(sim_storage.send_to_server, 10000);
    }
};

info = {
    current_step: undefined,
    alives_amount: undefined,
    board_state: {
        create: undefined,
        storage: undefined,
        check: undefined
    },
    current_sim_id: undefined,
    simulation_state: undefined,
    //control_panel_state: undefined,

    get_from_storage: function(){
        this.current_step = sim_storage.current_simulation.step_amount;
        this.alives_amount = sim_storage.current_simulation.alives;
        this.simulation_state = sim_storage.current_simulation.state;

        this.board_state.check = sim_storage.current_simulation.last_board_state.check;
        this.board_state.create = sim_storage.current_simulation.last_board_state.create;
        this.board_state.storage = sim_storage.current_simulation.last_board_state.storage;

        game.periods_finders = sim_storage.current_simulation.periods_finders;
    },

    set_simulation: function(){
        if(info.current_sim_id === undefined)
            $("#sim_no").text('init');
        else
            $("#sim_no").text(this.current_sim_id + 1);
        this.set_diode();
        $("#sim_count").text(sim_storage.simulations.length);
    },

    set_diode: function(){
        //console.log('set_diode when this.current_sim_id: ', this.current_sim_id);
        if(this.current_sim_id !== undefined)
            switch(sim_storage.current_simulation.save_status) {
                case 'waiting':
                    sim_storage.color_diode('red');
                    break;
                case 'processing':
                    sim_storage.color_diode('orange');
                    break;
                case 'saved':
                    sim_storage.color_diode('green');
                    break;
                case 'unsaved':
                    switch (info.simulation_state) {
                        case undefined:
                        case 'evoluating...':
                            sim_storage.color_diode('dodgerblue');
                            break;
                        case 'periodic':
                        case 'died':
                        case 'const':
                            sim_storage.color_diode('darkblue');
                            break;
                    }
                    break;
                case 'error':
                    sim_storage.color_diode('gray');
                    break;
                default:
                    console.log('info.set_diode: zaden przypadek nie zostal przechwycony: ', sim_storage.current_simulation.save_status);
                    break;
            }
    },

    set_game: function(){
        $("#game_age").text(this.current_step);
        $("#game_state").text(this.simulation_state);
        $("#lived_amount").text(this.alives_amount);
    },

    reset_game: function(){
        $("#game_age").text('n/a');
        $("#game_state").text('n/a');
        $("#lived_amount").text("n/a");
    },

    clear: function(){
        this.current_step = undefined;
        this.alives_amount = undefined;
        this.simulation_state = undefined;
        this.current_sim_id = undefined;

        this.board_state.check = undefined;
        this.board_state.create = undefined;
        this.board_state.storage = undefined;
    },

    restore: function(){
        var info_sets = JSON.parse(localStorage['info']);

        //console.log('info_sets: ', info_sets);
        //console.log('info_sets.current_step: ', info_sets.current_step);
        //console.log('info_sets.current_step type: ', typeof(info_sets.current_step));

        info.current_step = info_sets.current_step;
        info.alives_amount = info_sets.alives_amount;
        info.board_state = info_sets.board_state;
        info.current_sim_id = info_sets.current_sim_id;
        info.simulation_state = info_sets.simulation_state;
    }
};

