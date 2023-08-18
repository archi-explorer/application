<?php

require_once("MySQLi.php");

class User
{
    private $_login;
    private $_name;
    private $_psw;
    private $_rid;
    private $_email;

    const USER_TABLE = "User";
    const ROLE_TABLE = "Role";

    public function __construct($login, $name = null, $psw = null, $role = null, $email = null)
    {
        $this->setLogin($login);
        $this->setName($name);
        $this->setPsw($psw);
        $this->setRoleId($role);
        $this->setEmail($email);
    }

    public function getLogin()
    {
        return $this->_login;
    }

    public function setLogin($login)
    {
        $this->_login = $login;
    }

    public function getName()
    {
        return $this->_name;
    }

    public function setName($name)
    {
        $this->_name = $name;
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
        if ($stmt = $con->prepare('SELECT psw, r_id FROM ' . self::USER_TABLE . ' WHERE login = ?')) {
            try {
                $stmt->bind_param('s', $this->_login);
            } catch (Exception $e) {
                echo "failed bind_param";
                return false;
            }
            try {
                $stmt->execute();
            } catch (Exception $e) {
                echo "failed execute";
                return false;
            }

            if (!$stmt) {
                throw new Exception("Error: user access in DB failed");
                return false;
            }

            try {
                $user = $stmt->get_result()->fetch_assoc();
            } catch (Exception $e) {
                echo "failed get_result";
                return false;
            }

            // Vérification du mot de passe
            // if ($user && $this->_psw === $user['psw']) 
            if ($user && password_verify($this->_psw, $user['psw'])) {
                return $user['r_id'];
            }
        }

        echo "failed stmt";

        return false;
    }

    public function getUname()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        if ($stmt = $con->prepare('SELECT uname FROM ' . self::USER_TABLE . ' WHERE login = ?')) {
            try {
                $stmt->bind_param('s', $this->_login);
                $stmt->execute();

                if (!$stmt) {
                    throw new Exception("Error: user access in DB failed");
                    return false;
                }

                try {
                    $uname = $stmt->get_result()->fetch_assoc();
                    if (!$uname) {
                        throw new Exception("Error: no uname for this user");
                    }

                    return $uname['uname'];
                } catch (Exception $e) {
                }
            } catch (Exception $e) {
                echo "$e";
                exit(1);
            }
        }

        return "";
    }

    public function create()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        if ($stmt = $con->prepare('INSERT INTO ' . self::USER_TABLE . ' (login, uname, psw, r_id, email) VALUES (?, ?, ?, ?, ?)')) {
            $stmt->bind_param("sssss", $this->_login, $this->_name, password_hash($this->_psw, PASSWORD_DEFAULT), $this->_rid, $this->_email);
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

    public function updateUserRoleById()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno())
            return false;

        if ($stmt = $con->prepare('UPDATE ' . self::USER_TABLE . ' SET r_id = ? WHERE login = ?')) {
            $stmt->bind_param("ss", $this->_rid, $this->_login);
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


    public function checkIfRoleIsAssigned()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno())
            return false;

        if ($stmt = $con->prepare('SELECT r_id FROM ' . self::USER_TABLE . ' WHERE r_id = ?')) {
            $stmt->bind_param("s", $this->_rid);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no user to update");
                return false;
            }

            $result = $stmt->get_result()->fetch_assoc();

            if ($result['r_id'] == 0) {
                return false;
            }
            return true;
        }
        return false;
    }


    public function updateEmail()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno())
            return false;

        if ($stmt = $con->prepare('UPDATE ' . self::USER_TABLE . ' SET email = ? WHERE login = ?')) {
            $stmt->bind_param("ss", $this->_email, $this->_login);
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

    public function updateName()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno())
            return false;

        if ($stmt = $con->prepare('UPDATE ' . self::USER_TABLE . ' SET uname = ? WHERE login = ?')) {
            $stmt->bind_param("ss", $this->_name, $this->_login);
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
