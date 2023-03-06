<?php

// Route users

$route->map('GET', '/get-users', 'get-users');
$route->map('GET', '/get-uname', 'get-uname');
$route->map('GET', '/signout', 'signout');

$route->map('POST', '/authentification', 'authenticate');
$route->map('POST', '/add-user', 'add-user');

$route->map('PUT', '/update-psw', 'update-psw');
$route->map('PUT', '/update-user', 'update-user');

$route->map('DELETE', '/delete-user', 'deluser');

// Route modèle

$route->map('GET', '/get-model', 'get-model');
$route->map('GET', '/get-data-model', 'get-data-model');

$route->map('POST', '/add-model', 'add-model');
$route->map('POST', '/set-model', 'set-model');

$route->map('PUT', '/update-model', 'update-model');

$route->map('DELETE', '/delete-model', 'delete-model');


require './controller/server-ctrl.php';
