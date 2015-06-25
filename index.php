<?php

//function check_log(){
//    if(!isset($_SESSION["logged"]))
//        return false;
//    else return true;
//}
//
//$_SESSION["XDEBUG_SESSION"] = 1;

session_start();
//if(!isset($_SESSION["mistake_counter"]))
//    $_SESSION["mistake_counter"] = 0;
//if(!isset($_SESSION["counter"]))
//    $_SESSION["counter"] = 0;
//if(!isset($_SESSION["unlogged_counter"]))
//    $_SESSION["unlogged_counter"] = 0;
//if(isset($_SESSION["counter"]))
//    $_SESSION["counter"] += 1;
//else
//    $_SESSION["counter"] = 0;

include_once "appl/PrepareClass.php";

new PrepareClass(array(
    "/",
    "appl/",
    "auth/",
    "login/",
    "testy/",
    "simulator/",
));



//if($_SESSION["counter"]<10) {
        $front_controller = new FrontController();
        echo "uruchamianie kontrolera </br>";
        $front_controller->execute();
//}

//echo "dobilo do infinity</br>";
//echo "mistake coutner: ", $_SESSION["mistake_counter"], "</br>";
//echo "unlogged coutner: ", $_SESSION["unlogged_counter"], "</br>";
//echo "coutner: ", $_SESSION["counter"], "</br>";
//echo "check log: "; var_dump(check_log()); echo "</br>";
