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
    function __construct($collection) {
        $this->coll = $collection;
        $this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
        $this->dbase = $this->conn->selectDB($this->base) ;
        $this->collection = $this->dbase->selectCollection($this->coll) ;
    }
    function main() {
        print("Hello, MongoDB CRUD Application") ;
    }
}

