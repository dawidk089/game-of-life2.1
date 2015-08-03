<?php

class BaseModel{
    private $user = "3karminski" ;
    private $pass = "pass" ;
    private $host = "localhost" ;
    //private $host = "pascal.fis.agh.edu.pl" ;
    private $base = "3karminski" ;
    private $coll;// = "users";
    private $conn ;
    private $dbase ;
    private $collection ;

    private function open_database(){
        $this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
        $this->dbase = $this->conn->selectDB($this->base) ;
        $this->collection = $this->dbase->selectCollection($this->coll);
    }

    public function construct_coll($collection) {
        $this->coll = $collection;
        $this->open_database();

    }

    public function  construct_params(Array $params){
        log::logging("BaseModel/ put/ wejscie do przeciazonego konstruktora\n");
    }

    public function __construct($data){
        log::logging("BaseModel/ __construct/ gettype(\$data): ".log::varb(gettype($data)));
        log::logging("BaseModel/ __construct/ \$data: ".log::varb($data));
        switch(gettype($data)){
            case 'array':
                $this->construct_coll($data[0]);
                $this->construct_params($data[1]);
                break;
            case 'string':
                $this->construct_coll($data);
                break;
        }
    }

    public function read($search_expression){
        $result = array();
        foreach($this->collection->find($search_expression) as $obj){
            $result[] = $obj;
        }
        return $result;
    }

    public function create(Array $data){
        $this->collection->insert($data);
    }

    public function update($mode, Array $where, Array $what){
        if($mode === 'add') {
            $this->collection->update(
                $where,
                array('$addToSet' => $what)
            );
        }
    }

    public function delete($no){
        $this->collection->update(
            array('nick'=>$_SESSION['logged']),
            array('$unset'=>array('simulation.'.$no=>1)));
        $this->collection->update(
            array('nick'=>$_SESSION['logged']),
            array('$pull'=>array('simulation'=>null)));
    }
}