<?php
session_start();

if (empty($_SESSION['user'])) {
    header('Location: login.php');
    exit();
}


// if(isset($_SESSION['user'])) echo "\nuser : ".$_SESSION['user']."\n";
// if(isset($_SESSION['email']))  echo "\nemail : ".$_SESSION['email']."\n";


$pageTitle = "Choix du modèle";
$pageName = "model-chooser";
?>


<div class="container">
    <div class="model-container">
        <div class="model-list-container">
            <p>--- VILLE ---</p>
        </div>
    </div>
</div>