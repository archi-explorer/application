<?php

session_start();

include("./headers.php");

echo json_encode($_SESSION['rid']);