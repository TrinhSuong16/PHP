<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

function PBX_Menu_Permissions() : array
{
	$CI =& get_Instance();
	$version = "2";
	$permissions = [];
        
        /***/
        $menus = [
            "reports"    	=> ["report_one", "report_two", "report_three"],
            "smssent" => 1,
            "smssent_jquery_view" => 1,
        ];
         /* 
         */
	return $menus;
}

if (!function_exists('http_response_code')) {
	function http_response_code($newcode = null) : int
	{
		static $code = 200;
        if ($newcode !== null) {
            header('X-PHP-Response-Code: ' . $newcode, true, $newcode);
            if (!headers_sent()) {
                $code = $newcode;
            }
        }
        return $code;
	}
}

if(!function_exists('guidv4')) {
	function guidv4($data = null) : string
	{
		// Generate 16 bytes (128 bits) of random data or use the data passed into the function.
		$data = $data ?? random_bytes(16);
		assert(strlen($data) == 16);
	
		// Set version to 0100
		$data[6] = chr(ord($data[6]) & 0x0f | 0x40);
		// Set bits 6-7 to 10
		$data[8] = chr(ord($data[8]) & 0x3f | 0x80);
	
		// Output the 36 character UUID.
		return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
	}
}

if(!function_exists('curl_get_file_size')) {
	function curl_get_file_size( $url ) {
		// Assume failure.
		$result = -1;

		$curl = curl_init( $url );
		// Issue a HEAD request and follow any redirects.
		curl_setopt( $curl, CURLOPT_NOBODY, true );
		curl_setopt( $curl, CURLOPT_HEADER, true );
		curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $curl, CURLOPT_FOLLOWLOCATION, true );
		$data = curl_exec( $curl );
		curl_close( $curl );
		if( $data ) {
			$content_length = "unknown";
			$status = "unknown";

			if( preg_match( "/^HTTP\/1\.[01] (\d\d\d)/", $data, $matches ) ) {
				$status = (int)$matches[1];
			}

			if( preg_match( "/Content-Length: (\d+)/", $data, $matches ) ) {
				$content_length = (int)$matches[1];
			}

			// http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
			if( $status == 200 || ($status > 300 && $status <= 308) ) {
				$result = $content_length;
			}
		}

		return $result;
	}
}

function json_output(array $response = array(), int $code = 200) : void
{
	$CI =& get_Instance();
	if($CI->config->item('csrf_protection')===TRUE) {
		$response = array_merge($response, array(
			'csrf' => array(
				"name"      =>  $CI->security->get_csrf_token_name(), 
				"value"     =>  $CI->security->get_csrf_hash()
			)
		));
	}

	http_response_code($code);
	header('Content-Type: application/json');
	exit(json_encode($response));
}

function json_nodata()
{
	json_output(["data" => [], "total" => 0]);
}

function enqueue_styles($style_url = '', $position = 10, $style_versions = '1.0' ) : void
{
	$CI = & get_Instance();
	$styles_header = [];
	
	if(is_array($style_url)){
		foreach($style_url as $url) {
			$styles_header[$position][] = '<link rel="stylesheet" id="css-'.rand().'"  href="'.$url.(!empty($style_versions)? "?ver=$style_versions" : "").'" type="text/css" media="all" />';
		}
	} else {
		$styles_header[$position][] = '<link rel="stylesheet" id="css-'.rand().'"  href="'.$style_url.(!empty($style_versions)? "?ver=$style_versions" : "").'" type="text/css" media="all" />';
	}
	$CI->styles_header = $styles_header;
}

function enqueue_styles_footer($style_url = '', $position = 10, $style_versions = '1.0' ) : void
{
	$CI = & get_Instance();
	$styles_footer = [];
	
	if(is_array($style_url)){
		foreach($style_url as $url) {
			$styles_footer[$position][] = '<link rel="stylesheet" id="css-'.rand().'"  href="'.$url.(!empty($style_versions)? "?ver=$style_versions" : "").'" type="text/css" media="all" />';
		}
	} else {
		$styles_footer[$position][] = '<link rel="stylesheet" id="css-'.rand().'"  href="'.$style_url.(!empty($style_versions)? "?ver=$style_versions" : "").'" type="text/css" media="all" />';
	}
	$CI->styles_footer = $styles_footer;
}

function enqueue_scripts( $script_url = '', $position = 10, $script_versions = '1.0') : void
{
	$CI = &get_Instance();

	$scripts_header=[];
        
	
	if(is_array($script_url)){
		foreach($script_url as $url) {
			$scripts_header[$position][] = '<script type="text/javascript"  src="'.$url.(!empty($script_versions)? "?ver=$script_versions" : "").'"></script>';
		}
	} else {
		$scripts_header[$position][] = '<script type="text/javascript"  src="'.$script_url.(!empty($script_versions)? "?ver=$script_versions" : "").'"></script>';
	}
	$CI->scripts_header  = $scripts_header;
        
}

