<?php

session_start();

echo sizeof($_SESSION);
echo $_SESSION['user'];
echo $_SESSION['email'];
echo $_SESSION['role'];
