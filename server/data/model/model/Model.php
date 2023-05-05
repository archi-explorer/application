<?php

require_once("MySQLi.php");

class Model
{
    private $_mid;
    private $_mname;
    private $_mcity;

    const MODEL_TABLE = "Model";

    public function __construct($mid = null, $mname = "", $mcity = "")
    {
        $this->setModelId($mid);
        $this->setModelName($mname);
        $this->setModelCity($mcity);
    }

    public function getModelId()
    {
        return $this->_mid;
    }

    public function setModelId($id)
    {
        $this->_mid = $id;
    }

    public function setModelName($id)
    {
        $this->_mid = $id;
    }

    public function getModelName()
    {
        return $this->_mid;
    }

    public function setModelCity($id)
    {
        $this->_mid = $id;
    }

    public function getModelCity()
    {
        return $this->_mid;
    }

    /**
     * Return la liste de tous les modèles
     * N'est utilisé que par les admins
     */

    public function getAllModel()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('SELECT * FROM ' . self::MODEL_TABLE)) {
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No Model found or DB access failed");

            $mname = $stmt->get_result()->fetch_all();

            return $mname;
        }

        return "";
    }

    public function addModel($mname,  $rlist)
    {
        return false;
    }

    public function updateModel($mname,  $rid)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('UPDATE ' . self::MODEL_TABLE . ' SET mname = ?, r_id = ? WHERE id = ?')) {
            $stmt->bind_param("sss", $mname, $rid, $this->_mid);

            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No Model found or DB access failed");

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }

        return false;
    }

    public function deleteModel($mid)
    {
        return false;
    }
}
