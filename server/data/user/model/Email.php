<?php

require_once("MySQLi.php");

class Email
{
    private $_to;
    private $_headers;
    private $_subject;
    private $_message;

    public function __construct($headers = null, $subject = null, $message = null)
    {
        $this->setSender();
        $this->setHeaders($headers);
        $this->setSubject($subject);
        $this->setMessage($message);
    }


    public function setSender()
    {
        $this->_to = "qwarth@archimed-ge.com";
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

    public function retrivePassword()
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
}
