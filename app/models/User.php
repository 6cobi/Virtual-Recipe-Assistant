<?php

namespace app\models;

class User extends Model {

    protected $table = 'history';

    public function getAllUsers() {
        return $this->findAll();
    }

    public function savePost($inputData){
        $query = "insert into history (content) values (:content);";
        return $this->fetchAllWithParams($query, $inputData);
    }
}


