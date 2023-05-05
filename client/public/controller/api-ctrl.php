<?php

//ini_set("display_errors", 1);

// echo "\n\n";
// print_r($router->getRoutes());
$match = $router->match(); // match current request url and method against registered routes (in this case, routes.php)
// echo "\n\nmatch is : ".$match;

if (is_array($match)) {
    // debug_to_console($match);
    if (is_callable($match['target'])) {
        // debug_to_console("is callable");
        call_user_func_array($match['target'], $match['params']);
    } else {
        // debug_to_console("is not callable");
        $params = $match['params'];

        ob_start();
        require "../templates/{$match['target']}.php";
        $pageContent = ob_get_clean();

        // echo $_SESSION["user"];
    }
    require '../layouts/layout.php';
} else {
    // debug_to_console("no match, launching 404");
    throw new Exception('Error 404:No page found');
}