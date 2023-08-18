<?php

session_start();

function guiNames($path): array
{
    $list = array();

    if ($handle = opendir($path)) {
        while (false !== ($entry = readdir($handle))) {
            if ("$entry" != "." && "$entry" != ".." && "$entry" != "panoramas") {
                array_push($list, $entry);
            }
        }
    }

    return $list;
}
