<?php

$match = $router->match();

if (is_array($match)) {
    if (is_callable($match['target'])) {
        call_user_func_array($match['target'], $match['params']);
    } else {
        $params = $match['params'];

        ob_start();
        require "../api/{$match['target']}.php";
        $pageContent = ob_get_clean();
    }
    require '../layouts/layout.php';
} else {
    throw new Exception('Error 404:No page found');
}
