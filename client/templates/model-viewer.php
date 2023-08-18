<?php
session_start();

if (empty($_SESSION['user'])) {
    header('Location: login');
    exit();
}


$pageTitle = "Modèle";
$pageName = "model-viewer";
?>


<div class="scene-container">
    <div class="guiContainer"></div>

    <div class="tools">
        <a class="navigationMode"> </a>
        <a class="overView"> </a>
        <a class="mesure"> </a>
        <a class="virtualVisit"> </a>
        <a class="fullScreen"> </a>
    </div>

    <a role="button" class="closeMesure">X</a>
    <button type="button" class="clearMesure">Effacer</button>

    <div class="helpLink">
        <span class="material-symbols-outlined"> help </span>
    </div>
    <div class="helpPage">
        <div class="helpContainer">
            <div class="leftColumn">
                <section class="topLeft">
                    <img src="./images/img_helper/IconeTranslationPageAide.png" alt="Translation" />
                </section>
                <section class="midleTopLeft">
                    <img src="./images/img_helper/IconeRotationPageAide.png" alt="Orbite" />
                </section>
                <section class="midleBottomLeft">
                    <img src="./images/img_helper/IconeZoompageAide.png" alt="Zoom" />
                </section>
                <section class="bottomLeft">
                    <img src="./images/img_helper/IconePleinEcranPageAide.png" alt="Plein écran" />
                </section>
            </div>
            <div class="rightColumn">
                <section class="closeHelp">
                    <img src="./images/img_helper/IconeClotureAide.png" alt="Cloture" id="closeHelper" />
                </section>
                <section class="topRight">
                    <img src="./images/img_helper/IconeVueDollhousePageAide.png" alt="Outil de navigation" />
                </section>
                <section class="midleTopRight">
                    <img src="./images/img_helper/IconeVueDessusPageAide.png" alt="Vue du dessus" />
                </section>
                <section class="midleBottomRight">
                    <img src="./images/img_helper/IconeVisiteVirtuellePageAide.png" alt="Visite virtuelle" />
                </section>
                <section class="bottomRight">
                    <img src="./images/img_helper/IconeMesurePageAide.png" alt="Mode mesure" />
                </section>
            </div>
        </div>
    </div>
</div>


<div class="loader">
    <video width="500px" height="500px" autoplay loop muted class="videoLoader">
        <source src="./videos/loader.mp4" type="video/mp4" />
    </video>
</div>