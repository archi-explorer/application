<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode("méthode", $_POST['model']);
    exit(1);
}

if (empty($_POST['model'])) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode("données post");
    exit(1);
}

$_SESSION['model'] = htmlspecialchars($_POST['model']);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($_SESSION['model']);
