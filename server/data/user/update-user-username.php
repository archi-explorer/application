<?php

session_start();
include("./headers.php");



if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);    

if(!isset($_POST['login']) || !isset($_POST['newName']))
    exit(1);

$login = htmlspecialchars($_POST['login']);
$newName = htmlspecialchars($_POST['newName']);

require_once('model/User.php');

$user = new User($login, $newName, "", "", "");

try {
    if(!$user->updateName()){
        echo json_encode(false);
        exit(1);
    }
    echo json_encode(true);
} catch (Exception $e) {
    echo $e->getMessage();
}
