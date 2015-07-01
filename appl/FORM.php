<?php

class FORM{
    public $dict = array();
    public function __construct($post){
        foreach(explode('&', $post) as $val){
            $dict = explode('=', $val);
            $this->dict[$dict[0]] = $dict[1];
        }
    }
}