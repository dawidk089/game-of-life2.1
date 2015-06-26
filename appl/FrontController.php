<?php


class FrontController
{
    private $controlers = array(
        "Main",
        "Auth",
    );
    private $appl_path = "http://localhost/";
    private $default_controller = "Main";
    private $rest_method = null;
    private $name_controller = null;
    private $params = null;

    public function __construct(){
        // rozpozananie metody
        // rozpozananie kontrolera
        // rozpozananie parametrow

        // pobranie metody
        $this->rest_method = strtolower($_SERVER['REQUEST_METHOD']);
        log::logging("FrontController/ pobranie rest_method: $this->rest_method \n");


        // pobranie url i rozpakowanie
        // obsluzenie ulr
        $params = explode('/', $_GET['target']); // [200] OK
        log::logging("FrontController/ rozsplitowanie \$_GET: ".log::varb($this->params));

        switch ($controller = $this->valid_controller($params)) { // [200] OK
            case "not_specified":
            case "not_exist":
                log::logging("FrontController/ nie podany lub nie istniejacy kontroler, przekierowanie na: <$this->default_controller>\n" );
                $this->redirect($this->default_controller); // [200] OK
//                $_SESSION["mistake_counter"] += 1;
                break;
            default:
                echo "correct</br>";
                log::logging("FrontController/ poprawny kontroler\n" );
                if(!$this->check_log() && $params[0] !== "Auth") {
                    log::logging("FrontController/ nie zalogowany lub nie autoryzuje, przekierowanie na <Auth>\n" );
                    $this->redirect("Auth");
//                    $_SESSION["unlogged_counter"] += 1;
                }
                else {
                    $this->name_controller = $controller;
                    $this->params = array_slice($params, 1);
                    log::logging("FrontController/ zalogowany lub autoryzuje, kontroler: <$this->name_controller>, parametry: <".log::varb($this->params));
                }
        }

    }

    public final function execute(){
        echo "execute controller: ";
        var_dump($this->name_controller);
        echo "</br>";
        return new $this->name_controller($this->params);
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

    private function valid_controller($exp_url){
        if($exp_url[0] === "")
            return "not_specified";
        else if(array_search($exp_url[0], $this->controlers) === false)
            return "not_exist";
        else
            return $exp_url[0];
    }

}