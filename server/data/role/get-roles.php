<?php

session_start();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
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
