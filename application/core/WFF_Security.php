<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

class WFF_Security extends CI_Security {

    /**
     * Set Cross Site Request Forgery Protection Cookie
     *
     * @return  object
     */
    public function csrf_set_cookie()
	{
		$expire = time() + $this->_csrf_expire;
		$secure_cookie = (bool) config_item('cookie_secure');

		if ($secure_cookie) {
			if ( ! empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') {
			} elseif (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
			} elseif ( ! empty($_SERVER['HTTP_FRONT_END_HTTPS']) && strtolower($_SERVER['HTTP_FRONT_END_HTTPS']) !== 'off') {
			} elseif ( ! empty($_SERVER['HTTP_X_FORWARDED_FOR']) ) {
			} else {
				return FALSE;
			}
		}

		setcookie(
			$this->_csrf_cookie_name,
			$this->_csrf_hash,
			$expire,
			config_item('cookie_path'),
			config_item('cookie_domain'),
			$secure_cookie,
			config_item('cookie_httponly')
		);
        // var_dump($this->_csrf_cookie_name);
		log_message('info', 'CSRF cookie sent');

		return $this;
	}

}