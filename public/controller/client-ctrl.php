<?php

$match = $router->match();

echo "client<br>";

if (is_array($match)) {
    echo "$match";
    if (is_callable($match['target'])) {
        call_user_func_array($match['target'], $match['params']);
    } else {
        $params = $match['params'];

        echo "$params";

        ob_start();
        require "../templates/{$match['target']}.php";
        $pageContent = ob_get_clean();
    }
    require '../elements/layout.php';
} else {
    throw new Exception('Error 404:No page found');
}
