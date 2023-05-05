<?php

session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

// if ($_SESSION['role'] != "admin")
//     exit(1);

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    echo ("meth");

$login = htmlspecialchars($_POST['uname']);
$nPsw = htmlspecialchars($_POST['newPsw']);

require_once('model/User.php');

$user = new User($login, "", $nPsw, "", "");

try {
    if (!$user->updatePsw()) {
        echo json_decode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (Exception $e) {
    echo $e->getMessage();
}
