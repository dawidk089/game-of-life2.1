/**
 * Created by mcmushroom on 14.06.15.
 */

/**
 * funkcja obslugujaca przechowywanie wlasnosci komorek
 * @param state -- zywa lub martwa
 * @param i
 * @param j - id's komorek
 * @constructor
 */
function Cell(state, i, j) {
    this.age = 0;
    this.is_alive = state;
    this.i = i;
    this.j = j;
}

/**
 * funkcja wspierajca sprawdzanie zmiany stnau komorek
 * @returns {*} -- stan komorki jaki powinien sie ustawic...
 * ...w nastepnym kroku ewolucji
 */
Cell.prototype.condition = function() {

    var neighboars_amount = board.numberOfNeightbour( this.i, this.j);
    //console.log('neighboars_amount for', this.i, this.j, 'is ', neighboars_amount );
    var max_die = 3;
    var min_die = 2;
    var max_not_changed = 2;
    var min_not_changed = 2;

    //console.log('is alive', this.i, this.j, 'is ', this.is_alive );
    /*
    if( neighboars_amount >= max_die && neighboars_amount <= min_die )
        return false;
    else if( neighboars_amount <= max_not_changed && neighboars_amount >= min_not_changed )
        return true;
    else
        return this.is_alive;
    */
    if (!this.is_alive && neighboars_amount == 3)
        return true;
    else if (this.is_alive && neighboars_amount != 2 && neighboars_amount != 3)
        return false;
    else
        return this.is_alive;
};

