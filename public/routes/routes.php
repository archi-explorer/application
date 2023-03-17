<?php

// Routes client

$router->map('GET', '/', 'templates/welkome');
$router->map('GET', '/welkome', 'templates/welkome', 'welkome');
$router->map('GET', '/login', 'templates/login', 'login');
$router->map('GET', '/account', 'templates/account', 'account');
$router->map('GET', '/admin', 'templates/admin', 'admin');
$router->map('GET', '/contact', 'templates/contact', 'contact');
$router->map('GET', '/model-chooser', 'templates/model-chooser', 'model-chooser');
$router->map('GET', '/model-viewer/[*:model]', 'templates/model-viewer/model', 'model-viewer');

// Route users

$router->map('GET', '/get-users', 'data/user/get-users');
$router->map('GET', '/get-uname', 'data/user/get-uname');
$router->map('GET', '/signout', 'data/user/signout');

$router->map('POST', '/authenticate', 'data/user/authenticate');
$router->map('POST', '/add-user', 'data/user/add-user');

$router->map('PUT', '/update-user', 'data/user/update-user');
$router->map('PUT', '/update-psw', 'data/user/update-psw');

$router->map('DELETE', '/delete-user', 'data/user/delete-user');

// Route modèle

$router->map('GET', '/get-model', 'data/model/get-model');
$router->map('GET', '/get-data-model', 'data/model/get-data-model');

$router->map('POST', '/add-model', 'data/model/add-model');
$router->map('POST', '/set-model', 'data/model/set-model');

$router->map('PUT', '/update-model', 'data/model/update-model');

$router->map('DELETE', '/delete-model', 'data/model/delete-model');


require './controller/api-ctrl.php';