function enqueue_scripts_footer( $script_urls = '', $position = 10, $script_versions = '1.0') : void
{
	$CI = &get_Instance();

	$scripts_footer =[];
        
	
	if(is_array($script_urls)){
		foreach($script_urls as $script_url) {
			$scripts_footer[$position][] = '<script type="text/javascript"  src="'.$script_url.(!empty($script_versions)? "?ver=$script_versions" : "").'"></script>';
		}
	} else {
		$scripts_footer[$position][] = '<script type="text/javascript" src="'.$script_urls.(!empty($script_versions)? "?ver=$script_versions" : "").'"></script>';
	}
	$CI->scripts_footer = $scripts_footer;
}

function dequeue_scripts($user_type='customer'): string {
    $CI = & get_Instance();
    $scripts_header_default = array();
    /*
    * Config default header scripts here
    */
    
    $scripts_header = (!empty($CI->scripts_header)) ?  array_merge($scripts_header_default, $CI->scripts_header): $scripts_header_default;
    
    ksort($scripts_header);
    $html = "";
    foreach ($scripts_header as $script_group) {
        $html .= join(PHP_EOL, $script_group) . PHP_EOL;
    }
    return $html;
}

function dequeue_scripts_footer($user_type='customer'): string {

    $CI = & get_Instance();

    $scripts_footer_default = array();
    $scripts_footer_default["0"] = [
        '<script src="'. base_url("public/vendors/js/vendors.min.js"). '"></script>',
    ];
    
    $scripts_footer_default["1"] = [
        '<script src="'. base_url("public/js/core/app-menu.min.js"). '"></script>',
        '<script src="'. base_url("public/js/core/app.min.js"). '"></script>',
    ];
    
    if (isset($CI->load->_ci_cached_vars["kendo"])) {
        $scripts_footer_default["2"] = [
            '<script type="text/javascript">var controlsKendo=' . json_encode($CI->load->_ci_cached_vars["kendo"]) . '</script>',
        ];
    }
    
    $scripts_footer = (!empty($CI->scripts_footer)) ? array_merge($scripts_footer_default, $CI->scripts_footer) : $scripts_footer_default;
    
    
    ksort($scripts_footer);
    $html = "";
    foreach ($scripts_footer as $script_group) {
        $html .= join(PHP_EOL, $script_group) . PHP_EOL;
    }
    return $html;
}

function dequeue_styles($user_type='customer') : string
{
    $CI = & get_Instance();

    $styles_header_default["0"] = [
            '<!-- BEGIN: Vendor CSS-->',
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/vendors/css/vendors.min.css"). '">',
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/css/bootstrap-tagsinput.css"). '">',
            '<!-- END: Vendor CSS-->',
            '<!-- BEGIN: Theme CSS-->',
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/css/bootstrap.min.css"). '">',
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/css/bootstrap-extended.min.css"). '">',
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/css/colors.min.css"). '">',
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/css/components.min.css"). '">',
            '<link rel="stylesheet" type="text/css" href="' . base_url("private/css/style.min.css") . '">',
            '<!-- END: Theme CSS-->',
        ];
   

    if ($user_type === "customer") {
        $styles_header_default["1"] = [
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/css/core/menu/menu-types/vertical-menu.min.css"). '">',
        ];
    } elseif ($user_type === "employee") {
        $styles_header_default["1"] = [
            '<link rel="stylesheet" type="text/css" href="' . base_url("public/css/core/menu/menu-types/horizontal-menu.min.css"). '">',
        ];
    }
    

    if (!empty($CI->styles_header)) {
        $styles = array_merge($styles_header_default, $CI->styles_header);
    }
    else{
        $styles = $styles_header_default;
    }

    ksort($styles);
    $html = "";
    foreach ($styles as $style_group) {
        $html .= join(PHP_EOL, $style_group) . PHP_EOL;
    }
    return $html;
    
}

function dequeue_styles_footer($user_type='customer'): string {
    $CI = & get_Instance();
    $styles_footer_default  =  [];
    /*
     * Config $styles_footer_default at here 
     */
    
    $styles_footer = (!empty($CI->styles_footer)) ? array_merge($styles_footer_default, $CI->styles_footer) : $styles_footer_default;
    
    ksort($styles_footer);
    $html = "";
    foreach ($styles_footer as $style_group) {
        $html .= join(PHP_EOL, $style_group) . PHP_EOL;
    }
    return $html;
}



function kendoFilters(&$request) {
	//
	//neq
	//startswith
	//doesnotcontain
	//endswith
	//isnull
	//isnotnull
	//isempty
	//isnotempty
	//isnullorempty
	//isnotnullorempty
	$where = array();
	if(isset($request["filter"]["filters"])) {
		$filters = $request["filter"]["filters"];
		$logic = $request["filter"]["logic"];
		foreach($filters as $filter) {
			switch($filter['operator']) {
				case "neq":
					$filter['field'] = $filter['field'] . "!=";
					$filter['operator'] = "eq";
					break;
			}
			$where[$logic][$filter['operator']][$filter['field']]= $filter['value'];
		}
	}
	if(!isset($request['take'])) $request['take'] = 20;
	if(!isset($request['skip'])) $request['skip'] = 0;
	return $where;
}
