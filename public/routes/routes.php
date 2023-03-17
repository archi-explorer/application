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

$router->map('GET', '/get-users', 'server/user/get-users');
$router->map('GET', '/get-uname', 'server/user/get-uname');
$router->map('GET', '/signout', 'server/user/signout');

$router->map('POST', '/authenticate', 'server/user/authenticate');
$router->map('POST', '/add-user', 'server/user/add-user');

$router->map('PUT', '/update-user', 'server/user/update-user');
$router->map('PUT', '/update-psw', 'server/user/update-psw');

$router->map('DELETE', '/delete-user', 'server/user/delete-user');

// Route modèle

$router->map('GET', '/get-model', 'server/model/get-model');
$router->map('GET', '/get-data-model', 'server/model/get-data-model');

$router->map('POST', '/add-model', 'server/model/add-model');
$router->map('POST', '/set-model', 'server/model/set-model');

$router->map('PUT', '/update-model', 'server/model/update-model');

$router->map('DELETE', '/delete-model', 'server/model/delete-model');


require '../controller/api-ctrl.php';
