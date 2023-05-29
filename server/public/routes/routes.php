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
$router->map('POST', '/send-email', 'user/send-email'); //new route for email
$router->map('POST', '/retrive-password', 'user/retrive-password');

$router->map('POST', '/update-user', 'user/update-user');
$router->map('POST', '/update-psw', 'user/update-psw');

$router->map('POST', '/delete-user', 'user/delete-user');

// Route modèle

$router->map('GET', '/get-model', 'model/get-model');
$router->map('GET', '/get-data-model', 'model/get-data-model');

$router->map('POST', '/add-model', 'model/add-model');
$router->map('POST', '/set-model', 'model/set-model');

$router->map('PUT', '/update-model', 'model/update-model');

$router->map('DELETE', '/delete-model', 'model/delete-model');

// Route Rôle

$router->map('POST', '/get-role', 'role/get-role');


require './controller/api-ctrl.php'; //1 seul par router
