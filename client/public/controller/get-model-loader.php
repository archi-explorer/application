<?php

session_start();

include("./headers.php");

if($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(false);
    exit();
}

echo json_encode($_SESSION['modelURL']);