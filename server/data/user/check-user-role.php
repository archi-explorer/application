<?php

session_start();
include("./headers.php");


if ($_SERVER['REQUEST_METHOD'] != 'POST')
    exit(1);    

if (!isset($_POST['role']))
    exit(1);

$role = htmlspecialchars($_POST['role']);

require_once('model/User.php');

$user = new User($null, "", "", $role, "");

try {
    if(!$user->checkIfRoleIsAssigned()){
        echo json_encode(false);
        exit(1);
    }
    echo json_encode(true);
} catch (Exception $e) {
    echo $e->getMessage();
}
