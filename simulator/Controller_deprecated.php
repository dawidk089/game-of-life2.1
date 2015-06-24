<?php

class Controller{

    // wsparcie singletona
    protected function __construct(){
    }

    protected static $instance = null;
    public static function get(){
        if (Controller::$instance === null)
            Controller::$instance = new Controller();
        return Controller::$instance;
    }

    // pobranie kontrolera i akcji z get'a
    protected static $controller = null;
    public static $action = null;

    public function take(){
        if(isset($_GET["controller"]))
            Controller::$controller = $_GET["controller"];
        else
            Controller::$controller = null;

        if(isset($_GET["action"]))
            Controller::$action = $_GET["action"];
        else
            Controller::$action = "execute";
    }

    // zmiana kontrolera
    public function change(){
        Controller::$instance = new Controller::$controller();
    }

    // sprawdzanie czy zalogowany
    public function check_log(){
        if(!isset($_SESSION["logged"]))
            return false;
        else return true;
    }

    // przechowywanie widoku
    private $view = "stdClass";

    public function set_view(){
        $this->view = new View(
            array(
                "template/login.phtml",
                "template/registration.phtml",),
            array(
                "csss"=>array("login/css/login.css"),
                "title"=>"Strona główna")
        );
    }

    // funkcja wykonawcza
    public function execute(){
        if($this->check_log()){
            echo "jestes zalogowany";
        }
        else{
            $this->set_view();
        }
        $this->view->show();

    }
}