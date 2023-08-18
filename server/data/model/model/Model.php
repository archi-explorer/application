<?php

require_once("MySQLi.php");

class Model
{
    private $_mid;
    private $_mname;
    private $_mcity;
    private $_extension;

    const MODEL_TABLE = "Model";
    const ROLE_TABLE = "Role";
    const ACCESS_TABLE = "Access";


    public function __construct($mid = null, $mname, $mcity, $extension)
    {
        $this->setModelId($mid);
        $this->setModelName($mname);
        $this->setModelCity($mcity);
        $this->setModelExtension($extension);
    }

    public function getModelId()
    {
        return $this->_mid;
    }

    public function setModelId($id)
    {
        $this->_mid = $id;
    }

    public function setModelName($mname)
    {
        $this->_mname = $mname;
    }

    public function getModelName()
    {
        return $this->_mname;
    }

    public function setModelCity($mcity)
    {
        $this->_mcity = $mcity;
    }

    public function getModelCity()
    {
        return $this->_mcity;
    }

    public function setModelExtension($extension)
    {
        $this->_extension = $extension;
    }

    public function getModelExtension()
    {
        return $this->_extension;
    }


    public function getAllModel($rid)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if (

            // $stmt = $con->prepare('SELECT m.id, m.mname, m.mcity, r.rname FROM ' . self::MODEL_TABLE . ' m INNER JOIN ' . self::ROLE_TABLE . ' r ON m.r_id = r.id WHERE m.r_id = ? ORDER BY m.mname ASC')

            $stmt = $con->prepare('SELECT m.id, m.mname, m.mcity, m.ext FROM ' . self::MODEL_TABLE . ' m WHERE m.id IN (SELECT a.m_id FROM ' . self::ACCESS_TABLE . ' a WHERE a.r_id = ? ) ORDER BY m.mname ASC')
        ) {
            $stmt->bind_param("s", $rid);
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No Model found or DB access failed");

            return $stmt->get_result()->fetch_all();
        }

        return "";
    }

    public function addModel()
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('INSERT INTO ' . self::MODEL_TABLE . ' (id, mname, mcity, ext) VALUES (?, ?, ?, ?)')) {
            $stmt->bind_param("ssss", $this->_mid, $this->_mname, $this->_mcity, $this->_extension);

            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No Model found or DB access failed");

            if ($stmt->affected_rows == 0)
                return false;

            if ($stmt2 = $con->prepare('SELECT id FROM ' . self::MODEL_TABLE . ' WHERE mname = ?')) {
                $stmt2->bind_param("s", $this->_mname);
                $stmt2->execute();

                if (!$stmt2)
                    throw new Exception("Error: No Model found or DB access failed");

                $id = $stmt2->get_result()->fetch_assoc();

                return $id['id'];
            }
            return false; // "no stmt2"
        }

        return false; //"no stmt add"
    }

    public function deleteModel($mid)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('DELETE FROM ' . self::MODEL_TABLE . ' WHERE id = ?')) {
            $stmt->bind_param("s", $mid);

            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No Model found or DB access failed");

            if ($stmt->affected_rows == 0)
                return false;

            return true;
        }
        return false;
    }

    public function getModelNameById($mid)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('SELECT mname FROM ' . self::MODEL_TABLE . ' WHERE id = ?')) {
            $stmt->bind_param("s", $mid);
            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No Model found or DB access failed");

            return $stmt->get_result()->fetch_assoc();
        }

        return "";
    }
}
