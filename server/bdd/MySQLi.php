<?php

require_once('bdd.php');

class MonSQLi
{
    private static ?mysqli $_sqli = null;

    private function __construct()
    {
    }

    public static function sqli(): mysqli
    {
        global $host;
        // echo ($host . '<br>');
        global $username;
        // echo ($username . '<br>');
        global $password;
        // echo ($password . '<br>');
        global $database;
        // echo ($database . '<br>');

        if (self::$_sqli == null) {
            // echo ("assign DSN<br>");
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            self::$_sqli = new mysqli($host, $username, $password, $database);
        }
        // echo ("Connexion réussi<br>");
        return self::$_sqli;
    }
}
