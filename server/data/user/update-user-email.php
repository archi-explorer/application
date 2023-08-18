<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);  
    
if(!isset($_POST['login']) || !isset($_POST['newEmail']))
    exit(1);

$login = htmlspecialchars($_POST['login']);
$newEmail = htmlspecialchars($_POST['newEmail']);

require_once('model/User.php');

$user = new User($login, "", "", "", $newEmail);

try {
    if(!$user->updateEmail()){
        echo json_encode(false);
        exit(1);
    }
    echo json_encode(true);
} catch (Exception $e) {
    echo $e->getMessage();
}
