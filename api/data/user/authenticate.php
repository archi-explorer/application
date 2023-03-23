<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

echo "start<br/>";

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit(1);
}

echo "passed1<br/>";

if (empty($_POST['login']) || empty($_POST['psw'])) {
    exit(1);
}

echo "passed2<br/>";

$login = htmlspecialchars($_POST['login']);
$psw = htmlspecialchars($_POST['psw']);

echo "passed3<br/>";

echo ($login . ' ' . $psw . '<br/>');

require_once('../api/data/bdd/User.php');

echo "passed4<br/>";

$user = new User($login, "", $psw, "", "");


try {
    if (!$user->exists()) {
        echo json_encode("doesn't exist");
        exit(1);
    }

    echo json_encode("true");
} catch (PDOException $e) {
    echo json_encode("pdo exception");
    exit(1);
} catch (Exception $e) {
    echo json_encode("exception");
    exit(1);
}

// try {
//     $role = $user->getRole();
//     $_SESSION['role'] = $role;
// } catch (Exception $e) {
//     echo ($e->getMessage());
// }
