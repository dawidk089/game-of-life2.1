<?php

class BaseModel{
    private $user = "3karminski" ;
    private $pass = "pass" ;
    private $host = "pascal.fis.agh.edu.pl" ;
    private $base = "3karminski" ;
    private $coll;// = "users";
    private $conn ;
    private $dbase ;
    private $collection ;

    public function __construct($collection) {
        $this->coll = $collection;
        $this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
        $this->dbase = $this->conn->selectDB($this->base) ;
        $this->collection = $this->dbase->selectCollection($this->coll);
        //log::logging("BaseModel/ constructor/ otrzymane parametry: ".log::varb($params));
        //log::logging("BaseModel/ constructor/ otrzymany json: ".log::varb(json_decode($params[1])));
    }

    public function read($search_expression){
        $result = array();
        //$cursor = $this->collection->find();
        foreach($this->collection->find($search_expression) as $obj){
            log::logging("BaseModel/ read/ \$row: ".log::varb($obj));
            $result[] = $obj;
        }
        log::logging("BaseModel/ read/ \$result: ".log::varb($result));
        return $result;
    }
}

