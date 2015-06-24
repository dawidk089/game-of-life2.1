<?php

class Main extends FrontController implements Rest {

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
        $view = new View(
            array(
                "template/board.phtml",
                "template/control_panel.phtml",
            ),
            array(
                "title"=>"Game of life -- Symulator automatu komórkowego",
                //"csss"=>array("auth.css")
            )
        );

        $view->show();
        //print "wywolano get";
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

    //--------------------------------------------------
//
//    public function set_view(){
//        $this->view = new View(
//            array(
//                "template/board.phtml",
//                "template/control_panel.phtml",),
//            array(
//                "csss"=>array("login/css/login.css"),
//                "title"=>"Symulacje")
//        );
//    }
//
//    public function login(){
//        $_SESSION["logged"] = "yes";
//        $this->execute();
//    }
//
//
//    public function logout(){
//        session_unset("logged");
//        session_destroy();
//    }
//
//    public function test(){
//        echo "test";
//    }
}