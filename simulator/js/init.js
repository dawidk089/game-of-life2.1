window.onload = function () {

    board.cell_padding = 2;
    board.cell_radius = 25;
    board.canvas_w = 2*(board.cell_radius+board.cell_padding)*document.forms[0].horizontal_amount.value;
    board.canvas_h = 2*(board.cell_radius+board.cell_padding)*document.forms[0].vertical_amount.value;
    game.set_time_step();

    console.log("set cell_padding: ", board.cell_padding);
    console.log("set cell_radius: ", board.cell_radius);
    console.log("set canvas_w: ", board.canvas_w);
    console.log("set canvas_h: ", board.canvas_h);
    console.log("set time_step: ", game.time_step);

    board.drawing();
    board.init_draw_cells();


    board.canvas_id.addEventListener('click', board.set_cell_event );
    //$("aside input[name='start']").click(game.start());
    //var log = function(){ console.log("start button clicked"); };
    $("aside input[name='start']").on('click', game.start);
    $("aside input[name='stop']").on('click', game.stop);
    $("aside input[name='next']").on('click', game.next_step_button);
    $("aside input[name='start']").show();
    $("aside input[name='stop']").hide();
    $("aside input[name='frequency']").on('change', game.set_time_step);
    $("aside input[name='reset']").on('change', board.drawing).on('change', board.init_draw_cells);

    var test = function(){
        window.setInterval(/* TODO wstaw funkcje do interwalu */ , 5000);
    }


    $("aside input[name='test']").on('change', );
};




/**
 * wyznacza ile komórek zmieści się w planszy
 * wyznacza szerokość marginesów planszy
 * ustawia canvas
 * ustawia tło planszy
 * wyznacza pozycje komórek
 * rysuje komórki
 */

