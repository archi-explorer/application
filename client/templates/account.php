<?php
session_start();

if (empty($_SESSION["user"])) {
    header('Location: login');
    exit();
}
$pageTitle = "Mon compte";
$pageName = "account";
?>

<div class="account-container">
    <div class="img-container">
        <img src="./images/img_avatar2.png" alt="Avatar" class="avatar">
    </div>
    <div class="text-container">
        <p>Bonjour <?= $_SESSION["user"] ?></p>

        <p class="signout">Déconnexion</p>
    </div>
</div>