<?php


session_start();
ini_set('session.cookie_secure', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

// error_reporting(-1); // affiche les erreurs php
// ini_set('display_errors', 'On');
// set_error_handler("var_dump");  

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  exit(1);
}

if (empty($_POST['civilite']) || empty($_POST['nom']) || empty($_POST['tel']) || empty($_POST['sujet']) || empty($_POST['message'])) {
  exit(1);
}

//$sub = '=?UTF-8?B?'.base64_encode($subject).'?='; // encodage du sujet en UTF-8
// => bonne res => voir http://www.web-d.be/post/271/emails-php-et-caractères-accentués.html
// voir si utiliser MIME sera necessaire 


//on obtient le mail de l'utilisateur connecté

// require_once('model/User.php');
// $email = htmlspecialchars($_SESSION['email']); // adresse mail de l'expéditeur
// echo "session:".$_SESSION['user'];
// $user = new User($_SESSION['user'], "", "", null, "");
// $email = $user->getEmailFromId();
print_r($_SESSION);
// echo "\n\nemail in sendmails:" . $_SESSION['email'];
$email = htmlspecialchars($_SESSION['email']);
// echo "\nemail:".sizeof($_SESSION);
// echo "\nuser:".$_SESSION['user'];


// $email = "thisisemail@gmail.com";
$civil = htmlspecialchars($_POST['civilite']);
$last_name = htmlspecialchars($_POST['nom']);
$telephone = htmlspecialchars($_POST['tel']);
$subject = "Contact : " . htmlspecialchars($_POST['sujet']); // encodage du sujet en UTF-8 pour le SUBJECT, marche pas pour le BODY
$message = "Envoyé par : " . $civil . " " . $last_name . "\nEmail : " . $email . "\nTel : " . $telephone . "\n\n\n\"" . $_POST['message'] . "\"";

// no require cause no email models

$to = "arnauddelestrereal@gmail.com";
$headers = array(
  "From: archi-explorer@archimed-ge.com",
  "Reply-to: " . $to,
  "X-Mailer: PHP/8.2",
  "Content-Type: text/plain; charset=utf-8"
); // mise en page importante (anti-spam detector)

$headers = implode("\r\n", $headers);
/*Examples of headers that should work would be:

    From: user@domain.com
    From: "user" <user@domain.com>
    Examples of headers that will NOT work:
    
    From: "user@domain.com"
    From: user @ domain.com
    From: user@domain.com <user@domain.com>*/

try {
  mail($to, $subject, $message, $headers); //utilise la fonction php mail() pour envoyer le mail
  echo json_encode(true);
} catch (Exception $e) {
  echo $e->getMessage();
} catch (PDOException $e) {
  echo $e->getMessage();
}
