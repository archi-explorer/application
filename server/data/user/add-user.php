<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

// if ($_SESSION['role'] != "admin")
//     exit(1);

if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);

if (empty($_POST['login']) || empty($_POST['psw'] || empty($_POST['role']) || empty($_POST['email'])))
    exit(1);

$login = htmlspecialchars($_POST['login']);
$name = htmlspecialchars($_POST['login']);
$psw = htmlspecialchars($_POST['psw']);
$role = htmlspecialchars($_POST['role']);
$email = htmlspecialchars($_POST['email']);

require_once('model/User.php');

$user = new User($login, $name, $psw, $role, $email);

try {
    if (!$user->create()) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (PDOException $e) {
    echo ("pdo" . $e->getMessage());
} catch (Exception $e) {
    echo ("exception" .$e->getMessage());
}
