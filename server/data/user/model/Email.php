<?php

require_once("MySQLi.php");

class Email
{
    private $_to;
    private $_headers;
    private $_subject;
    private $_message;

    const USER_TABLE = "User";

    public function __construct($headers = null, $subject = null, $message = null)
    {
        $this->setSender();
        $this->setHeaders($headers);
        $this->setSubject($subject);
        $this->setMessage($message);
    }


    public function setSender()
    {
        $this->_to = "archi-explorer@archimed-ge.com";
    }

    public function getHeaders()
    {
        return $this->_headers;
    }
    public function setHeaders($headers)
    {
        $this->_headers = $headers;
    }

    public function getSubject()
    {
        return $this->_subject;
    }
    public function setSubject($subject)
    {
        $this->_subject = $subject;
    }

    public function getMessage()
    {
        return $this->_message;
    }
    public function setMessage($message)
    {
        $this->_message = $message;
    }

    public function sendEmail()
    {
        try {
            mail($this->_to, $this->_subject, $this->_message, $this->_headers);
            return true;
        } catch (Exception $e) {
            print_r($e->getMessage());
            exit(1);
        } catch (PDOException $e) {
            print_r($e->getMessage());
            exit(1);
        }
    }

    public function exist($email)
    {
        $con = MonSQLi::sqli();

        if (mysqli_connect_errno()) {
            echo ("connection error");
            exit(1);
        }

        if ($stmt = $con->prepare('SELECT email FROM ' . self::USER_TABLE)) {
            try {
                $stmt->execute();
            } catch (Exception $e) {
                return false;
            }

            if (!$stmt) {
                throw new Exception("Error: email access in DB failed");
                return false;
            }

            try {
                $emails = $stmt->get_result()->fetch_all();
            } catch (Exception $e) {
                throw new Exception("Error: No mail found");
            }

            // echo json_encode($emails[0][0]);

            $l = 0;

            while ($l < sizeof($emails)) {
                // echo json_encode($emails[$l][0]);
                if ($emails[$l][0] === $email) {
                    return true;
                }
                $l++;
            }

            return false;
        }
    }
}
