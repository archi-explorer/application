<?php

// Route users

$router->map('GET', '/', function () {
    echo "Cette page est inaccessible";
});

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

// Route Rôle

$router->map('POST', '/get-role', 'role/get-role');

$router->map('GET', '/get-var', 'get-var');

require './controller/api-ctrl.php';
