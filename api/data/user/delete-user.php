<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

if ($_SESSION['role'] != "admin")
    exit(1);

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);

if (empty($_POST['uname']))
    exit(1);

$login = htmlspecialchars($_POST['uname']);

require_once('model/User.php');

$user = new User($login, "", "", "", "", "");

try {
    if (!$user->deleteUser()) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (Exception $e) {
    exit(1);
}
