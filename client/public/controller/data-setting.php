<?php

session_start();

include("./headers.php");
include('./guiNames.php'); 
include('./panoFile.php');
include('./panoCoord.php');

if($_SERVER['REQUEST_METHOD'] != 'GET') {
    echo "Error! You can't access this page.";
    exit();
}

if(!isset($_GET['path'])) {
    echo "There is no path set.";
    exit();
}

$path = htmlspecialchars($_GET['path']);
$_SESSION['model'] = $path;

$names = guiNames($path);
$pano = panoFile($path);
$coord = panoCoord($path);

$json = array('modelNames' => $names, 'pano' => $pano, 'coord' => $coord);
echo json_encode($json);
