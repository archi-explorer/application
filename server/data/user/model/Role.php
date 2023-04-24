<?php

require_once("MySQLi.php");

class Role
{
    private $_rid;

    const ROLE_TABLE = "Role";

    public function __construct($id)
    {
        $this->setRoleId($id);
    }

    public function setRoleId($id)
    {
        $this->_rid = $id;
    }

    public function getRoleId()
    {
        return $this->_rid;
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
                throw new Exception("Error: No role find for this ID");

            $role = $stmt->get_result()->fetch_assoc();

            return $role;
        }

        return "no role found";
    }

    public function addRole(string $rname)
    {
        if ($this->exists())
            return false;

        return false;
    }

    public function updateRole(int $rid)
    {
        return false;
    }

    public function deleteRole(int $rid)
    {
        return false;
    }

    public function exists()
    {
        return false;
    }
}
