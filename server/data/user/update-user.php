<?php

session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');


// if ($_SESSION['role'] != "admin")
//     exit(1);

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);

$login = htmlspecialchars($_POST['uname']);
$newLogin = htmlspecialchars($_POST['newUname']);
$newRole = htmlspecialchars($_POST['newRole']);
$newEmail = htmlspecialchars($_POST['newEmail']);

require_once('model/User.php');

$user = new User($newLogin, $newLogin, "", $newRole, $newEmail);

try {
    if (!$user->updateUser($login)) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (Exception $e) {
    echo $e->getMessage();
}
