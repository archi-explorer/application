<?php

// Route users

$router->map('GET', '/get-users', 'get-users');
$router->map('GET', '/get-uname', 'get-uname');
$router->map('GET', '/signout', 'signout');

$router->map('POST', '/authenticate', 'authenticate');
$router->map('POST', '/add-user', 'add-user');

$router->map('PUT', '/update-psw', 'update-psw');
$router->map('PUT', '/update-user', 'update-user');

$router->map('DELETE', '/delete-user', 'deluser');

// Route modèle

$router->map('GET', '/get-model', 'get-model');
$router->map('GET', '/get-data-model', 'get-data-model');

$router->map('POST', '/add-model', 'add-model');
$router->map('POST', '/set-model', 'set-model');

$router->map('PUT', '/update-model', 'update-model');

$router->map('DELETE', '/delete-model', 'delete-model');


require './controller/server-ctrl.php';
