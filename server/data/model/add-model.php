<?php

session_start();
include("./headers.php");


if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    exit(1);

if (empty($_POST['mname']) || empty($_POST['city']) || empty($_POST['extension'])) 
    exit(1);

require_once('model/Model.php');

$mname = htmlspecialchars($_POST['mname']);
$city = htmlspecialchars($_POST['city']);
$extension = htmlspecialchars($_POST['extension']);

$model = new Model(null, $mname, $city, $extension);

try {
    $res = $model->addModel();

    if (!$res) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode($res);
} catch (PDOException $e) {
    echo ("pdo" . $e->getMessage());
} catch (Exception $e) {
    echo ("exception" .$e->getMessage());
}
