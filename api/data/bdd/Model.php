<?php

require_once("MySQLi.php");

class Model
{
    private string $_mid;

    private const MODEL_TABLE = "Model";

    public function __construct(int $mid)
    {
        $this->setModelId($mid);
    }

    public function getModelId(): int
    {
        return $this->_mid;
    }

    public function setModelId($id): void
    {
        $this->_mid = $id;
    }

    public function getModelName(): string
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            exit(1);
        }

        if ($stmt = $con->prepare('SELECT mname FROM ' . self::MODEL_TABLE . ' WHERE id = ?')) {
            $stmt->bind_param("s", $this->_mid);

            $stmt->execute();

            if (!$stmt)
                throw new Exception("Error: No Model found or DB access failed");

            $mname = $stmt->get_result()->fetch_assoc();

            return $mname['mname'];
        }

        return "";
    }

    public function addModel(string $mname, array $rlist): bool
    {
        return false;
    }

    public function updateModel(string $mname, string $rid): bool
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

    public function deleteModel(int $mid): bool
    {
        return false;
    }
}
