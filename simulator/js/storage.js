/**
 * obiekt wspierajacy archiwizowanie przeprowdzonej symulacji
 * przechowuje minimum informacji by szybko odtworzyc symulacje lub utowrzyc statystyke
 */
fun_storage = {
    //temporary storage in 'fun' mode
    history: [] //tablica plansz ze zmienna typu boolean odpowiadajaca stanwoy komorki (true-zywa, false-martwa)
};

sim_storage = {

    update_localStorage: function(){
        localStorage['simulations'] = JSON.stringify(sim_storage.simulations);
        localStorage['current_simulation'] = JSON.stringify(sim_storage.current_simulation);
        localStorage['cells'] = JSON.stringify(board.cells);
        localStorage['info'] = JSON.stringify(info);
        localStorage['is_restore'] = JSON.stringify(game.is_restore);
        localStorage['period_finders'] = JSON.stringify(game.periods_finders);
    },

    restore_from_localStorage: function(){

        if(localStorage['is_restore'])
            game.is_restore = JSON.parse(localStorage['is_restore']);
        else
            game.is_restore = false;

        /*if(localStorage['simulations'] !== "undefined" && localStorage['current_simulation'] && localStorage['cells'] && localStorage['info'] &&
            localStorage['simulations'] !== []) {*/
        if(game.is_restore){
            //tablica symulacji
            var simulations_sets = JSON.parse(localStorage['simulations']);
            for(i=0; i<simulations_sets.length; ++i){
                var simulation = new Simulation();
                
                simulation.boards = simulations_sets[i].boards;
                simulation.state = simulations_sets[i].state;
                if(simulations_sets[i].last_board_state) {
                    simulation.last_board_state = {
                        check: simulations_sets[i].last_board_state.check,
                        create: simulations_sets[i].last_board_state.create,
                        storage: simulations_sets[i].last_board_state.storage
                    };
                }
                else{
                    console.log('last_board_state is undefined');
                    simulation.last_board_state = {
                        check: undefined,
                        storage: undefined,
                        create: undefined
                    }
                }

                simulation.step_amount = simulations_sets[i].step_amount;
                simulation.alives = simulations_sets[i].alives;
                simulation.save_status = simulations_sets[i].save_status;

                sim_storage.simulations.push(simulation);
            }
            
            //current_simulation
            var info_sets = JSON.parse(localStorage['info']);
            sim_storage.current_simulation = sim_storage.simulations[info_sets.current_sim_id];

            //cells
            board.cells = JSON.parse(localStorage['cells']);

            //period finders
            game.periods_finders = JSON.parse(localStorage['period_finders']);

            info.restore();
            sim_storage.current_simulation.set_state();
            info.clear();
        }
        else
            console.warn("empty or broken localStorage");
    },

    /**
     * metoda wysylajaca zarchiwizowana symualcje na serwer
     * gdy plansza nie jest zainicjowana (bez pierwszego uruchomienia) -- inicjuje ja
     */
    send_to_server: function() {

        var is_sended = false;

        for(i=0; i<sim_storage.simulations.length; ++i) {
            console.log('checing simulation: ', i);
            var simulation = sim_storage.simulations[i];
            if (simulation.save_status === 'waiting' || simulation.save_status === 'error') {

                is_sended = true;
                simulation.save_status = 'processing';
                info.set_diode();

                //console.log("call send to server: ", JSON.stringify(simulation));

                $.ajax(appl_path + "Main/add_simulation", {
                    type: "POST",
                    data: {
                        'simulation': JSON.stringify(simulation),
                        'id': JSON.stringify(i)
                    },
                    statusCode: {
                        404: function () {
                            console.log("[404] simulation waiting still: ", i);
                            simulation.save_status = 'waiting';
                            info.set_diode();
                            sim_storage.update_localStorage();
                        },
                        500: function () {
                            console.log("[500] simulation error: ", i);
                            simulation.save_status = 'error';
                            info.set_diode();
                            sim_storage.update_localStorage();
                        },
                        /*200: function() {
                         console.log("[200]");
                         sim_storage.current_simulation.save_status = 'processing';
                         info.set_diode();
                         this.interval_id = window.setInterval(sim_storage.check_is_saved, 1000);
                         },*/
                        0: function () {
                            console.log("[000] simulation waiting still: ", i);
                            simulation.save_status = 'waiting';
                            info.set_diode();
                            sim_storage.update_localStorage();

                        }
                    }
                }).done(function (data, status) {
                    console.log('status send: ', status);
                    var data_dec = JSON.parse(data);
                    console.log('done send test: ', data_dec);

                    if (status === 'success') {
                        console.log("[200] dk is saved success: ", data_dec['id']);

                        if (data_dec['save_status'] === 'saved') {
                            console.log("simulation saved success <saved>: ", data_dec['id']);

                            var is_current = (sim_storage.simulations[data_dec['id']] === sim_storage.current_simulation);

                            console.log('is_current?: ', is_current);

                            sim_storage.simulations[data_dec['id']].save_status = 'saved';
                            sim_storage.simulations[data_dec['id']].boards = data_dec['boards'];
                            sim_storage.simulations[data_dec['id']].state = data_dec['simulation_status'];
                            sim_storage.simulations[data_dec['id']].last_board_state = {
                                create: true,
                                storage: true,
                                check: true
                            };
                            sim_storage.simulations[data_dec['id']].step_amount = sim_storage.simulations[data_dec['id']].boards.length;
                            sim_storage.simulations[data_dec['id']].alives = board.get_alives_amount(
                                sim_storage.simulations[data_dec['id']].boards[
                                    sim_storage.simulations[data_dec['id']].step_amount-1
                                    ]);
                            if(is_current) {
                                info.get_from_storage();
                                board.set_board(sim_storage.current_simulation.boards[sim_storage.current_simulation.step_amount-1]);
                                info.set_game();
                                game.switch_control_panel(null, "done/simulation");
                            }

                            info.set_diode();
                        }
                        else {
                            console.log('simulation is failed with status: ', status, i);
                            sim_storage.simulations[data_dec['id']].save_status = 'error';
                            info.set_diode();
                        }
                    }
                    sim_storage.update_localStorage();
                }).error(function(){
                    console.log("[3xx] simulation error: ", i);
                    simulation.save_status = 'error';
                    info.set_diode();
                    sim_storage.update_localStorage();
                });
            }
            else
                console.log("simulation not waiting", i);
        }

        if(!is_sended) {
            console.log('all simulation which waited is saved');
            window.clearInterval(sim_storage.id_send_interval);
            sim_storage.id_send_interval = undefined;
        }
    },

    test: function(){
        if(!sim_storage.interval_id){
            sim_storage.interval_id = window.setInterval(function(){
                console.log('test interwalu');
            }, 1000);
        }
    },

/*    checking_is_saved: function(){
        $.ajax( appl_path + "Main/check_simulation", {
            type: "POST",
            data: JSON.stringify(sim_storage.current_simulation),
            statusCode: {
                404: function() {
                    console.log("[404]");
                    sim_storage.current_simulation.save_status = 'waiting';
                    info.set_diode();
                },
                *//*200: function() {
                 console.log("[200]");
                 sim_storage.current_simulation.save_status = 'processing';
                 info.set_diode();
                 this.interval_id = window.setInterval(sim_storage.check_is_saved, 1000);
                 },*//*
                0: function () {
                    console.log("[000]");
                    sim_storage.current_simulation.save_status = 'error';
                    info.set_diode();
                }
            }
        }).done(function(data, status){
            if(status === 'success'){
                console.log("[200]");
                sim_storage.current_simulation.save_status = 'processing';
                info.set_diode();
                sim_storage.interval_id = window.setInterval(sim_storage.check_is_saved, 1000);
            }
            //else in future
        });
            //window.clearInterval(game.interval_id);
    },*/

    color_diode: function(color){
        var c = document.getElementById('diode_canvas').getContext('2d');
        c.clearRect(0, 0, 50, 50);
        c.strokeStyle = 'black';
        c.fillStyle = color;
        c.beginPath();
        c.arc(25, 25, 10, 0, Math.PI * 2, false);
        c.closePath();
        c.stroke();
        c.fill();
    },

    simulations: [],
    current_simulation: undefined,
    id_send_interval: undefined,

    new_simulation: function(){
        this.simulations.push(new Simulation());
        info.current_sim_id = this.simulations.length-1;
        this.current_simulation = this.simulations[info.current_sim_id];

        info.board_state.check = false;
        info.board_state.create = false;
        info.board_state.storage = false;
    },

    del: function() {
        sim_storage.simulations.splice(info.current_sim_id, 1);
        sim_storage.current_simulation = undefined;
        if (sim_storage.simulations.length !== 0) {
            if (info.current_sim_id !== 0) //last
                info.current_sim_id -= 1;
        }
        board.cells = [];
    },

    switch_sim: function(no){
        if(no === 'prev'){
            if(info.current_sim_id > 0) {
                info.current_sim_id -= 1;
                sim_storage.current_simulation = sim_storage.simulations[info.current_sim_id];
                info.get_from_storage();
                sim.check_done();
            }
        }
        else if(no === 'next'){
            if(info.current_sim_id < sim_storage.simulations.length-1) {
                info.current_sim_id += 1;
                sim_storage.current_simulation = sim_storage.simulations[info.current_sim_id];
                info.get_from_storage();
                sim.check_done();
            }
        }
        else if(no === 'last'){
            info.current_sim_id = sim_storage.simulations.length-1;
            sim_storage.current_simulation = sim_storage.simulations[info.current_sim_id];
            info.get_from_storage();
            sim.check_done();
        }
        else if(typeof(no) === 'number'){
            if(no >= 0 && no < sim_storage.simulations.length && sim_storage.simulations !== undefined) {
                info.current_sim_id = no;
                sim_storage.current_simulation = sim_storage.simulations[info.current_sim_id];
                info.get_from_storage();
                sim.check_done();
            }
        }
        else if(no === undefined){
            sim_storage.current_simulation = sim_storage.simulations[info.current_sim_id];
            info.get_from_storage();
            sim.check_done();
        }
    }




    /*,

    set_end: function(status){
    },



    get_boards: function(){
        return JSON.parse(localStorage.simulations);
    },

    get_end: function(){

    },

    set_current: function(no){
        this.current_id = no;
        this.current_simulation = this.simulations[no];
    },

    check_connection: function(){

    },

    init_storage: function(){

    }*/

};

