<?php

session_start();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');


if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    exit(1);
}

if (empty($_POST['email'])) {
    exit(1);
}


$from = htmlspecialchars($_POST['email']);
$headers = array(
    "From: $from",
    "Reply-to: qwarth@archimed-ge.com",
    "X-Mailer: PHP/5.2",
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
$subject = "Récupération de mot de passe";
$message = "Un utilisateur souhaite réucpérer son mot de passe";

require_once('model/Email.php');

$email = new Email($headers, $subject, $message);

try {
    if ($email->retrivePassword()) {
        exit(1);
    }
} catch (Exception $e) {
    print_r($e->getMessage());
    exit(1);
} catch (PDOException $ex) {
    echo json_encode($ex);
    exit(1);
}
