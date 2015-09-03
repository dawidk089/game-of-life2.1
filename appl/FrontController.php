<?php

// glowny kontroler, ktory ma pierwszy kontakt z przychodzacym zadaniem
class FrontController
{
    private $controlers = array(
        "Main",
        "Auth",
        "BaseModel",
        "Automaton",
        "SimList",
        "About"
    );
    private $default_controller = "Main";
    private $rest_method = null;
    private $name_controller = null;
    private $params = null;

    public function __construct(){
        // rozpoznanie metody
        // rozpoznanie kontrolera
        // rozpoznanie parametrow

        // pobranie metody
        $this->rest_method = strtolower($_SERVER['REQUEST_METHOD']);
        //log::logging("FrontController/ pobranie rest_method: $this->rest_method \n");

        $this->params = $this->prepare_params();
        //log::logging("FrontController/ pobrane parametry: ".log::varb($this->params));

        // obsluga interpretacja otrzymanych danych -- get, post, ajax

        log::logging("FrontController/ pobrany kontroler: ".log::varb($this->params['get']['controller']));
        switch ($controller = $this->valid_controller($this->params['get']['controller'])) {
            case "not_specified":
            case "not_exist":
                log::logging("FrontController/ nie podany lub nie istniejacy kontroler, przekierowanie na: <$this->default_controller>\n" );
                $this->redirect($this->default_controller);
                break;
            default:
                log::logging("FrontController/ poprawny kontroler\n" );
                if(!$this->check_log() && $this->params['get']['controller'] !== "Auth") {
                    log::logging("FrontController/ nie zalogowany lub nie autoryzuje, przekierowanie na <Auth>\n" );
                    $this->redirect("Auth");
                    return;
                }
                else if($this->check_log() && $this->params['get']['controller'] === "Auth" && $this->params['get']['params'][0] !== 'logout'){
                    log::logging("FrontController/ zalogowany, przekierowanie na <Main>\n" );
                    $this->redirect("Main");
                    return;
                }
                else {
                    $this->name_controller = $controller;
                    log::logging("FrontController/ zalogowany lub autoryzuje, kontroler: <$this->name_controller>\n"/*, parametry: ".log::varb($this->params)*/);
                }
        }
        log::logging("FrontController/ __construct/ koniec\n");
    }

    public final function execute(){
        log::logging("FrontController/ execute/ wywolywanie konstruktora klasy $this->name_controller, z parametrami: ".log::varb($this->params));
        return new $this->name_controller($this->params);
    }

    // sprawdzanie czy zalogowany
    protected function check_log(){
        if(!isset($_SESSION["logged"]))
            return false;
        else return true;
    }

    protected function redirect($ulr=""){
        log::logging("FrontController/ redirect/ przekierowanie na: Location: ".appl_path::$appl_path.$ulr."\n");
        header("Location: ".appl_path::$appl_path.$ulr);
    }

    private function valid_controller($controller){
        if($controller === "") {
            log::logging("FrontController/ valid_controller/ zauwazyl pusty \$_GET\n");
            return "not_specified";
        }
        else if(array_search($controller, $this->controlers) === false)
            return "not_exist";
        else
            return $controller;
    }

    protected function prepare_params(){

        $get_dict = [];
        $ajax_dict = [];

        $ajax_data = file_get_contents('php://input');
        $ajax_data = urldecode($ajax_data);

        log::logging("FrontController/ prepare_param/ \$_GET: ".log::varb($_GET));

        if(!isset($_GET['target'])){
            log::logging("FrontController/ prepare_param/ w url'u nie ma target'a\n");
            //http_response_code(404);
            $this->redirect("Auth");
            die();
        }

        log::logging("FrontController/ prepare_param/ w url'u jest target\n");
        $arr_url = explode('/', $_GET['target']);
        log::logging("FrontContorller/ prepare_params/ \$arr_url: ".log::varb($arr_url));
        $get_dict['controller'] = $arr_url[0];
        $get_dict['params'] = array_slice($arr_url, 1);

        foreach (explode('&', $ajax_data) as $val) {
            $arr_ajax = explode('=', $val);
            $ajax_dict[$arr_ajax[0]] = json_decode($arr_ajax[1]);
        }

        $dict = array(
            'get' => $get_dict,
            'post' => $_POST,
            'ajax' => $ajax_dict
        );

        return $dict;
    }

}
