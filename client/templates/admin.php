<?php
session_start();

if ($_SESSION['role'] !== "admin") {
    header('Location: model-chooser');
    exit();
}



$pageTitle = "Administrateur";
$pageName = "admin";
?>

<div class="container">
    <div class="account-container">
        <div class="img-container">
            <img src="./images/img_avatar2.png" alt="Avatar" class="avatar">
        </div>
        <div class="text-container">
            <p>Bonjour <?= $_SESSION['uname'] ?></p>
            <p class="signout">Déconnexion</p>
        </div>
    </div>

    <!-- 
    *********************************************************
        GESTION DES MODELES ET DES PERMISSIONS
    *********************************************************
    -->

    <p class="separator">--- GESTION DES MODÈLES ET SES PERMISSIONS ---</p>
    <div class="model-container">
        <div class="model-list-container-2">
            <ul class="model">
                <li class="li-model-info">
                    <p>--- NOM ---</p>
                    <p>--- TYPE ---</p>
                    <p>--- VILLE ---</p>
                    <p>--- PERMISSIONS ---</p>
                    <p>--- MODIFICATION ---</p>
                </li>
            </ul>
        </div>

        <br><br>
        <div class="drag-area">
            <span class="material-symbols-outlined">cloud_upload</span>
            <p>
                Glissez et déposez un fichier ici
            </p>
            <p>OU</p>
            <button style="display:block;width:200px;height:75px" onclick="document.getElementById('file-browse').click()">Parcourez vos fichiers</button>
            <input type="file" id="file-browse" style="display:none">
        </div>
    </div>

    <!-- 
    *********************************************************
        GESTION DES RÔLES ET DES UTILISATEURS 
    *********************************************************
    -->


    <p class="separator">--- GESTION DES RÔLES ET DES UTILISATEURS ---</p>


    <div class="user-container">
        <!-- onglets -->
        <div class="onglets-container">
            <div class="onglets active" data-anim="1">Table des utilisateurs</div>
            <div class="onglets" data-anim="2">Table des rôles</div>
        </div>
        <!-- table des utilisateurs -->
        <div class="contenu actifContenu" data-anim="1">
            <ul class="user-list-container">
                <li>
                    <p>--- IDENTIFIANT ---</p>
                    <p>--- NOM ---</p>
                    <p>--- ROLE ---</p>
                    <p>--- EMAIL ---</p>
                    <p>--- MODIFICATION ---</p>
                </li>
            </ul>
        </div>
        <!-- table des rôles -->
        <div class="contenu" data-anim="2" hidden>
            <ul class="role-list-container">
                <li>

                    <p>--- NOM ---</p>
                    <p>--- MODIFICATION ---</p>
                </li>
            </ul>
        </div>

        <button class="add-user contenu actifContenu" data-anim="1">Ajouter un utilisateur</button>
        <button class="add-newrole contenu" data-anim="2" hidden> Ajouter un rôle</button>
    </div>
</div>

<div class="add-model-container">
    <form action="" method="post" class="form-add-model">
        <p>Ajouter un modèle</p>
        <span id="mname"></span>
        <div class="input-container">
            <label for="city">Ville</label>
            <input type="text" name="city" placeholder="Entrez le nom de la ville" id="city">
            <label for="extension">Extension</label>
            <select name="extension" id="extension">
                <option disable selected value=""> - choisir un type - </option>
                <option value="obj-mtl">OBJ/MTL</option>
                <option value="fbx">FBX</option>
            </select>
        </div>
        <button type="submit" class="btn-add-model">Ajouter le modèle</button>
    </form>
</div>

<div class="add-user-container">
    <form action="" method="post" class="form-add-user">
        <p>Ajouter un utilisateur</p>
        <div class="input-container">
            <label for="login">Identifiant</label>
            <input type="text" name="login" placeholder="Entrez le l'identifiant d'utilisateur" id="login">
            <label for="login">Nom</label>
            <input type="text" name="uname" placeholder="Entrez le nom d'utilisateur" id="uname">
            <label for="psw">Mot de passe</label>
            <input type="password" name="psw" placeholder="Entrez le mot de passe" id="psw">
            <label for="psw-confirmation">Confirmer le mot de passe</label>
            <input type="password" name="psw-confirmation" placeholder="Confirmez le mot de passe" id="psw-confirmation">
            <label for="email">Email</label>
            <input type="text" name="email" placeholder="Entrez l'Email" id="email">
            <label for="role">Role</label>
            <select name="role" id="role-user"></select>
        </div>
        <button type="submit" class="btn-add-user">Ajouter un utilisateur</button>
    </form>
</div>

<div class="add-role-container">
    <form action="" method="post" class="form-add-role">
        <p>Ajouter un rôle</p>
        <div class="input-container">
            <label for="role">Role</label>
            <input type="text" name="role" placeholder="Entrez le nom du rôle" id="role-name">
        </div>
        <button type="submit" class="btn-add-role">Ajouter un rôle</button>
    </form>
</div>


<div class="change-psw-container">
    <form action="" method="post" class="form-change-psw">
        <p>Changer le mot de passe d'un utilisateur</p>
        <div class="input-container">
            <label for="psw">Nouveau mot de passe</label>
            <input type="password" name="psw" id="update-psw" placeholder="Entrez le nouveau mot de passe">
            <label for="psw-confirmation">Confirmer le mot de passe</label>
            <input type="password" name="psw-confirmation" id="update-psw-conf" placeholder="Confirmez le nouveau mot de passe">
        </div>
        <button type="submit" class="btn-change-psw">Modifier le mot de passe</button>
    </form>
</div>

<div class="add-access-container">
    <form action="" class="form-add-access">
        <p>Ajouter un accès</p>
        <div class="combobox-container">
            <label for="new-access">Nouvel accès</label>
            <select id="select-role" class="chosenRole">
            </select>
            <button class="btn-add-new-access">Add</button>
        </div>
        <div class="list-access-container">
            <label for="role-label">Rôles déjà attribués à ce modèle : </label>
            <div class="access-overflow" style="overflow:auto; height:250px;">
                <ul class="ul-role-access">
                </ul>
            </div>
        </div>
    </form>
</div>

<div class="update-ok">
    <p>Les modifications ont bien été apportées</p>
</div>

<div class="update-ko">
    <p>Les modifications ont échouées</p>
</div>

<!-- overlay obscur pour le chargementn -->
<div id="overlay"></div>

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