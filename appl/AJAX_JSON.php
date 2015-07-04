<?php

class AJAX_JSON{
    public $dict = array();
    public function __construct($ajax){
        foreach(explode('&', $ajax) as $val){
            $dict = explode('=', $val);
            $this->dict[$dict[0]] = json_decode($dict[1]);
        }
    }
}