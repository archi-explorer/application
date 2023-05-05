<?php
session_start();

if (empty($_SESSION['user'])) {
    header('Location: login.php');
    exit();
}


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