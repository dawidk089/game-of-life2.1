<?php


class FrontController
{
    private $controlers = array(
        "Main",
        "Auth",
    );
    protected $appl_path = "http://localhost:8080/index.php";

    private $default_controller = "Main";

    private $name_controller = null;
    public function __construct(){
        $params = explode('/', $_GET['target']);
        //var_dump($params);

        // rozpoznanie kontrolera wraz z sprawdzenie czy istnieje
        // oraz ewentualny przekierowaniem na autoryzacje
//        if(!$this->check_log())
//            $this->redirect("/Auth");
//        else if($params[0] === "")
//            $this->redirect("/".$this->default_controller);
//        else if(!array_search($params[0], $this->controlers))
//            $this->redirect();
        /*else */$this->name_controller = $params[0];
    }

    public final function execute(){
        //var_dump($this->name_controller);
        return new $this->name_controller();
    }

    // sprawdzanie czy zalogowany
    protected function check_log(){
        if(!isset($_SESSION["logged"]))
            return false;
        else return true;
    }

    protected function redirect($ulr=""){
        header("Location: ".$this->appl_path.$ulr);
    }

}