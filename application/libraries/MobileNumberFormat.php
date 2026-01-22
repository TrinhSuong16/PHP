<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

/* 
 * Copyright © 2014 South Telecom
 */
/**
 * @property  WFF_Controller $WFF  Instance of super object Controller.
 */

class MobileNumberFormat 
{

    public static $VIETTEL = "viettel";
    public static $MOBIFONE = "mobifone";
    public static $VINAPHONE = "vinaphone";
    public static $VIETNAMMOBILE = "vietnammobile";
    public static $GMOBILE = "gmobile";
    public static $INTERNATIONAL = "international";
    public static $UNSUPPORT = "unsupport";

    public static function FindOperator($phone) 
    {
        if (preg_match ( "/^(?:(?:\+84|84)|0)(?:(?:9[678]|16[0-9])|86)\d{7}$/", $phone )) {
            return MobileNumberFormat::$VIETTEL;
        }
        if (preg_match ( "/^(?:(?:\+84|84)|0)(?:(?:9[03]|12[01268])|89)\d{7}$/", $phone )) {
            return MobileNumberFormat::$MOBIFONE;
        }
        if (preg_match ( "/^(?:(?:\+84|84)|0)(?:(?:9[14]|12[34579])|88)\d{7}$/", $phone )) {
            return MobileNumberFormat::$VINAPHONE;
        }
        if (preg_match ( "/^(?:(?:\+84|84)|0)(?:(?:92|186)|188)\d{7}$/", $phone )) {
            return MobileNumberFormat::$VIETNAMMOBILE;
        }
        if (preg_match ( "/^(?:(?:\+84|84)|0)(?:99|199)\d{7}$/", $phone )) {
            // (preg_match("/^(?:(?:\+84|84)|0)(?:(?:99[123456789]|990)|199[0-9])\d{6}$/",$phone)){
            return MobileNumberFormat::$GMOBILE;
        }
        if (preg_match ( "/^(?:(\+)|00)\d{8,13}$/", $phone )) {
            return MobileNumberFormat::$INTERNATIONAL;
        }
        return MobileNumberFormat::$UNSUPPORT;
    }

    public static function normalize($phone) 
    {
        $op = MobileNumberFormat::FindOperator ( $phone );
        if ($op === MobileNumberFormat::$UNSUPPORT) {
            return FALSE;
        } else if ($op === MobileNumberFormat::$INTERNATIONAL) {
            if (0 === strpos ( $phone, '00' )) {
                return substr ( $phone, 2 );
            }
            if (0 === strpos ( $phone, '+' )) {
                return substr ( $phone, 1 );
            }
        } else {
            if (0 === strpos ( $phone, '0' )) {
                return "84" . substr ( $phone, 1 );
            }
            return $phone;
        }
    }

    public static function countSMS($phone, $message) 
    {
        $op = MobileNumberFormat::FindOperator ( $phone );
        if ($op === MobileNumberFormat::$VIETTEL) {
            return (strlen ( $message ) > 160) ? ((strlen ( $message ) > 306) ? 3 : 2) : 1;
        } else if ($op === MobileNumberFormat::$VINAPHONE) {
            return (strlen ( $message ) > 160) ? ((strlen ( $message ) > 306) ? 3 : 2) : 1;
        } else if ($op === MobileNumberFormat::$VIETNAMMOBILE) {
            return (strlen ( $message ) > 160) ? ((strlen ( $message ) > 306) ? 3 : 2) : 1;
        } else if ($op === MobileNumberFormat::$MOBIFONE) {
            return (strlen ( $message ) > 160) ? ((strlen ( $message ) > 306) ? 3 : 2) : 1;
        } else if ($op === MobileNumberFormat::$GMOBILE) {
            return (strlen ( $message ) > 160) ? ((strlen ( $message ) > 306) ? 3 : 2) : 1;
        } else {
            return (strlen ( $message ) > 160) ? ((strlen ( $message ) > 306) ? 3 : 2) : 1;
        }
    }

}