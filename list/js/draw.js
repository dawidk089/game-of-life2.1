function Board(horizontal, vertical, padding, radius){
    this.horizontal = horizontal;
    this.vertical = vertical;
    this.cell_padding = padding;
    this.cell_radius = radius;
    this.width = 2*(this.cell_radius+this.cell_padding)*this.horizontal;
    this.height = 2*(this.cell_radius+this.cell_padding)*this.vertical;
    this.context = null;

    this.canvas_id = null;
}

Board.prototype.init_canvas = function(canvas_id, scaling_id) {
   //var canvas_init_text = '\
   //     <canvas id="' + canvas_id + '" width="' + this.width + '" height="' + this.height + '"><p>Twoja przeglądarka nie obsługuje canvas.</p></canvas>';
    var canvas_init_text = '<canvas id="' + canvas_id + '" width="' + this.width + '" height="' + this.height +'" class="game_canvas"><p>Twoja przeglądarka nie obsługuje canvas.</p></canvas>';

    //console.log("scaling_id:", scaling_id);
    document.getElementById(scaling_id).innerHTML = canvas_init_text;
    //console.log("innerHTML:", canvas_init_text);
    //console.log("canvas_id name:", canvas_id);
    //console.log("scaling_di name:", scaling_id);
    this.canvas_id = document.getElementById(canvas_id);
    this.context = this.canvas_id.getContext('2d');

    this.context.clearRect(0, 0, this.width, this.height);
};

Board.prototype.draw_cell = function(x,y, live){
    //console.log("x,y,live:",x,y,live);
    this.context.strokeStyle = 'black';

    if(!live)
        this.context.fillStyle = '#222';
    else
        this.context.fillStyle = '#f60';
    this.context.beginPath();
    this.context.arc(x, y, this.cell_radius, 0, Math.PI * 2, false);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();
};

Board.prototype.draw = function(){
    for(var i=0; i<this.horizontal;++i)
        for(var j=0; j<this.vertical;++j) {
            this.draw_cell(
                (i*2+1)*(this.cell_radius+this.cell_padding),
                (j*2+1)*(this.cell_radius+this.cell_padding)
            );
        }
};