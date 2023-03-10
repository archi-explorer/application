<?php

$match = $router->match();

if (is_array($match)) {
    if (is_callable($match['target'])) {
        call_user_func_array($match['target'], $match['params']);
    } else {
        $params = $match['params'];

        require "../server/{$match['target']}.php";
    }
    require "../server/{$match['target']}.php";
} else {
    throw new Error('Error 404:Server Error');
}
