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
));

log::logging("NOWE WYWOLANIE INDEX\n");
log::logging("index, wywoluje FrontController\n");

echo "To nie jest jeszcze wersja skończona.";

$front_controller = new FrontController();
log::logging("koniec wywolania FrontController'a, wywoluje execute FrontController'a\n");
$front_controller->execute();


//$conn = new Mongo("mongodb://3karminski:pass@pascal.fis.agh.edu.pl/3karminski");
//$dbase = $conn->selectDB("3karminski");
//$coll = $dbase->selectCollection("users");
//
//$cursor = $coll->find();
//foreach ( $cursor as $obj ) {
//	//var_dump($obj['_id']); echo "</br>";
//	var_dump($obj['name']); echo "</br>";
//}
//

//$users_data = new BaseModel('users');
//$users_data->main();

