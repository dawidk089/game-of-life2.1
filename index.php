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

log::logging("NOWE WYWOLANIE INDEX, wywoluje FrontController\n");

$front_controller = new FrontController();
$front_controller->execute();

