<?php

session_start();

function panoFile($path)
{
    $list = array();
    if ($handle = opendir("$path/panoramas")) { // gère les fichiers du dossier "panoramas" PLURIEL
        while (false !== ($entry = readdir($handle))) {
            if ("$entry" != "." && "$entry" != ".." && "$entry" != "coord.csv") { //ignore les fichiers . et .. et coord.csv
                array_push($list, "$entry");
            }
        }
        closedir($handle);
    }

    sort($list);
    return $list;
}
