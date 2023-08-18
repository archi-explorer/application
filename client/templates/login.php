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
                <label for="login">Utilisateur</label>
                <input type="text" placeholder="Entrez votre nom d'utilisateur" name="login" id="login" required />
                <label for="psw">Mot de passe</label>
                <input type="password" placeholder="Entrez votre mot de passe" name="psw" id="psw" required />
            </div>

            <div class="tools">
                <span class="psw">Mot de passe <a href="#" id="forgot-psw">oublié ?</a></span>
            </div>

            <button id="btn_login" type="submit">Se connecter</button>
        </div>
    </form>
</div>

<div class="forgot-psw">
    <form action="" method="post" class="form-retrive-psw">
        <p>Mot de Passe oublié</p>
        <div class="input-container">
            <label for="email">Email</label>
            <input type="text" name="email" placeholder="Entrez votre mail" id="email">
        </div>
        <button type="submit" class="btn-retrive-psw">Envoyer une demande de récupération</button>
    </form>
</div>

<!-- pop up -->
<div id="modal-overlay">
    <div id="modal">
        <div class="modal-header">
            <img src="./images/logo-solution.png" alt="">
            <h2>Archi-Explorer</h2>
        </div>

        <div class="modal-subtitle">
            <h3 id="modal-subtitle-error"></h3>
        </div>

        <div class="modal-message">
            <p id="modal-message-error"></p>
        </div>

        <div class="modal-footer">
            <button id="close-modal">Fermer</button>
        </div>

    </div>
</div>