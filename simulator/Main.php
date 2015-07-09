<?php

class Main extends FrontController /*implements Rest*/ {

    private $params = null;
    private $rest_method = null;


    public function __construct($params){
        $this->params = explode('/', $_GET['target']);
        $this->rest_method = strtolower($_SERVER['REQUEST_METHOD']);
        switch($this->rest_method){
            case "get":
                $this->get($params);
                break;
            case "post":
                $this->post($params);
                break;
            case "put":
                $this->put($params);
                break;
            case "delete":
                $this->delete($params);
                break;
        }
    }

    public function get(Array $params){
        log::logging('Main/ get/ $params[get]: '.log::varb($params['get']));
        if($params['get']['params'][0] == 'new')
            $status = 'Witamy nowy użytkowniku -- zostałeś zarejestrowany.';
        else
            $status = '';

        log::logging("Main/ get/ \$params: ".log::varb($params));
        $view = new View(
            array(
                "template/board.phtml",
                "template/control_panel.phtml",
            ),
            array(
                "title"=>"Game of life -- Symulator automatu komórkowego",
                "status"=>$status,
                "csss"=>array(
                    "simulator/css/main.css",
                    //"auth/css/smain.css",
                    ),
                "jss"=>array(
                    "jquery_js/jquery.js",
                    "simulator/js/cell.js",
                    "simulator/js/period_finder.js",
                    "simulator/js/storage.js",
                    "simulator/js/board.js",
                    "simulator/js/game.js",
                    "simulator/js/init.js",
                )
            )
        );
        log::logging("Main/ get/ przygotowano widok, wywoluje view->show()\n" );
        $view->show();
        //print "wywolano get";
    }

    public function post(Array $params){
        log::logging("Main/ post/ \$params: ".log::varb($params));
        $database = new BaseModel('users');
        $database->update(
            array('nick'=>$_SESSION['logged']),
            array('simulation[]'=>$params['ajax']['boards'])
        );
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