<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit(1);
}

if (empty($_POST['rid'])) {
    exit(1);
}

$_rid = htmlentities($_POST['rid']);

require_once('model/Role.php');

$role = new Role($_rid);

try {
    if (!$rname = $role->getRoleName()) {
        exit(1);
    }

    $res = array('rname' => $rname['rname']);

    echo json_encode($res);
} catch (PDOException $e) {
    exit(1);
} catch (Exception $e) {
    exit(1);
}
