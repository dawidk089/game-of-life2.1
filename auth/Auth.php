<?php

class Auth extends FrontController implements Rest {

    private $params = null;
    private $rest_method = null;


    public function __construct($params){
        $this->params = explode('/', $_GET['target']);
        $this->rest_method = strtolower($_SERVER['REQUEST_METHOD']);
        switch($this->rest_method){
            case "get":
                $this->get(array());
                break;
            case "post":
                $this->post($params);
                break;
            case "put":
                $this->put(array());
                break;
            case "delete":
                $this->delete(array());
                break;
        }
        //echo "koniec konstruktora Auth";
    }
    
    public function get(Array $params){
        $view = new View(
            array(
                "template/login.phtml",
                "template/registration.phtml",
            ),
            array(
                "title"=>"Game of life -- Autoryzacja dostępu",
                "appl_path"=>appl_path::$appl_path,
                "csss"=>array("auth/css/main.css",),
                "jss"=>array("auth/js/auth.js"),
            )
        );

        $view->show();
        //print "wywolano get";
    }
    
    public function post(Array $params){
        $mode = $params[0];
        log::logging("Auth/ post/ tryb: $mode\n");
        switch($mode){
            case 'login':
                $this->login($params[1]);
                break;
            case 'register':
                $this->register($params[1]);
                break;
            // TODO tu dac blad [np 404]
        }

        //$_SESSION["logged"] = $_POST["login"];
        //$this->redirect("Main");
    }
    
    public function put(Array $params){
        print "wywolano put";
    }
    
    public function delete(Array $params){
        print "wywolano delete";
    }

    private function register($data){
        $form_param = new FORM($data);
        log::logging("Auth/ post/ register/ \$form_param: ".log::varb($form_param->dict));
        $nick = $form_param->dict['nick'];
        log::logging("Auth/ post/ register/ post/ nick: $nick\n");

        $database = new BaseModel('users');
        $users = $database->read(array('user_name'=>$nick));
        //$database->read(array('name'=>$nick));
        log::logging("Auth/ post/ register/ searched users: ".log::varb($users));
        if(count($users) === 0){
            log::logging("Auth/ post/ register/ nie ma takiego nicku\n");
        }
        else{
            log::logging("Auth/ post/ register/ jest taki nick\n");
        }
    }

    private function login($data){
        $form_param = new FORM($data);
        log::logging("Auth/ post/ login/ \$form_param: ".log::varb($form_param->dict));
    }

}