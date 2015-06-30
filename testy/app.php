<?php
class app {
    private $user = "user" ;
    private $pass = "pass" ;
    private $host = "localhost" ;
    private $base = "dbase" ;
    private $coll = "student";
    private $conn ;
    private $dbase ;
    private $collection ;
    function __construct() {
        $this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
        $this->dbase = $this->conn->selectDB($this->base) ;
        $this->collection = $this->dbase->selectCollection($this->coll) ;
    }
    function main() {
        print("Hello, MongoDB CRUD Application") ;
    }
}

