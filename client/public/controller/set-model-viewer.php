<?php 

session_start();

include("./headers.php");

if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(false);
    exit();
}

if(!isset($_POST['modelURL'])) {
    echo json_encode(false);
    exit();
}

$url = htmlspecialchars($_POST['modelURL']);

$_SESSION['modelURL'] = $url;

echo json_encode(true);