<?php
session_start();
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>
        <?php
        if (!$pageTitle) {
            echo 'Mon site';
        } else {
            echo $pageTitle;
        }
        ?>
    </title>

    <link rel="icon" href="./images/logo-solution.png" />

    <link rel="stylesheet" href="./css/<?= $pageName ?>.css" type="text/css">
    <link rel="stylesheet" href="./css/header.css" type="text/css" />
    <link rel="stylesheet" href="./css/footer.css" type="text/css" />

    <link rel="stylesheet" href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <link rel="stylesheet" href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <script src="./js/<?= $pageName ?>.js" type="module"></script>
</head>

<body>
    <header>
        <div class="headerContainer">
            <div class="logoContainer"></div>
            <div class="contact">
                <span class="material-symbols-outlined"> contact_mail </span>
                <p>Contact</p>
            </div>

            <?php
            if (isset($_SESSION['user'])) {
            ?>
                <div class="modelLink">
                    <span class="material-symbols-outlined"> view_in_ar </span>
                    <p>Mes modèles</p>
                </div>
            <?php
            }
            ?>

            <div class="user">
                <span class="material-symbols-outlined"> account_circle </span>
                <p>
                    <?php
                    if (isset($_SESSION['user'])) {
                        echo $_SESSION['user'];
                    } else {
                        echo 'Utilisateur';
                    }
                    ?>
                </p>
            </div>
        </div>
    </header>

    <?= $pageContent; ?>

    <footer>
        <div class="footerContainer">
            <div class="footerLeft">
            </div>
            <div class="footerCenter"></div>
            <div class="footerRight">
                <a href="" id="faceBook"></a>
                <a href="" id="instagram"></a>
                <a href="" id="linkedIn"></a>
            </div>
        </div>
    </footer>

</body>

</html>