<?php

require_once("MySQLi.php");

class Access
{
    private $_mid;
    private $_rid;

    const ACCESS_TABLE = "Access";
    const ROLE_TABLE = "Role";

    public function __construct($mid, $rid)
    {
        $this->setModelId($mid);
        $this->setRoleId($rid);
    }

    public function getModelId()
    {
        return $this->_mid;
    }

    public function setModelId($id)
    {
        $this->_mid = $id;
    }

    public function getRoleId()
    {
        return $this->_rid;
    }

    public function setRoleId($rid)
    {
        $this->_rid = $rid;
    }

    /**
     * Return la liste de tous les modèles auxquels un rôle a accès
     */

    public function getAllModel($rid)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
            exit(1);
        }

        if ($stmt = $con->prepare("SELECT m_id FROM " . self::ACCESS_TABLE . " WHERE r_id = ?")) {
            $stmt->bind_param("s", $rid);
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Erreur de requête : " . $con->error);

            return $stmt->get_result()->fetch_all();
        }

        return "";
    }

    /**
     * Return la liste de tous les rôles auxquels un modèle a accès
     */

    public function getAllRole($mid)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
            exit(1);
        }

        if ($stmt = $con->prepare("SELECT a.r_id, r.rname FROM " . self::ACCESS_TABLE . " a INNER JOIN " . self::ROLE_TABLE . " r ON r.id=a.r_id WHERE a.m_id = ? AND a.r_id != 1")) {
            $stmt->bind_param("s", $mid);
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Erreur de requête : " . $con->error);

            return $stmt->get_result()->fetch_all();
        }

        return false;
    }

    /**
     * Ajoute un accès à un modèle pour un rôle
     */

    public function addAccess()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
            exit(1);
        }

        if ($stmt = $con->prepare("INSERT INTO " . self::ACCESS_TABLE . " (m_id, r_id) VALUES (?, ?)")) {
            $stmt->bind_param("ss", $this->_mid, $this->_rid);
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Erreur de requête : " . $con->error);

            if ($stmt->affected_rows == 0)
                throw new Exception("Erreur : aucun accès n'a été ajouté");

            return true;
        }

        return false;
    }

    /**
     * Supprime un accès à un modèle pour un rôle
     */

    public function deleteAccess()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
            exit(1);
        }

        if ($stmt = $con->prepare("DELETE FROM " . self::ACCESS_TABLE . " WHERE m_id=? AND r_id=?")) {
            $stmt->bind_param("ss", $this->_mid, $this->_rid);
            $stmt->execute();

            if (!$stmt) {
                throw new Exception("Erreur de requête : " . $con->error);
                return false;
            }

            if ($stmt->affected_rows == 0) {
                throw new Exception("Erreur : aucun accès n'a été supprimé");
                return false;
            }
            return true;
        }

        return false;
    }
}
