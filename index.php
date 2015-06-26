<?php

session_start();

require_once "appl/PrepareClass.php";

new PrepareClass(array(
    "./",
    "appl/",
    "auth/",
    "login/",
    "testy/",
    "simulator/",
));

log::logging("\n");
log::logging("index, wywoluje FrontController\n");

$front_controller = new FrontController();
log::logging("koniec wywolania FrontController'a, wywoluje execute FrontController'a\n");
$front_controller->execute();
