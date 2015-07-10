<?php

class PeriodFinder{

    static public $period_finders = array();

    static public function search(&$boards, $new_board, $x, $y, $size){
        for($k = 0; $k < $size; ++$k){
            if(PeriodFinder::is_identical($boards[$k], $new_board, $x, $y)){
                array_push(PeriodFinder::$period_finders, new PeriodFinder(
                    $boards, $k, count($boards)-1, $x, $y
                ));
            }
        }
    }

    static public function check(){
        foreach(PeriodFinder::$period_finders as $period_finder){
            if($period_finder->next_step())
                return true;
        }
        return false;
    }

    static private function is_identical($board1, $board2, $x, $y){
        for($i = 0; $i < $x; ++$i)
            for($j = 0; $j < $y; ++$j)
                if($board1[$i][$j] !== $board2[$i][$j])
                    return false;
        return true;
    }

    private $boards = null;
    private $period_start = null;
    private $period_end = null;
    private $is_identical = null;
    private $x_size = null;
    private $y_size = null;

    public function __construct(&$boards, $found_id, $current_id, $x, $y){
        $this->is_identical = PeriodFinder::$period_finders;
        $this->boards = $boards;
        $this->period_start = $found_id;
        $this->period_end = $current_id;
        $this->x_size = $x;
        $this->y_size = $y;
    }

    public function next_step(){
        $top_id = count($this->boards)-1;
        $bottom_id = ($top_id - $this->period_end) + $this-> period_start;

        if(!$this->is_identical(
            $this->boards[$top_id],
            $this->boards[$bottom_id],
            $this->x_size,
            $this->y_size))

            unset($this);

        else if($this->is_identical && $bottom_id === $this->period_start)
            return true;

        else
            return false;
    }
}



class Automaton{

    private $boards = array();
    private $new_board = array();
    private $copy_board = array();
    private $x_size = null;
    private $y_size = null;
    private $status = 'wait';
    private $is_identical = null;

    public function __construct($boards){
        $this->is_identical = PeriodFinder::$period_finders;
        $this->boards = $boards;
        $this->x_size = count($this->last());
        $this->y_size = count($this->last()[0]);

        log::logging("Automaton/ constructor/ boards: ".log::varb(count($this->boards)));
        do{
            $this->new_board = $this->last();
            $this->copy_board = $this->last();
            $this->step();
            switch($this->status){
                case 'period':
                case 'const':
                case 'died':

                    break;
                case 'wait':
                case 'live':

            }
        }while($this->status !== 'live');
        $this->send();
    }

    private function step(){
        for($i = 0; $i <= $this->x_size; ++$i)
            for($j = 0; $j <= $this->y_size; ++$j)
                $this->change_cell(
                    $this->neighbours_amount($i, $j),
                    $this->new_board[$i][$j]
                );
        array_push($this->boards, $this->new_board);
        $this->check_state();
    }

    private function check_state()
    {
        if (!$this->status === 'wait' && count($this->boards) > 1) {
            if (PeriodFinder::check()) {
                $this->status = 'period';
                return;
            } else if ($this->is_identical($this->last(), $this->penultimate(), $this->x_size, $this->y_size)) {
                $this->status = 'const';
                return;
            } else if ($this->is_died()) {
                $this->status = 'died';
                return;
            } else {
                $this->status = 'live';
                PeriodFinder::search(
                    $this->boards,
                    $this->last(),
                    $this->x_size,
                    $this->y_size,
                    count($this->boards)
                );
            }
        }
    }

    private function is_died(){
        $counter = 0;
        for($i = 0; $i <= $this->x_size; ++$i)
            for($j = 0; $j <= $this->y_size; ++$j)
                if($this->last()[$i][$j]===true)
                    ++$counter;
        if($counter===0)
            return true;
        else
            return false;
    }

    private function send(){
        log::logging("Automaton/ send/ end with ".count($this->boards)." series\n");
    }

    private function change_cell($neighbours_amount, &$cell){
        if(!$cell) {
            if ($neighbours_amount === 3)
                $cell = true;
        }
        else
            if($neighbours_amount > 3 || $neighbours_amount < 2)
                $cell = false;
    }

    private function neighbours_amount($x, $y){
        $counter = 0;

        $x_min = $x - 1;
        $x_max = $x + 1;
        $y_min = $y - 1;
        $y_max = $y + 1;

        for($i = $x_min; $i <= $x_max; ++$i)
            for($j = $y_min; $j <= $y_max; ++$j)
                if($this->copy_board[$i][$j] && $i !== $x && $j !== $y)
                    ++$counter;

        return $counter;
    }

    private function last(){
        return $this->boards[count($this->boards)-1];
    }

    private function penultimate(){
            return $this->boards[count($this->boards)-2];
        }


}