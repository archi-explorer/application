<?php

session_start();
include("./headers.php");


if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    echo json_encode("Not a GET request.");
    exit(1);
}

require_once('model/Role.php');

$role = new Role("", "");

try {
   
   $roles = $role->getRoles();
    echo json_encode($roles);
} catch (PDOException $e) {
    exit(1);
} catch (Exception $e) {
    exit(1);
}
