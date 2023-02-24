<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

$user_in_db = true;
$meth = true;
$role = "";

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    $user_in_db = false;
    $meth = false;
    json($meth, $user_in_db, $role);
    exit(1);
}

if (empty($_POST['login']) || empty($_POST['psw'])) {
    $user_in_db = false;
    json($meth, $user_in_db, $role);
    exit(1);
}

$login = htmlspecialchars($_POST['login']);
$psw = htmlspecialchars($_POST['psw']);

// echo ($login . ' ' . $psw . '<br>');

require_once('../bdd-model/User.php');

$user = new User($login, "", $psw, "", "");

try {
    if (!$user->exists()) {
        // echo ("no user");
        $user_in_db = false;
        json($meth, $user_in_db, $psw);
        exit(1);
    }
} catch (PDOException $e) {
    echo ($e->getMessage());
    $user_in_db = false;
    json($meth, $user_in_db, $psw);
    exit(1);
} catch (Exception $e) {
    echo ($e->getMessage());
    $user_in_db = false;
    json($meth, $user_in_db, $psw);
    exit(1);
}

try {
    $role = $user->getRole();
    $_SESSION['role'] = $role;
} catch (Exception $e) {
    // echo ($e->getMessage());
}

$_SESSION['user'] = $uname;

// echo "<script>console.log('Console: '" . $_SESSION['user'] . ");</script>";

json($meth, $user_in_db, $role);

function json(bool $meth, bool $res, string $role)
{
    $json = array('method' => $meth, 'exist' => $res, 'role' => $role);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($json);
}
