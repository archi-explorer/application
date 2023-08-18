<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);

if (empty($_POST['login']))
    exit(1);

$login = htmlspecialchars($_POST['login']);

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
