<?php

interface Rest{
    public function get(Array $params);
    public function post(Array $params);
    public function put(Array $params);
    public function delete(Array $params);
}