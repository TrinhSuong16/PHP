<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Author: dung.huynh@southtelecom.vn
 *
 * Configuration file for ping
 *
 */

/* events sse config */
$config['events'] = array(
	"today_stats"					=> 1,
	"client_infomation"				=> 1,
	"inbound" 						=> 1,
	"outbound"						=> 1,
	"sla_outbound"					=> 1,
	"sla_inbound"					=> 1,
	"recent_calls"					=> 1,
	"follow_up_menu_notifications"	=> "gi gi-pushpin",
	"return_pool_menu_notifications"=> "fa-user-secret"
);;