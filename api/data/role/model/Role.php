<?php

require_once("MySQLi.php");

class Role
{
    private int $_rid;

    private const ROLE_TABLE = "Role";

    public function __construct(int $id)
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

    public static function getRoleName($rid): string
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            // echo ("connection error");
            exit(1);
        }

        if ($stmt = $con->prepare('SELECT rname FROM ' . self::ROLE_TABLE . ' WHERE id = ?')) {

            $stmt->bind_param("s", $rid);

            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No role find for this ID");

            $role = $stmt->get_result()->fetch_assoc();

            return $role['role'];
        }

        return "";
    }

    public function addRole(string $rname): bool
    {
        if ($this->exists())
            return false;

        return false;
    }

    public function updateRole(int $rid): bool
    {
        return false;
    }

    public function deleteRole(int $rid): bool
    {
        return false;
    }

    public function exists(): bool
    {
        return false;
    }
}
