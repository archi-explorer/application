<?php

session_start();

include("./headers.php");


if($_SERVER['REQUEST_METHOD'] != 'GET') {
    exit(1);
}

require_once('model/User.php');

$user = new User("", "", "", "", "");

try {
    $users = $user->getUsers();
    echo json_encode($users);
} catch (Exception $e) {
    echo $e->getMessage();
}
