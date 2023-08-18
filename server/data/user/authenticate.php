<?php

session_start();
include("./headers.php");


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit(1);
}

if (empty($_POST['login']) || empty($_POST['psw'])) {
    exit(1);
}

$login = htmlspecialchars($_POST['login']);
$psw = htmlspecialchars($_POST['psw']);

require_once('model/User.php');

$user = new User($login, "", $psw, "", "");

try {
    if (!$rid = $user->exists()) {
        echo json_encode("doesn't exist");
        exit(1);
    }

    $uname = $user->getUname();

    $res = array('status' => true, 'user' => $login, 'uname' => $uname, 'rid' => $rid);

    try {
        require_once('model/Role.php');

        $role = new Role($rid);

        if ($rname = $role->getRoleName()) {
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
