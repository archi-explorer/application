<?php

session_start();
include("./headers.php");


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    echo json_encode("Not a POST request.");
    exit(1);
}

if($_POST['rid'] == null || $_POST['new_rname'] == null) {
    echo json_encode("Role id or new role name is null. POST request failed.");
    exit(1);
}

$_rid = htmlspecialchars($_POST['rid']);
$new_rname = htmlspecialchars($_POST['new_rname']);

require_once('model/Role.php');

$role = new Role($_rid, $new_rname);

try {
    $role = $role->updateRole();
    echo json_encode($role);
} catch (PDOException $e) {
    exit(1);
} catch (Exception $e) {
    exit(1);
}
