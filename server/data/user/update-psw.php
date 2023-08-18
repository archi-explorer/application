<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);

if(!isset($_POST['login']) || !isset($_POST['newPsw']))
    exit(1);

$login = htmlspecialchars($_POST['login']);
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
