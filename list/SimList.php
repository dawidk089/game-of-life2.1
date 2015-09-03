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
        $simulations = null;
        $type = $params['get']['params'][0];
        if($type === 'simulations'){
            log::logging("SimList/ get/ simulations\n");
            $list = $this->own_simlist();
        }
        elseif($type === 'records'){
            log::logging("SimList/ get/ records\n");
            $list = $this->users_simlist();
        }

        $view = new View(
            array(
                "template/simulation_list.phtml"
            ),
            array(
                "title" => "Game of life -- Symulator automatu komórkowego",
                "simulations" => $list,
                "csss" => array(
                    "appl/css/main.css",
                    "list/css/SimList.css",
                "type" => $type
                ),
                "jss" => array(
                    "jquery_js/jquery.js",

                    "list/js/draw.js",
                    //"list/js/graph.js",
                    "list/js/form.js",
                    "list/js/init.js"
                )
            )
        );
        $view->show();
    }

    public function post(Array $params)
    {
        log::logging("List/ post\n");
        log::logging("List/ post/ ajax: ".log::varb($params));
        switch($this->prepare_params()['get']['params'][0]){
            case 'delete_simulation':
                $this->delete_simulation();
                break;
            case 'draw_graph':
                $this->amount_history($this->prepare_params()['post']['id']);
                break;
        };
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
        //zalezy czy w bazie danych wpisy sa sortowane

        log::logging("SimList/ users_simlist/\n");
        $db = new BaseModel('users');
        $users = $db->read(array());
        log::logging("SimList/ users_simlist/ users_count: ".count($users)."\n");
        $simulations = array();
        foreach($users as $user){
            foreach($user['simulation'] as $simulation){
                log::logging("SimList/ users_simlist/ simulation ".log::varb($simulation));
                $users_simulation = $simulation;
                $users_simulation['user'] = $user['nick'];
                $simulations[] = $users_simulation;
            }
            //simulations[] = $user['simulation'];
        }
        return $simulations;
    }

    private function delete_simulation(){
        $id = $this->prepare_params()['ajax']['id'];
        log::logging("SimList/ delete_simulation/ id: ".log::varb($id));
        $db = new BaseModel('users');
        $db->delete($id-1);
    }

    private function amount_history($id){
        $db = new BaseModel('users');
        $user = $db->read(array('nick'=>$_SESSION['logged']))[0];
        $simulation = $user['simulation'][$id-1]['data'];
        $y = array();

        for($k=0; $k<count($simulation); ++$k) {
            $y[$k] = 0;
            for ($i = 0; $i < count($simulation[0]); ++$i)
                for ($j = 0; $j < count($simulation[0][0]); ++$j)
                    if($simulation[$k][$i][$j])
                        ++$y[$k];
        }
        echo json_encode($y);
    }
}
