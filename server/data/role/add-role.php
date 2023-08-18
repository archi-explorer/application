<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode("Not a POST request.");
    exit(1);
}

if ($_POST['rname'] == null) {
    echo json_encode("Role name is null. POST request failed.");
    exit(1);
}

$rname = htmlspecialchars($_POST['rname']);

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
