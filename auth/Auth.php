<?php

class Auth extends FrontController implements Rest {

    private $params = null;
    private $rest_method = null;


    public function __construct(){
        $this->params = explode('/', $_GET['target']);
        $this->rest_method = strtolower($_SERVER['REQUEST_METHOD']);
        switch($this->rest_method){
            case "get":
                $this->get(array());
                break;
            case "post":
                $this->get(array());
                break;
            case "put":
                $this->get(array());
                break;
            case "delete":
                $this->get(array());
                break;
        }
    }
    
    public function get(Array $params){
        print "wywolano get";
    }
    
    public function post(Array $params){
        print "wywolano post";
    }
    
    public function put(Array $params){
        print "wywolano put";
    }
    
    public function delete(Array $params){
        print "wywolano delete";
    }
    


}