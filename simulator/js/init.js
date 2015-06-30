window.onload = function () {

    board.cell_padding = 2;
    board.cell_radius = 50;

    game.set_time_step();
    game.mode = 'zabawa';

    console.log("set cell_padding: ", board.cell_padding);
    console.log("set cell_radius: ", board.cell_radius);
    console.log("set time_step: ", game.time_step);

    board.drawing();
    board.init_draw_cells();
    game.switch_control_panel(null, 'init');
    $("aside input[name='horizontal_amount'], aside input[name='vertical_amount']").on('change', board.init_draw_cells);
    $("aside input[name='set']").data('mode', 'stopped/fun').on('click', game.switch_control_panel);
    $("aside input[name='frequency']").on('change', game.set_time_step);
    $("aside select[name='mode']").data('game_state', document.forms[0].mode.value).on('change', game.state);
    $("aside input[name='start']").on('click', game.start);
    $("aside input[name='next']").on('click', game.next_step_button);
    $("aside input[name='reset']").on('click', board.init_draw_cells).data('mode', 'init').on('click', game.switch_control_panel);

    $(window).resize( board.set_canvas_dimension).resize();
};