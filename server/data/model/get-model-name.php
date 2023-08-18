<?php

session_start();
include("./headers.php");


require_once('model/Model.php');

$model = new Model();


if($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Que des GET request possibles']);
    exit();
}



if(!isset($_GET['mid'])){
    echo json_encode(['error' => 'mid manquant']);
    exit();
}

$mid = htmlspecialchars($_GET['mid']);
// echo json_encode(['mid' => $mid]);

try {
    if (!$modelName = $model->getModelNameById($mid)) {
        echo json_encode("1"); //['error' => 'Aucun modèle trouvé']
        exit(1);
    }
    
    echo json_encode($modelName);
} catch (Exception $e) {
    echo $e->getMessage();
}
