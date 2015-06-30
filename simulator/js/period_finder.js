
function PeriodFinder(beginning_id, ending_id) {
    this.first = beginning_id;
    this.last = ending_id;
}

PeriodFinder.prototype.condition = function(current_id) {
    //console.warn('first: ', this.first);
    //console.warn('last: ', this.last);
    //console.warn('current_id: ', current_id);

    var bottom_pointer = (current_id - this.last) + this.first;
    var is_identical = true;

    //console.warn('bottom pointer: ', bottom_pointer);


    for (var i = 0; i < board.size_i; i++) {
        for (var j = 0; j < board.size_j; j++) {
            if (game.memento[current_id][i][j] != game.memento[bottom_pointer][i][j]) {
                is_identical = false;
                break;
            }
        }
        if (!is_identical) break;}

    if(!is_identical) return false;
    else {
        if (bottom_pointer < this.last - 1) return undefined;
        else return true;
    }
};

