<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    exit(1);

if (empty($_POST['mid']))
    exit(1);

require_once('model/Model.php');
$model = new Model();

$mid = htmlspecialchars($_POST['mid']);


try {
    if (!$model->deleteModel($mid)) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (PDOException $e) {
    echo ("pdo" . $e->getMessage());
} catch (Exception $e) {
    echo ("exception" .$e->getMessage());
}
