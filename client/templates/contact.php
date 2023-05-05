<?php

session_start();

$pageTitle = "Contact";
$pageName = "contact";
?>


<div class="container">
    <div class="contact-info-container">
          <h3>AGENCES</h3>
          <h4>[STRASBOURG]</h4>
          <p> 32 rue Wimpheling, Strasbourg</p> 
          <h4>[PARIS]</h4>
          <p> 8 rue des Belles Vues, Fontenay-Sous-Bois </p> 
          <h4>[MULHOUSE] </h4>
          <p> 55 rue Marc Seguin, Mulhouse</p>
          <br><br>
          <p>Mail : contact@archimed-ge.com</p>
          <p>Tel : 03 88 61 87 09</p>
     </div>

     

    <?php if(isset($_SESSION['user'])) : ?>

        <div></div>
        <div class="form-container">
        <div class="form-intro">
            <h2>Contactez-nous</h2>
            <p>Avez-vous un doute, une question, une remarque? N'hésitez pas à nous écrire ci-dessous : </p>
            <br>
            <p> Vous serez directement contacté par mail.</p>
        </div>
        <p class="separator"></p>

        <div class="form-res" id="form-res-message">RESULTAT</div>

        <p class="separator"></p>
        <div class="form-contents"> 
            <form id="form-contact" novalidate method="post">
            <!-- action="./controller/mail-ctrl.php" -->
            <!-- MAINENANT appelé par contact.js -->
                <div class="form-civ">
                <label for="civilite">Civilité</label>
                <select name="civilite" id="civilite">
                    <option value="Monsieur">Monsieur</option>
                    <option value="Madame">Madame</option>
                    <option value="Mx">Mx</option>
                </select>
                </div>
                <div class="form-name">
                <label for="nom">Nom</label>
                <input type="text" name="nom" class="inpform" id="nom" placeholder="Exemple : Dailly">
                <div class="invalid-message" id="invalid-feedback-name">ERROR NOM</div>
                </div>
                <div class="form-tel">
                <label for="telephone">Téléphone</label>
                <input type="tel" name="telephone" class="inp-form" id="telephone" placeholder="Exemple : 0711111111"> 
                <div class="invalid-message" id="invalid-feedback-tel">ERROR TEL</div>
                </div>
                <div class="form-subject">
                <label for="sujet">Sujet</label>
                <input type="text" name="sujet" id="sujet" class="inp-form" placeholder="Exemple : Problème d'affichage">
                <div class="invalid-message" id="invalid-feedback-sujet">ERROR SUJET</div>
                </div>
                <div class="form-message">
                <label for="message">Message</label>
                <textarea name="message" class="inp-form" id="message" cols="30" rows="10" placeholder="Écrivez ici votre message..."></textarea>
                <div class="invalid-message" id="invalid-feedback-message">ERROR MESSAGE</div>
                </div>
                <div>
                <input type="submit" value="Envoyer">
                </div>
            </form>


            </div>
        </div>
     <?php endif; ?>

  </div>