<?php

class log{

    static public function logging($str)
    {
        $handle = fopen("log.txt", "a+");
        if ($handle === false)
            echo "nie otwarto pliku log </br>";
        else {
            $data = date("Y-m-d");
            $czas = date("H:i:s");
            fwrite($handle, $data . " " . $czas . " >" . $str);
            fclose($handle);
        }
    }

    static public function varb($var){
        ob_start();
        var_dump($var);
        return ob_get_clean();
    }


}
