<?php

include_once "appl/Prepare_class.php";

new PrepareClass(array(
    "/",
    "appl/",
    "auth/",
    "login/",
    "testy/",
));

$front_controller = new FrontController();
$front_controller->execute();