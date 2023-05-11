<?php

session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');


if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);    

$login = htmlspecialchars($_POST['login']);
$newRole = htmlspecialchars($_POST['newRole']);

require_once('model/User.php');

$user = new User($login, "", "", $newRole, "");

try {
    if(!$user->updateUserRoleById()){
        echo json_encode(false);
        exit(1);
    }
    echo json_encode(true);
} catch (Exception $e) {
    echo $e->getMessage();
}
