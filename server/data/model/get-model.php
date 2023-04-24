<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

// if ($_SESSION['user'])
//     exit(1);

require_once('model/Model.php');

$model = new Model();

if ($_SESSION['rname'] !== 'admin') {
}

try {
    if (!$modelList = $model->getAllModel()) {
    }

    echo json_encode($modelList);
    exit(0);
} catch (Exception $e) {
}
