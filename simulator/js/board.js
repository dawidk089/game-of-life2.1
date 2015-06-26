/**
 * Created by mcmushroom on 14.06.15.
 */
// TODO index i, j => j, i
board = {
    c: null,
    pos_tab: [],
    cell_radius: 20,
    canvas_h: 500,
    canvas_w: 500,
    size_i: 0,
    size_j: 0,
    cells: [],
    /**
     * z ustawien poczatkowych planszy inicjuje zbior komorek...
     * ...i nadaje im wlasnosci poczatkowe
     */
    init_cells: function () {
        for (var i = 0; i < this.size_i; i++) {
            row = [];
            for (var j = 0; j < this.size_j; j++)

                if(this.pos_tab[i][j]['state'] == 'live')
                    row.push(new Cell(true, i, j));
                else if(this.pos_tab[i][j]['state'] == 'dead')
                    row.push(new Cell(false, i, j));
            this.cells.push(row);
        }
        console.log('board init done');
    },
    /**
     * przenosi wlasnosci zbioru komorek na plansze
     */
    set_cells: function(){
        for (var i = 0; i < this.size_i; i++)
            for (var j = 0; j < this.size_j; j++) {
                if(this.cells[i][j].is_alive == true)
                    this.set_field(i, j, 'live');
                else if(this.cells[i][j].is_alive == false)
                    this.set_field(i, j, 'dead');
            }

    },
    /**
     * wspiera obliczanie sasiadow zadanej komorki
     * @param x
     * @param y -- id's komorki
     * @returns {number} -- liczba sasiadow
     */
    numberOfNeightbour: function(x, y) {
        //console.log(x, y);
        var alive = 0;
        if (this.cells[x][y - 1] != undefined && this.cells[x][y - 1].is_alive)
            ++alive;
        if (this.cells[x][y + 1] != undefined && this.cells[x][y + 1].is_alive)
            ++alive;
        if (this.cells[x - 1] != undefined && this.cells[x - 1][y] != undefined && this.cells[x - 1][y].is_alive)
            ++alive;
        if (this.cells[x + 1] != undefined && this.cells[x + 1][y] != undefined && this.cells[x + 1][y].is_alive)
            ++alive;
        if (this.cells[x - 1] != undefined && this.cells[x - 1][y - 1] != undefined && this.cells[x - 1][y - 1].is_alive)
            ++alive;
        if (this.cells[x + 1] != undefined && this.cells[x + 1][y - 1] != undefined && this.cells[x + 1][y - 1].is_alive)
            ++alive;
        if (this.cells[x - 1] != undefined && this.cells[x - 1][y + 1] != undefined && this.cells[x - 1][y + 1].is_alive)
            ++alive;
        if (this.cells[x + 1] != undefined && this.cells[x + 1][y + 1] != undefined && this.cells[x + 1][y + 1].is_alive)
            ++alive;
        return alive;
    },
    /**
     * wspiera rysowanie komorek
     * @param i
     * @param j -- pozycja na planszy canvas
     * @param state -- stan komorki: zywa/martwa
     */
    set_field: function(i, j, state){

        //console.error('set_field: ', this.pos_tab);
        //console.warn('size (first row) of pos_tab: ', pos_tab.length, pos_tab[0].length);
        //console.warn('i: ', i, 'j: ', j);
        //console.log('row of pos_tab: ', this.pos_tab[i]);
        var x = this.pos_tab[i][j]['x'];
        var y = this.pos_tab[i][j]['y'];
        //console.warn('xy: ', x, y);

        this.c.strokeStyle = 'black';

        if(state == 'dead')
            this.c.fillStyle = '#222';
        else if(state == 'live')
            this.c.fillStyle = '#f60';
        this.c.beginPath();
        this.c.arc(x, y, this.cell_radius, 0, Math.PI * 2, false);
        this.c.closePath();
        this.c.stroke();
        this.c.fill();

        this.pos_tab[i][j]['state'] = state;
    }
};

