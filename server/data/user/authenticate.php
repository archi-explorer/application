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

require_once('model/User.php');

$user = new User($login, "", $psw, null, "");

try {
    if (!$rid = $user->exists()) {
        echo json_encode("doesn't exist");
        exit(1);
    }

    $res = array('status' => true, 'user' => $login);

    $_SESSION['user'] = $login;

    if ($email = $user->getEmailFromId()) {
        // echo 'Email in auth: ' . ($email) . '</br>';
        $res += ['email' => $email];

        $_SESSION['email'] = $email;
    }

    try {
        require_once('model/Role.php');

        $role = new Role($rid);

        if ($rname = $role->getRoleName()) {
            $_SESSION['role'] = $rname['rname'];
            $res += ['role' => $rname['rname']];
        }
    } catch (Exception $e) {
        exit(1);
    }

    echo json_encode($res);
} catch (PDOException $e) {
    echo json_encode($e);
    exit(1);
} catch (Exception $e) {
    echo json_encode($e);
    exit(1);
}
