<?php

// Routes client

$router->map('GET', '/', 'welkome');
$router->map('GET', '/welkome', 'welkome', 'welkome');
$router->map('GET', '/login', 'login', 'login');
$router->map('GET', '/account', 'account', 'account');
$router->map('GET', '/admin', 'admin', 'admin');
$router->map('GET', '/contact', 'contact', 'contact');
$router->map('GET', '/model-chooser', 'model-chooser', 'model-chooser');
$router->map('GET', '/model-viewer/[*:model]', 'model-viewer/model', 'model-viewer');

// Route users

$router->map('GET', '/get-users', 'user/get-users');
$router->map('GET', '/get-uname', 'user/get-uname');
$router->map('GET', '/signout', 'user/signout');

$router->map('POST', '/authenticate', 'user/authenticate');
$router->map('POST', '/add-user', 'user/add-user');

$router->map('PUT', '/update-user', 'user/update-user');
$router->map('PUT', '/update-psw', 'user/update-psw');

$router->map('DELETE', '/delete-user', 'user/delete-user');

// Route modèle

$router->map('GET', '/get-model', 'model/get-model');
$router->map('GET', '/get-data-model', 'model/get-data-model');

$router->map('POST', '/add-model', 'model/add-model');
$router->map('POST', '/set-model', 'model/set-model');

$router->map('PUT', '/update-model', 'model/update-model');

$router->map('DELETE', '/delete-model', 'model/delete-model');

try {
    include './controller/client-ctrl.php';
} catch (Exception $e) {
    echo "No matching routes";
}

try {
    include './controller/server-ctrl.php';
} catch (Exception $e) {
    echo "No matching routes";
}
