<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);

if (empty($_POST['login']) || empty($_POST['uname']) || empty($_POST['psw'] || empty($_POST['role']) || empty($_POST['email'])))
    exit(1);

$login = htmlspecialchars($_POST['login']);
$uname = htmlspecialchars($_POST['uname']);
$psw = htmlspecialchars($_POST['psw']);
$role = htmlspecialchars($_POST['role']);
$email = htmlspecialchars($_POST['email']);

require_once('model/User.php');

$user = new User($login, $uname, $psw, $role, $email);

try {
    if (!$user->create()) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (PDOException $e) {
    echo ("pdo" . $e->getMessage());
} catch (Exception $e) {
    echo ("exception" . $e->getMessage());
}
