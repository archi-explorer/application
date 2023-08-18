<?php
session_start();
include("./headers.php");


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  exit(1);
}

if (empty($_POST['civilite']) || empty($_POST['nom']) || empty($_POST['email']) || empty($_POST['tel']) || empty($_POST['sujet']) || empty($_POST['message'])) {
  exit(1);
}

$civil = htmlspecialchars($_POST['civilite']);
$last_name = htmlspecialchars($_POST['nom']);
$from = htmlspecialchars($_POST['email']);
$telephone = htmlspecialchars($_POST['tel']);
$subject = utf8_decode("Contact : " . htmlspecialchars($_POST['sujet'])); // encodage du sujet en UTF-8 pour le SUBJECT, marche pas pour le BODY
$message = "Envoyé par : " . $civil . " " . $last_name . "\nEmail : " . $email . "\nTel : " . $telephone . "\n\n\n\"" . $_POST['message'] . "\"";

$headers = array(
  "From: $from",
  "Reply-to: archi-explorer@archimed-ge.com",
  "X-Mailer: PHP/5.2",
  "Content-Type: text/plain; charset=utf-8"
); // mise en page importante (anti-spam detector)

$headers = implode("\r\n", $headers);

require_once('model/Email.php');

$email = new Email($headers, $subject, $message);

try {
  if ($email->exist($from)) {
    if ($email->sendEmail()) {
      echo json_encode(true);
      exit();
    }
  }

  echo json_encode(false);
} catch (Exception $e) {
  echo ($e->getMessage());
  exit(1);
} catch (PDOException $ex) {
  echo ($ex);
  exit(1);
}
