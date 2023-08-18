<?php

session_start();

function panoCoord($path)
{
    if (!($fp = fopen("$path/panoramas/coord.csv", 'r'))) {
        return null;
        exit(1);
    }

    $key = fgetcsv($fp, "1024", ";");

    $json = array();
    while ($row = fgetcsv($fp, "1024", ";")) {
        $json[] = array_combine($key, $row);
    }

    fclose($fp);
    return $json;
}
