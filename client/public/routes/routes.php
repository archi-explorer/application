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

require './controller/api-ctrl.php';
