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
        echo "koniec konstruktora Auth";
    }
    
    public function get(Array $params){
        $view = new View(
            array(
                "template/login.phtml",
                "template/registration.phtml",
            ),
            array(
                "title"=>"Game of life -- Autoryzacja dostępu",
                "csss"=>array("auth/css/auth.css",),
            )
        );

        $view->show();
        //print "wywolano get";
    }
    
    public function post(Array $params){
        $_SESSION["logged"] = $_POST["login"]; // TODO do walidacji z baz danych
        //print "wywolano post</br>";
        //echo "jego parametry: "; var_dump($params); echo "</br>";
        //echo "post: "; var_dump($_POST); echo "</br>";
        $this->redirect("Main");
    }
    
    public function put(Array $params){
        print "wywolano put";
    }
    
    public function delete(Array $params){
        print "wywolano delete";
    }
    


}