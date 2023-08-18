<?php

session_start();
header('Access-Control-Allow-Origin: *');

if($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Que des GET request possibles']);
    exit();
}

if(!isset($_SESSION['user'])) {
    echo json_encode(['error' => 'L\'utilisateur n\'est pas connecté']);
    exit();
}

session_destroy();
exit();
