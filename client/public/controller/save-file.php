<?php 

include("./headers.php");

ini_set('display_errors', 1);
ini_set('file_uploads', 'On');
ini_set('max_input_time', 180);
ini_set('upload_max_filesize', '1024M');
ini_set('post_max_size', '1024M');
ini_set('max_execution_time', 180);
ini_set('memory_limit', '2O48M');

$path = "../models/";

if(isset($_POST)){
    // pour savoir si on doit ajouter une file ou plusieurs files
    $many = htmlspecialchars($_POST['many']); 
  

    if($many == '1'){ //many files : dossier
        $dossierName = htmlspecialchars($_POST['dossier']);
        $extension = htmlspecialchars($_POST['extension']);
        $dossierPath = $path . $extension . '/' . $dossierName;
        
        if(!file_exists($dossierPath)){
            if(mkdir($dossierPath, 0777, true)){
                echo json_encode($dossierPath); //dossier created
            }
            else{
                echo json_encode("dossier not created");
            }
        }
        else{
            echo json_encode("dossier already exists");
        }
            
    }

    else if($many == '2'){ //many files : les files DANS le dossier
        if(isset($_FILES)){
            $filename = $_FILES['file']['name'];
            $relativePath = htmlspecialchars($_POST['relativePath']);
            $extension = htmlspecialchars($_POST['extension']);
            $fileFromDossierPath = $path . $extension . '/' . $relativePath;

            if(!file_exists($fileFromDossierPath)){
                if(!move_uploaded_file($_FILES['file']['tmp_name'], $fileFromDossierPath))
                {
                    echo json_encode("error : move_uploaded_file MANY=2");
                    exit(1);
                }
                echo json_encode($fileFromDossierPath . " is the url and many is : " . $many); //file was created
            }
            else{
                echo json_encode("error : file_exists MANY=2");
            }
        }
        else{
            echo json_encode("no \$_FILES data MANY=2");
        }
    }

    else {
        // echo json_encode("Error : \$_POST['many'] is not set ");
        echo json_encode($_FILES);
    }
}
else{
    echo json_encode("no \$_POST data");
}