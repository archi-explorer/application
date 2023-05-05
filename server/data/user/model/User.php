<?php

require_once("MySQLi.php");

class User
{
    private $_login;
    private $_uname;
    private $_psw;
    private $_rid;
    private $_email;

    const USER_TABLE = "User";
    const ROLE_TABLE = "Role";

    public function __construct($login, $uname = null, $psw = null, $role = null, $email = null)
    {
        $this->setLogin($login);
        $this->setUname($uname);
        $this->setPsw($psw);
        $this->setRoleId($role);
        $this->setEmail($email);
    }
    // public function __construct($login, $uname, $psw = null, $role = null, $email = null)
    // {
    //     $this->setLogin($login);
    //     $this->setUname($uname);
    //     $this->setPsw($psw);
    //     $this->setRoleId($role);
    //     $this->setEmail($email);
    // }

    public function getLogin()
    {
        return $this->_login;
    }

    public function setLogin($log)
    {
        $this->_login = $log;
    }

    public function getUname()
    {
        return $this->_uname;
    }

    public function setUname($uname)
    {
        $this->_uname = $uname;
    }

    public function getPsw()
    {
        return $this->_psw;
    }

    public function setPsw($psw)
    {
        $this->_psw = $psw;
    }

    public function getRoleId()
    {
        return $this->_rid;
    }

    public function setRoleId($role)
    {
        $this->_rid = $role;
    }

    public function getEmail()
    {
        return $this->_email;
    }

    public function setEmail($email)
    {
        $this->_email = $email;
    }

    public function exists()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        // Préparation de la requête
        if ($stmt = $con->prepare('SELECT psw, r_id FROM ' . self::USER_TABLE . ' WHERE login = ?')) {
            // On assigne la variable login
            $stmt->bind_param("s", $this->_login);
            // Exécution de la requête
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: user access in DB failed");

            $user = $stmt->get_result()->fetch_assoc();

            // Vérification du mot de passe
            // if ($user && $this->_psw === $user['psw'])
            if ($user && password_verify($this->_psw, $user['psw'])) {
                // echo 'user exist<br/>';
                return $user['r_id'];
            }
        }

        echo "failed stmt";

        return false;
    }

    public function create()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        if ($stmt = $con->prepare('INSERT INTO ' . self::USER_TABLE . ' (login, uname, psw, r_id, email) VALUES (?, ?, ?, ?, ?)')) {
            $stmt->bind_param("sssss", $this->_login, $this->_uname, password_hash($this->_psw, PASSWORD_DEFAULT), $this->_rid, $this->_email);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: user access in DB failed");
                return false;
            }

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }

        return true;
    }

    public function getUsers()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        // old request
        // if ($stmt = $con->prepare('SELECT login, uname, r_id, email FROM ' . self::USER_TABLE)) {
        //     $stmt->execute();

        //     if (!$stmt)
        //         throw new Exception("Error: no user found in DB");

        //     $users = $stmt->get_result()->fetch_all();

        //     return $users;
        // }

        // new request
        if ($stmt = $con->prepare(
            'SELECT u.login, u.uname, r.rname, u.email FROM ' . self::USER_TABLE . ' u INNER JOIN ' . self::ROLE_TABLE . ' r ON u.r_id = r.id ORDER BY u.login DESC'
        )) {
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: no user found in DB");

            $users = $stmt->get_result()->fetch_all();

            return $users;
        }

        return [];
    }

    public function deleteUser()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        if ($stmt = $con->prepare('DELETE FROM ' . self::USER_TABLE . ' WHERE login = ?')) {
            $stmt->bind_param("s", $this->_login);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no user delete in DB");
                return false;
            }

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }

        return false;
    }

    public function updateUser($log)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        if ($stmt = $con->prepare('UPDATE ' . self::USER_TABLE . ' SET login = ?, r_id = ?, email = ? WHERE login = ?')) {
            $stmt->bind_param("ssss", $this->_login, $this->_rid, $this->_email, $log);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no user update in DB");
                return false;
            }

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }

        return false;
    }

    public function updatePsw()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno())
            return false;

        if ($stmt = $con->prepare('UPDATE ' . self::USER_TABLE . ' SET psw = ? WHERE login = ?')) {
            $stmt->bind_param("ss", password_hash($this->_psw, PASSWORD_DEFAULT), $this->_login);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no user to update");
                return false;
            }

            if ($stmt->affected_rows == 0) {
                return false;
            }

            return true;
        }

        return false;
    }

    public function getEmailFromId()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno())
            return false;

        if ($stmt = $con->prepare('SELECT email FROM ' . self::USER_TABLE . ' WHERE login = ?')) {
            $stmt->bind_param("s", $this->_login);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no user to get email from");
                return false;
            }

            $email = $stmt->get_result()->fetch_assoc();

            return $email['email'];
        }

        return false;
    }
}
