<?php

// Route users

$router->map('GET', '/', function () {
    echo "Cette page est inaccessible";
});

$router->map('GET', '/get-users', 'user/get-users');
$router->map('GET', '/signout', 'user/signout');


$router->map('POST', '/authenticate', 'user/authenticate');
$router->map('POST', '/add-user', 'user/add-user');
$router->map('POST', '/send-email', 'user/send-email');
$router->map('POST', '/retrive-password', 'user/retrive-psw');

$router->map('POST', '/update-user', 'user/update-user');
$router->map('POST', '/update-psw', 'user/update-psw');
$router->map('POST', '/update-user-role', 'user/update-user-role');
$router->map('POST', '/update-user-username', 'user/update-user-username');
$router->map('POST', '/update-user-email', 'user/update-user-email');

$router->map('POST', '/check-user-role', 'user/check-user-role');

$router->map('POST', '/delete-user', 'user/delete-user');

// Route modèle

$router->map('GET', '/get-model', 'model/get-model');
$router->map('GET', '/get-data-model', 'model/get-data-model');
$router->map('GET', '/get-model-name', 'model/get-model-name');

$router->map('POST', '/add-model', 'model/add-model');
$router->map('POST', '/set-model', 'model/set-model');

$router->map('PUT', '/update-model', 'model/update-model');

$router->map('POST', '/delete-model', 'model/delete-model');

// Route Rôle

$router->map('POST', '/get-role', 'role/get-role');
$router->map('GET', '/get-roles', 'role/get-roles');

$router->map('POST', '/add-role', 'role/add-role');
$router->map('POST', '/delete-role', 'role/delete-role');
$router->map('POST', '/update-role', 'role/update-role');


// Route Access

$router->map('GET', '/get-access', 'access/get-access');
$router->map('POST', '/add-access', 'access/add-access');
$router->map('POST', '/delete-access', 'access/delete-access');


require './controller/api-ctrl.php'; //1 seul par router
