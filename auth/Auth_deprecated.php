<?php

class Auth{

    // wsparcie singletona
    protected function __construct(){
    }

    protected static $instance = null;
    public static function get(){
        if (Auth::$instance === null)
            Auth::$instance = new Auth();
        return Auth::$instance;
    }

    // pobranie kontrolera i akcji z get'a
    protected static $Auth = null;
    public static $action = null;

    public function take(){
        if(isset($_GET["Auth"]))
            Auth::$Auth = $_GET["Auth"];
        else
            Auth::$Auth = null;

        if(isset($_GET["action"]))
            Auth::$action = $_GET["action"];
        else
            Auth::$action = "execute";
    }

    // zmiana kontrolera
    public function change(){
        Auth::$instance = new Auth::$Auth();
    }

    // sprawdzanie czy zalogowany
    public function check_log(){
        if(!isset($_SESSION["logged"]))
            return false;
        else return true;
    }

    // przechowywanie widoku
    protected $view = "stdClass";

    public function set_view(){
        $this->view = new View(
            array(
                "template/login.phtml",
                "template/registration.phtml",),
            array(
                "csss"=>array("auth/css/auth.css"),
                "title"=>"Autoryzacja")
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