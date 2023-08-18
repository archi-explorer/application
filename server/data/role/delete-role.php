<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode("Not a POST request.");
    exit(1);
}

if($_POST['rid'] == null) {
    echo json_encode("Role id is null. POST request failed.");
    exit(1);
}

$_rid = htmlspecialchars($_POST['rid']);

require_once('model/Role.php');

$role = new Role($_rid, "");

try {
    $res = $role->deleteRole();
    echo json_encode($res);
} catch (PDOException $e) {
    exit(1);
} catch (Exception $e) {
    exit(1);
}