function Simulation(){
    this.boards = undefined;
    this.state = undefined;
    this.last_board_state = {
        create: undefined,
        storage: undefined,
        check: undefined
    };
    this.step_amount = undefined;
    this.alives = undefined;
    this.save_status = 'unsaved';
    /*
    waiting
    processing
    saved
    unsaved
    error
     */
}

Simulation.prototype.add_board = function(board) {
    if(this.boards === undefined)
        this.boards = [];
    this.boards.push(board);
    info.board_state.storage = true;
    this.check_end();
};

Simulation.prototype.check_end = function () {
    // TODO id ostatniego elementu do zmiany na parametr
    if(info.board_state.check)
        return;
    else
        info.board_state.check = true;

    var last_id = this.boards.length-1;

    // czy uklad wymarl
    board.count_alives(this.boards[last_id]);

    if(info.alives_amount == 0) {
        info.simulation_state = 'died';
        return;
    }

    if(last_id === 0) {
        info.simulation_state = 'evoluating...';
        return;
    }

    // czy period_finder'y cos znalazly
    for(var i = 0; i < game.periods_finders.length; i++){
        var state = game.periods_finders[i].condition(last_id);
        if(state == true) {
            info.simulation_state = 'periodic';
            return;
        }
        else if(state == false) game.periods_finders.splice(i, 1);
    }

    // czy jest staly
    var is_identical = true;
    for (var i = 0; i < board.size_i; i++) {
        for (var j = 0; j < board.size_j; j++) {
            if(this.boards[last_id][i][j] != this.boards[last_id-1][i][j]) {
                is_identical = false;
                break;
            }
        }
        if(!is_identical) break;
    }

    if(is_identical) {
        info.simulation_state = 'const';
        return;
    }

    // czy podejrzany o okresowosc
    for(var k = 0; k < last_id; k++) {
        is_identical = true;
        for (var i = 0; i < board.size_i; i++) {
            for (var j = 0; j < board.size_j; j++) {
                if (this.boards[last_id][i][j] != this.boards[k][i][j]) {
                    is_identical = false;
                    break;
                }
            }
            if (!is_identical) break;
        }
        if(is_identical){
            game.periods_finders.push(new PeriodFinder(k, last_id));
            console.log('create PeriodFinder')
        }
    }
};

