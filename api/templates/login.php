<?php
session_start();

$pageTitle = "Connexion";
$pageName = "login";
?>

<div class="modal">
    <form id="login-form" class="signin-content animate">
        <p class="title-form">Connexion</p>

        <div class="container">
            <div class="input-container">
                <label for="uname">Utilisateur</label>
                <input type="text" placeholder="Entrez votre nom d'utilisateur" name="uname" id="uname" required />
                <label for="psw">Mot de passe</label>
                <input type="password" placeholder="Entrez votre mot de passe" name="psw" id="psw" required />
            </div>

            <div class="tools">
                <span class="psw">Mot de passe <a href="#">oublié ?</a></span>
            </div>

            <button id="btn_login" type="submit">Se connecter</button>
        </div>
    </form>
</div>