//var appl_path = "http://wu.tbajorek.pl/gameoflife/";
var appl_path = "/";

/**
 * inicjacja zdarzen:
 *  usuniecia planszy na przycisk usun
 *  rysowania planszy na klikniecie w wiersz z symulacja
 */
window.onload = function(){

    $("input[name='delete']").data('id', $("input[name='id']").value).on('click', delete_simulation);
    $(".row").on('click', function(){
        console.log('row id (init): ', $(this).find("input[type='hidden']").attr('value'));
        $('.row').css("background-color", 'rgba(255, 165, 0, 0');
        $(this).css("background-color", 'rgba(255, 165, 0, 0.3)');
        $(this).data('id', $(this).find("input[type='hidden']").attr('value'));
    });//.on('click', grapher.get_point);

};
