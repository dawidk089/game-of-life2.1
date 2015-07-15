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
        $view = new View(
            array(

            ),
            array(
                "title" => "Game of life -- Symulator automatu komórkowego",
                "status" => '',
                "csss" => array(

                ),
                "jss" => array(
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
}
