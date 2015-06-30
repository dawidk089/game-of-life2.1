memento = {
    history: [],
    
    
    check_end: function () {
    // TODO id ostatniego elementu do zmiany na parametr
    var last_id = memento.history.length-1;
    //console.warn('current id: ', last_id);

    if(last_id == 0) return undefined;

    // czy period_finder'y cos znalazly
    for(var i = 0; i < game.periods_finders.length; i++){
        var state = game.periods_finders[i].condition(memento.history.length-1);
        if(state == true) return 'periodic';
        else if(state == false) game.periods_finders.splice(i, 1);
    }

    // czy uklad wymarl
    var lived_amount = 0;
    for (var i = 0; i < board.size_i; i++) {
        for (var j = 0; j < board.size_j; j++) {
            if(memento.history[last_id][i][j])
                lived_amount++;
        }
    }
    $('#lived_amount').text(lived_amount);

    if(lived_amount == 0) return 'died';

    // czy jest staly
    var is_identical = true;
    for (var i = 0; i < board.size_i; i++) {
        for (var j = 0; j < board.size_j; j++) {
            if(memento.history[last_id][i][j] != memento.history[last_id-1][i][j]) {
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
                if (memento.history[last_id][i][j] != memento.history[k][i][j]) {
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
