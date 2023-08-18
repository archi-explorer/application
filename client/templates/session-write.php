<?php

session_start();

if (isset($_POST['user'])) {
    $_SESSION['user'] = $_POST['user'];
}

if (isset($_POST['uname'])) {
    $_SESSION['uname'] = $_POST['uname'];
}

if (isset($_POST['role'])) {
    $_SESSION['role'] = $_POST['role'];
}

if (isset($_POST['email'])) {
    $_SESSION['email'] = $_POST['email'];
}

if (isset($_POST['rid'])) {
    $_SESSION['rid'] = $_POST['rid'];
}
