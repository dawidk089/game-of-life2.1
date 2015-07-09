<?php

class Auth extends FrontController implements Rest {

    //private $params = null;
    private $rest_method = null;


    public function __construct($params){
        //$this->params = explode('/', $_GET['target']);
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
        //echo "koniec konstruktora Auth";
    }
    
    public function get(Array $params){
        log::logging("Auth/ get/ \$params: ".log::varb($params));

        $status = '';
        switch($params['get']['params'][0]){
            case 'nick_exist':
                $status = 'Wprowadzony nick już istnieje.';
                break;
            case 'nick_nexist':
                $status = 'Wprowadzony nick nie istnieje.';
                break;
            case 'logout':
                $this->logout();
                $status = 'Zostałeś wylogowany pomyślnie.';
                break;
            case 'new_logged':
                $status = 'Zostałeś pomyślnie zalogowany.';
                break;
        }

        $view = new View(
            array(
                "template/login.phtml",
                "template/registration.phtml",
            ),
            array(
                "title"=>"Game of life -- Autoryzacja dostępu",
                "status"=>$status,
                "csss"=>array("auth/css/main.css",),
                "jss"=>array("auth/js/auth.js"),
            )
        );

        $view->show();
        //print "wywolano get";
    }
    
    public function post(Array $params){
        log::logging("Auth/ post/ \$params: ".log::varb($params));

        $mode = $params['get']['params'][0];
        log::logging("Auth/ post/ tryb: $mode\n");
        switch($mode){
            case 'login':
                $this->login($params['post']);
                $_SESSION["logged"] = $params['post']['nick'];
                $this->redirect("Main/new_logged");
                break;
            case 'register':
                $this->register($params['post']);
                $_SESSION["logged"] = $params['post']['nick'];
                $this->redirect("Main/new");
                break;
            // TODO tu dac blad [np 404]
        }
        $_SESSION["logged"] = $params['post']['nick'];
    }
    
    public function put(Array $params){
        print "wywolano put";
    }
    
    public function delete(Array $params){
        print "wywolano delete";
    }

    private function register($data){
        $nick = $data['nick'];
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
                    'email'=>$data['email'],
                    'nick'=>$data['nick'],
                    'password'=>$data['password'],
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
        $nick = $data['nick'];
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
            $_SESSION['logged'] = $nick;
            $this->redirect("Main/login");
        }

    }

    private function logout(){
        unset($_SESSION['logged']);
    }

}