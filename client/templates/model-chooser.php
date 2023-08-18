<?php
session_start();

if (empty($_SESSION['user'])) {
    header('Location: login');
    exit();
}



$pageTitle = "Choix du modèle";
$pageName = "model-chooser";
?>


<div class="container">
    <div class="model-container">
        <div class="model-list-container">
            <ul class="model">
                <li>
                    <div>
                        <p>--- NOM ---</p>
                    </div>
                    <div>
                        <p>--- TYPE ---</p>
                    </div>
                    <div>
                        <p>--- VILLE ---</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>