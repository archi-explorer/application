<?php

session_start();
include("./headers.php");


require_once('model/Model.php');

$model = new Model();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Que des GET request possibles']);
    exit();
}

if (!isset($_GET['rid'])) {
    echo json_encode(['error' => 'rid manquant']);
    exit();
}

$rid = htmlspecialchars($_GET['rid']);

try {
    if (!$modelList = $model->getAllModel($rid)) {
        echo json_encode("1"); //['error' => 'Aucun modèle trouvé']
        exit(1);
    }

    echo json_encode($modelList);
    //exit(0);
} catch (Exception $e) {
    echo $e->getMessage();
}
