<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('session.cookie_secure', 0); 


require '../vendor/autoload.php';

$router = new AltoRouter();

require './routes/routes.php';

