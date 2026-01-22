<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

function removeVNChar($str) : string
{
	if(!$str) return false;
	$utf8 = array(
		'a'=>'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
		'd'=>'đ|Đ',
		'e'=>'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
		'i'=>'í|ì|ỉ|ĩ|ị|Í|Ì|Ỉ|Ĩ|Ị',
		'o'=>'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
		'u'=>'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
		'y'=>'ý|ỳ|ỷ|ỹ|ỵ|Ý|Ỳ|Ỷ|Ỹ|Ỵ',
	);
	foreach($utf8 as $ascii => $uni) $str = preg_replace("/($uni)/i", $ascii, $str);
	// return str_replace(' ','',$str);
	return $str;
}

function checkIsPhone($phone)
{
	if(preg_match("/^(?:(?:\+84|84)|0)(?:(?:9[678]|3[2-9])|86)\d{7}/",$phone)) {
        return "viettel";
    }

	if(preg_match("/^(?:(?:\+84|84)|0)(?:(?:9[03]|7[06789])|89)\d{7}/",$phone)) {
        return "mobifone";
    }

	if(preg_match("/^(?:(?:\+84|84)|0)(?:9[14]|8[123458])\d{7}/",$phone)) {
        return "vinaphone";
    }

	if(preg_match("/^(?:(?:\+84|84)|0)(?:92|5[268])\d{7}/",$phone)) {
        return "vietnammobile";
    }

	if(preg_match("/^(?:(?:\+84|84)|0)(?:9[59]|59)\d{7}/",$phone)) {
        return "gmobile";
    }

	if(preg_match("/^(?:(?:\+84|84)|0)(?:9[55]|55)\d{7}/",$phone)) {
		return "reddi";
	}

	if(preg_match("/^(?:(?:\+84|84)|0)(87)\d{7}/",$phone)) {
        return "itelecom";
    }

	if(preg_match("/^(?:(?:\+84|84)|0)(2)\d{8}/",$phone)||preg_match("/^(?:(?:\+84|84)|0)(80)\d{7}/",$phone)) {
        return "fix";
    }
	return false;
}