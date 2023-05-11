<?php

session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit(1);
}

$rname = htmlentities($_POST['rname']);

require_once('model/Role.php');

$role = new Role(null, $rname);

try {
    $res = $role->addNewRole();
    echo json_encode($res);
} catch (PDOException $e) {
    exit(1);
} catch (Exception $e) {
    exit(1);
}
