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
    "model/",
    "automaton/",
    "list/"
));


//log::logging("\n");
//log::logging("\n");
//log::logging("\n");
log::logging("NOWE WYWOLANIE INDEX, wywoluje FrontController\n");

echo "To nie jest jeszcze wersja skończona.";


$front_controller = new FrontController();
$front_controller->execute();

