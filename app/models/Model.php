<?php

namespace app\models;
use PDO;
use PDOException;

abstract class Model {

    public function fetchAllWithParams($query, $data = []) {
        $connection = $this->connect();
        //prepare statement -
        $statementObject = $connection->prepare($query);
        //data needs
        $successOrFail = $statementObject->execute($data);
        if ($successOrFail) {
            $result = $statementObject->fetchAll(PDO::FETCH_OBJ);
            if (is_array($result) && count($result)) {
                return $result;
            }
        }
        return false;
    }

    public function findAll() {
        $query = "select * from $this->table";
        return $this->query($query);
    }

    private function connect() {

        $type = 'mysql';
        $port = '8889';
        $charset = 'utf8mb4';

//      some of these are optional
        $dsn = "$type:hostname=" . DBHOST .";dbname=" . DBNAME . ";port=$port;charset=$charset";

        $options = [
            //we can set the error mode, to throw exceptions or PDO type errors
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            //set the default fetch type
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];

        try {
            return new PDO($dsn, DBUSER, DBPASS, $options);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), $e->getCode());
        }

    }

    public function query($query, $data = []) {
        $con = $this->connect();
        $stm = $con->prepare($query);
        $check = $stm->execute($data);
        if ($check) {
            $result = $stm->fetchAll(PDO::FETCH_OBJ);
            if (is_array($result) && count($result)) {
                return $result;
            }
        }
        return false;
    }

}

