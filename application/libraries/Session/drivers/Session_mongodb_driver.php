<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CI_Session_mongodb_driver extends CI_Session_driver implements SessionHandlerInterface {

	/**
	 * DB object
	 *
	 * @var	object
	 */
	protected $mongo_db;

	/**
	 * Row exists flag
	 *
	 * @var	bool
	 */
	protected $_row_exists = FALSE;

	/**
	 * Lock "driver" flag
	 *
	 * @var	string
	 */
	protected $_platform;

	// ------------------------------------------------------------------------

	/**
	 * Class constructor
	 *
	 * @param	array	$params	Configuration parameters
	 * @return	void
	 */
	public function __construct(&$params)
	{
		parent::__construct($params);

		$CI =& get_instance();
		isset($CI->mongo_db) OR $CI->load->library("mongo_db");
		$this->mongo_db = $CI->mongo_db;

		$this->_platform = 'mongodb';

		// Note: BC work-around for the old 'sess_table_name' setting, should be removed in the future.
		if ( ! isset($this->_config['save_path']) && ($this->_config['save_path'] = config_item('sess_table_name')))
		{
			log_message('debug', 'Session: "sess_save_path" is empty; using BC fallback to "sess_table_name".');
		}
	}

	// ------------------------------------------------------------------------

	/**
	 * Open
	 *
	 * Initializes the database connection
	 *
	 * @param	string	$save_path	Table name
	 * @param	string	$name		Session cookie name, unused
	 * @return	bool
	 */
	public function open($save_path, $name)
	{
		if (empty($this->mongo_db))
		{
			return $this->_fail();
		}

		$this->php5_validate_id();

		return $this->_success;
	}

	// ------------------------------------------------------------------------

	/**
	 * Read
	 *
	 * Reads session data and acquires a lock
	 *
	 * @param	string	$session_id	Session ID
	 * @return	string	Serialized session data
	 */
	public function read($session_id)
	{
		if ($this->_get_lock($session_id) !== FALSE)
		{
			// Needed by write() to detect session_regenerate_id() calls
			$this->_session_id = $session_id;

			$this->mongo_db->select(array('data'))->where('session_id', $session_id);

			if ($this->_config['match_ip'])
			{
				$this->mongo_db->where('ip_address', $_SERVER['REMOTE_ADDR']);
			}

			if ( ! ($result = $this->mongo_db->getOne($this->_config['save_path'])) )
			{
				// PHP7 will reuse the same SessionHandler object after
				// ID regeneration, so we need to explicitly set this to
				// FALSE instead of relying on the default ...
				$this->_row_exists = FALSE;
				$this->_fingerprint = md5('');
				return '';
			}

			// PostgreSQL's variant of a BLOB datatype is Bytea, which is a
			// PITA to work with, so we use base64-encoded data in a TEXT
			// field instead.
			// print_r($result[0]);die;
			$result = $result[0]["data"];

			$this->_fingerprint = md5($result);
			$this->_row_exists = TRUE;
			return $result;
		}

		$this->_fingerprint = md5('');
		return '';
	}

	// ------------------------------------------------------------------------

	/**
	 * Write
	 *
	 * Writes (create / update) session data
	 *
	 * @param	string	$session_id	Session ID
	 * @param	string	$session_data	Serialized session data
	 * @return	bool
	 */
	public function write($session_id, $session_data)
	{
		// Was the ID regenerated?
		if (isset($this->_session_id) && $session_id !== $this->_session_id)
		{
			if ( ! $this->_release_lock() OR ! $this->_get_lock($session_id))
			{
				return $this->_fail();
			}

			$this->_row_exists = FALSE;
			$this->_session_id = $session_id;
		}
		elseif ($this->_lock === FALSE)
		{
			return $this->_fail();
		}
		if ($this->_row_exists === FALSE)
		{
			$insert_data = array(
				'session_id' => $session_id,
				'username' => isset($_SESSION['username']) ? $_SESSION['username'] : null,
				'ip_address' => $_SERVER['REMOTE_ADDR'],
				'timestamp' => time(),
				'data' => $session_data
			);
			if ($this->mongo_db->insert($this->_config['save_path'], $insert_data))
			{
				$this->_fingerprint = md5($session_data);
				$this->_row_exists = TRUE;
				return $this->_success;
			}

			return $this->_fail();
		}

		$this->mongo_db->where('session_id', $session_id);
		if ($this->_config['match_ip'])
		{
			$this->mongo_db->where('ip_address', $_SERVER['REMOTE_ADDR']);
		}

		$update_data = array('timestamp' => time());
		if ($this->_fingerprint !== md5($session_data))
		{
			$update_data['username'] = isset($_SESSION['username']) ? $_SESSION['username'] : null;
			$update_data['data'] = $session_data;
		}

		if ($this->mongo_db->set($update_data)->update($this->_config['save_path']))
		{
			$this->_fingerprint = md5($session_data);
			return $this->_success;
		}
		
		return $this->_fail();
	}

	// ------------------------------------------------------------------------

	/**
	 * Close
	 *
	 * Releases locks
	 *
	 * @return	bool
	 */
	public function close()
	{
		return ($this->_lock && ! $this->_release_lock())
			? $this->_fail()
			: $this->_success;
	}

	// ------------------------------------------------------------------------

	/**
	 * Destroy
	 *
	 * Destroys the current session.
	 *
	 * @param	string	$session_id	Session ID
	 * @return	bool
	 */
	public function destroy($session_id)
	{
		if ($this->_lock)
		{

			$this->mongo_db->where('session_id', $session_id);
			if ($this->_config['match_ip'])
			{
				$this->mongo_db->where('ip_address', $_SERVER['REMOTE_ADDR']);
			}
			if ( ! $this->mongo_db->delete($this->_config['save_path']))
			{
				return $this->_fail();
			}
		}

		if ($this->close() === $this->_success)
		{
			$this->_cookie_destroy();
			return $this->_success;
		}

		return $this->_fail();
	}

	// ------------------------------------------------------------------------

	/**
	 * Garbage Collector
	 *
	 * Deletes expired sessions
	 *
	 * @param	int 	$maxlifetime	Maximum lifetime of sessions
	 * @return	bool
	 */
	public function gc($maxlifetime)
	{

		return ($this->mongo_db->where(array("timestamp" => array('$lt' => (time()-$maxlifetime))))->delete($this->_config['save_path']))
			? $this->_success
			: $this->_fail();
	}

	// --------------------------------------------------------------------

	/**
	 * Validate ID
	 *
	 * Checks whether a session ID record exists server-side,
	 * to enforce session.use_strict_mode.
	 *
	 * @param	string	$id
	 * @return	bool
	 */
	public function validateSessionId($id)
	{
		$this->mongo_db->where('session_id', $id);
		empty($this->_config['match_ip']) OR $this->mongo_db->where('ip_address', $_SERVER['REMOTE_ADDR']);
		$result = $this->mongo_db->getOne($this->_config['save_path']);

		return ! empty($result);
	}

	// ------------------------------------------------------------------------

	/**
	 * Get lock
	 *
	 * Acquires a lock, depending on the underlying platform.
	 *
	 * @param	string	$session_id	Session ID
	 * @return	bool
	 */
	protected function _get_lock($session_id)
	{
		return parent::_get_lock($session_id);
	}

	// ------------------------------------------------------------------------

	/**
	 * Release lock
	 *
	 * Releases a previously acquired lock
	 *
	 * @return	bool
	 */
	protected function _release_lock()
	{
		if ( ! $this->_lock)
		{
			return TRUE;
		}

		return parent::_release_lock();
	}
}
