<?php

session_start();
include("./headers.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    exit(1);

if (empty($_POST['mid']) || empty($_POST['rid']))
    exit(1);

require_once('model/Access.php');


$mid = htmlspecialchars($_POST['mid']);
$rid = htmlspecialchars($_POST['rid']);

$access = new Access($mid, $rid);

try {
    if (!$access->addAccess()) {
        echo json_encode(false);
        exit(1);
    }

    echo json_encode(true);
} catch (PDOException $e) {
    echo ("pdo" . $e->getMessage());
} catch (Exception $e) {
    echo ("exception" .$e->getMessage());
}
