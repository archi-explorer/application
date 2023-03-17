<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit(1);
}

if (empty($_POST['login']) || empty($_POST['psw'])) {
    exit(1);
}

$login = htmlspecialchars($_POST['login']);
$psw = htmlspecialchars($_POST['psw']);

// echo ($login . ' ' . $psw . '<br>');

require_once('../bdd-model/User.php');

$user = new User($login, "", $psw, "", "");

try {
    if (!$user->exists()) {
        exit(1);
    }

    echo json_encode("true");
} catch (PDOException $e) {
    exit(1);
} catch (Exception $e) {
    exit(1);
}

try {
    $role = $user->getRole();
    $_SESSION['role'] = $role;
} catch (Exception $e) {
    echo ($e->getMessage());
}
