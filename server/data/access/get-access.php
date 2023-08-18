<?php

session_start();
include("./headers.php");

require_once('model/Access.php');

$access = new Access();

if($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Que des GET request possibles']);
    exit();
}

if(!isset($_GET['mid'])){
    echo json_encode(['error' => 'mid manquant']);
    exit();
}

$mid = htmlspecialchars($_GET['mid']);

try {
    if (!$roleList = $access->getAllRole($mid)) {
        echo json_encode("1"); //['error' => 'Aucun access trouvé']
        exit(1);
    }
    
    echo json_encode($roleList);
} catch (Exception $e) {
    echo $e->getMessage();
}
