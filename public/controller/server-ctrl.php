<?php

$match = $router->match();

echo "server<br>";
echo "$match<br>";

if (is_array($match)) {
    echo "$match";
    if (is_callable($match['target'])) {
        call_user_func_array($match['target'], $match['params']);
    } else {
        $params = $match['params'];

        echo "$params";

        require "../server/{$match['target']}.php";
    }
    require "../server/{$match['target']}.php";
} else {
    throw new Exception('Error 404:Server Error');
}
