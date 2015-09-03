//var appl_path = "http://wu.tbajorek.pl/gameoflife/";
var appl_path = "/";
var checkpoint = 0;

/**
 * inicjalizacja uchwytow na zmiany w formularzu
 */
window.onload = function () {

    sim_storage.restore_from_localStorage();
    sim_storage.send_to_server();

    board.cell_padding = 2;
    board.cell_radius = 50;

    game.set_time_step();
    game.mode = 'zabawa';

    //console.log("set cell_padding: ", board.cell_padding);
    //console.log("set cell_radius: ", board.cell_radius);
    //console.log("set time_step: ", game.time_step);

    board.drawing('scaling_area', 'game_canvas');
    board.init_draw_cells();
    game.switch_control_panel(null, 'init/fun');

    $("aside input[name='horizontal_amount'], aside input[name='vertical_amount']").on('change', board.init_draw_cells);
    $("aside input[name='set']").data('mode', 'stopped/fun').on('click', game.switch_control_panel).on('click', board.set_canvas_dimension).on('click', game.change_mode);

    $("aside select[name='mode']").data('game_state', $("#mode").val()).on('change', game.change_mode);

    $("aside input[name='frequency']").on('change', game.set_time_step);
    $("aside #fun_control input[name='start']").on('click', fun.start);
    $("aside #fun_control input[name='reset']").on('click', board.init_draw_cells).data('mode', 'init/fun').on('click', game.switch_control_panel).on('click', game.reset);
    $("aside input[name='prev_step']").on('click', fun.prev_one_step);
    $("aside input[name='next_step']").on('click', fun.next_one_step);
    $("aside input[name='last']").on('click', fun.set_last);

    $("aside #simulation_control input[name='start']").on('click', sim.start).on('click', sim_storage.update_localStorage);
    $("aside input[name='init']").on('click', sim.init).on('click', sim_storage.update_localStorage);
    $("aside input[name='cancel']").on('click', sim.cancel);
    $("aside input[name='new_sim']").on('click', sim.new_sim);
    $("aside input[name='prev_sim']").on('click', sim.prev_sim);
    $("aside input[name='next_sim']").on('click', sim.next_sim);
    $("aside input[name='save']").on('click', sim.save).on('click', sim_storage.update_localStorage);
    $("aside #simulation_control input[name='restore']").on('click', sim.restore).on('click', sim_storage.update_localStorage);
    $("aside #simulation_control input[name='delete']").on('click', sim.del).on('click', sim_storage.update_localStorage);

    info.reset_game();
    $("#min_range").text($("input[name='frequency']").attr('min')+' FPS');
    $("#max_range").text($("input[name='frequency']").attr('max')+' FPS');
    $(window).resize( board.set_canvas_dimension).resize();

    $('#frequency').parent().hide();

};