Simulation.prototype.set_state = function(){
    this.state = info.simulation_state;
    this.step_amount = info.current_step;
    this.alives = info.alives_amount;

    this.last_board_state.create = info.board_state.create;
    this.last_board_state.storage = info.board_state.storage;
    this.last_board_state.check = info.board_state.check;
};

var log = function(){
    console.log('info::\n');
    console.log('current step: ', info.current_step);
    console.log('alives_amount: ', info.alives_amount);
    console.log('board_state: ', info.board_state);
    console.log('current_sim_id: ', info.current_sim_id);
    console.log('simulation_state: ', info.simulation_state);
    console.log('\n');

    console.log('current_simulation::\n');
    console.log('boards (amount): ', sim_storage.current_simulation.boards.length);
    console.log('state: ', sim_storage.current_simulation.state);
    console.log('last_board_state: ', sim_storage.current_simulation.last_board_state);
    console.log('step_amount: ', sim_storage.current_simulation.step_amount);
    console.log('alives: ', sim_storage.current_simulation.alives);
    console.log('save_status: ', sim_storage.current_simulation.save_status);
    console.log('\n');

    console.log('simulations (amount): ', sim_storage.simulations.length);
    console.log('\n');

    console.log('period_finder (stringify): ', JSON.stringify(game.periods_finders));
    console.log('\n');

    console.log('cells (amount): ', board.cells.length);
    console.log('\n');

    console.log('is_restore: ', game.is_restore);
    console.log('\n');

    console.log('local_storage::\n');
    console.log('simulations', localStorage['simulations']);
    console.log('current_simulation', localStorage['current_simulation']);
    console.log('cells', localStorage['cells']);
    console.log('info', localStorage['info']);
    console.log('is_restore', localStorage['is_restore']);
    console.log('period_finders', localStorage['period_finders']);
};

