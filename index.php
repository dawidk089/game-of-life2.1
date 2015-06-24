<?php

include_once "appl/PrepareClass.php";

new PrepareClass(array(
    "/",
    "appl/",
    "auth/",
    "login/",
    "testy/",
));

$front_controller = new FrontController();
$front_controller->execute();