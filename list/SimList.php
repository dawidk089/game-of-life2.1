<?php

class SimList extends FrontController implements Rest{

    private $params = null;
    private $rest_method = null;

    public function __construct($params)
    {
        log::logging("SimList/ __construct\n");
        $this->params = explode('/', $_GET['target']);
        $this->rest_method = strtolower($_SERVER['REQUEST_METHOD']);
        switch ($this->rest_method) {
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


    public function get(Array $params)
    {
        log::logging("SimList/ get\n");
        $list = null;
        if($params['get']['params'][0] === 'simulations'){
            log::logging("SimList/ get/ simulations\n");
            $list = $this->own_simlist();
        }
        elseif($params['get']['params'][0] === 'records'){
            log::logging("SimList/ get/ records\n");
        }

        $view = new View(
            array(
                "template/simulation_list.phtml"
            ),
            array(
                "title" => "Game of life -- Symulator automatu komórkowego",
                "status" => '',
                "simulations" => $list,
                "amount" => count($list),
                "csss" => array(
                    "appl/css/main.css",
                    "list/css/SimList.css"
                ),
                "jss" => array(
                    "jquery_js/jquery.js",
                    "list/js/draw.js"//,
                    //"list/js/init.js"
                )

            )
        );
        $view->show();
    }

    public function post(Array $params)
    {
        log::logging("List/ post\n");
    }

    public function put(Array $params)
    {
        log::logging("List/ put\n");
    }

    public function delete(Array $params)
    {
        log::logging("List/ delete\n");
    }

    private function own_simlist(){
        $db = new BaseModel('users');
        $user = $db->read(array('nick'=>$_SESSION['logged']))[0];
        return $user['simulation'];
    }

    private function users_simlist(){

    }
}
