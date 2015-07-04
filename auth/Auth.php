<?php

class Auth extends FrontController implements Rest {

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
                $this->put(array());
                break;
            case "delete":
                $this->delete(array());
                break;
        }
        //echo "koniec konstruktora Auth";
    }
    
    public function get(Array $params){
        log::logging("Auth/ get/ \$params: ".log::varb($params));

        $status = '';
        switch($params[0]){
            case 'nick_exist':
                $status = 'Wprowadzony nick już istnieje.';
                break;
            case 'nick_nexist':
                $status = 'Wprowadzony nick nie istnieje.';
        }

        $view = new View(
            array(
                "template/login.phtml",
                "template/registration.phtml",
            ),
            array(
                "title"=>"Game of life -- Autoryzacja dostępu",
                "status"=>$status,
                "appl_path"=>appl_path::$appl_path,
                "csss"=>array(appl_path::$appl_path."auth/css/main.css",),
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
        //przetworzenie formularza rejestracji
        $form_param = new FORM($data);
        log::logging("Auth/ post/ register/ \$form_param: ".log::varb($form_param->dict));
        $nick = $form_param->dict['nick'];
        log::logging("Auth/ post/ register/ post/ nick: $nick\n");

        //otwarcie bazy danych
        $database = new BaseModel('users');
        $users = $database->read(array('nick'=>$nick));
        log::logging("Auth/ post/ register/ searched users: ".log::varb($users));

        //sprawdzenie czy uzytkownik istnieje
        //dodanie uzytkownika
        if(count($users) === 0){
            log::logging("Auth/ post/ register/ nie ma takiego nicku\n");
            $database->create(array(
                    'email'=>$form_param->dict['email'],
                    'nick'=>$form_param->dict['nick'],
                    'password'=>$form_param->dict['password'],
                    'simulation'=>array(),
                )
            );
            log::logging("Auth/ post/ register/ dodano nowego uzytkowanika do bazy danych\n");
        }
        //przekierowanie z informacja zwrotna o niepowodzeniu
        else{
            log::logging("Auth/ post/ register/ jest taki nick\n");
            $this->redirect("Auth/nick_exist/");
        }
    }

    private function login($data){
        //przetworzenie formularza rejestracji
        $form_param = new FORM($data);
        log::logging("Auth/ post/ login/ \$form_param: ".log::varb($form_param->dict));
        $nick = $form_param->dict['nick'];
        log::logging("Auth/ post/ login/ post/ nick: $nick\n");

        //otwarcie bazy danych
        $database = new BaseModel('users');
        $users = $database->read(array('nick'=>$nick));
        log::logging("Auth/ post/ login/ searched users: ".log::varb($users));

        //sprawdzenie czy uzytkownik istnieje
        //przekierowanie z informacja zwrotna o niepowodzeniu
        if(count($users) === 0){
            log::logging("Auth/ post/ login/ nie ma takiego nicku\n");
            $this->redirect("Auth/nick_nexist/");
        }
        //zalogowanie id w sesji, przekierowanie na strone glowna
        else{
            log::logging("Auth/ post/ login/ przekierowanie na main\n");
            $id = $users[0]['_id'];
            $_SESSION['logged'] = $id;
            $this->redirect("Main");
        }

    }

}