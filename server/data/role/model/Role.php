<?php

require_once("MySQLi.php");

class Role
{
    private $_rid;
    private $_rname;

    const ROLE_TABLE = "Role";

    public function __construct($id, $rname = null)
    {
        $this->setRoleId($id);
        $this->setRoleName($rname);
    }

    public function setRoleId($id)
    {
        $this->_rid = $id;
    }

    public function getRoleId()
    {
        return $this->_rid;
    }

    public function setRoleName($rname)
    {
        $this->_rname = $rname;
    }

    public function getRName()
    {
        return $this->_rname;
    }

    public function getRoles()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }
        if ($stmt = $con->prepare('SELECT * FROM ' . self::ROLE_TABLE)) {

            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No roles found");

            $roles = $stmt->get_result()->fetch_all();

            return $roles;
        }
        return "no roles found";
    }

    public function getRoleName()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('SELECT rname FROM ' . self::ROLE_TABLE . ' WHERE id = ?')) {

            $stmt->bind_param("s", $this->_rid);

            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No role found for this ID");

            $role = $stmt->get_result()->fetch_assoc();

            return $role;
        }

        return "no role found";
    }

    public function addNewRole()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        $idCheck = false;
        while (!$idCheck) {
            $id = mt_rand(0, 99999);
            // echo json_encode($id . '<br>');
            $idCheck = $this->checkRoleId($id);
        }

        if ($stmt = $con->prepare('INSERT INTO ' . self::ROLE_TABLE . ' (id,rname) VALUES (?,?)')) {

            $stmt->bind_param("is", $id, $this->_rname);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no role added in DB");
                echo json_encode("error stmt");
                return false;
            }

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }

        echo json_encode("pas passed");
        return false;
    }

    public function checkRoleId($id)
    {
        $con = MonSQLi::sqli();

        if ($stmt = $con->prepare('SELECT rname FROM ' . self::ROLE_TABLE . ' WHERE id = ?')) {
            $stmt->bind_param("s", $id);
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No role found for this ID");

            $role = $stmt->get_result()->fetch_assoc();

            if (!$role['rname'])
                return true;
        }

        return false;
    }

    public function updateRole()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('UPDATE ' . self::ROLE_TABLE . ' SET rname = ? WHERE id = ?')) {
            $stmt->bind_param("ss", $this->_rname, $this->_rid);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no role update in DB");
                return false;
            }

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }

        return false;
    }

    public function deleteRole()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('DELETE FROM ' . self::ROLE_TABLE . ' WHERE id = ?')) {
            $stmt->bind_param("s", $this->_rid);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Error: no role deleted in DB");
                return false;
            }

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }
        return false;
    }

    public function exists()
    {
        return false;
    }
}
