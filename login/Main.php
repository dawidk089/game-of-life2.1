<?php

class Main extends Controller{

    public function set_view(){
        $this->view = new View(
            array(
                "template/board.phtml",
                "template/control_panel.phtml",),
            array(
                "csss"=>array("login/css/login.css"),
                "title"=>"Symulacje")
        );
    }

    public function login(){
        $_SESSION["logged"] = "yes";
        $this->execute();
    }


    public function logout(){
        session_unset("logged");
        session_destroy();
    }

    public function test(){
        echo "test";
    }
}