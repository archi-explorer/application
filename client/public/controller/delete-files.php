<?php

include("./headers.php");

if(isset($_POST)){
    $path = htmlspecialchars($_POST['path']);

    if(!isset($path) || empty($path)){
        echo json_encode("Error : path is empty");
        return false;
    }
    deleteAll($path);
    
    echo json_encode("Delete : ".$path);
    return true;
}
else{
    echo json_encode("no \$_POST data");
    return false;
}


function deleteAll($path){
    if(is_file($path)){
        unlink($path);
    }
    elseif(is_dir($path)){
        $scan = scandir($path);
        unset($scan[0], $scan[1]); //unset . and ..

        foreach($scan as $index=>$filepath){
            deleteAll($path."/".$filepath); //recursif
        } 
        rmdir($path);
    }
    // j'ai effacé le else, car il donne une erreur
}


