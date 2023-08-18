<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);

if (!isset($_POST['login']) || !isset($_POST['newName']) || !isset($_POST['newRole']) || !isset($_POST['newEmail']))
    exit(1);

$login = htmlspecialchars($_POST['login']);
$newName = htmlspecialchars($_POST['newName']);
$newRole = htmlspecialchars($_POST['newRole']);
$newEmail = htmlspecialchars($_POST['newEmail']);

require_once('model/User.php');

$user = new User($login, $newName, "", $newRole, $newEmail);

try {
    if (!$user->updateUser($login)) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (Exception $e) {
    echo $e->getMessage();
}
