<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

// Redis extension installed
class WFF_Redis {

	private $_redis;
	private static $CI;

	function __construct(array $conf = ["group" => "wff_redis"])
	{
		static::$CI = &get_instance();
		static::$CI->config->load("redis");
		$configs = static::$CI->config->item($conf["group"]);
		if(empty($configs)){
			$host = '127.0.0.1';
			$port = '6379';
			$pwd = '';
		} else {
			$host = $configs['hostname'];
			$port = $configs['port'];
			$pwd  = $configs['password'];
		}
		
		try{
			$this->_redis = new Redis();
			$this->_redis->connect($host, $port);
            if($pwd) $this->_redis->auth($pwd);
			if(!$this->_redis->ping()){
				throw new Exception('Connection Failed.');
			}
		} catch(Exception $e){
			return false;
		}
	}

	public function __destruct() 
	{
		try {
			$this->_redis->close();
		} catch(Exception $e) {
		}		
	}

	public function keys($key){
		try {
			return $this->_redis->keys($key);
		} catch (Exception $e){
			return false;
		}
	}

	public function get($key){
		try {
			return $this->_redis->get($key);
		} catch (Exception $e){
			return false;
		}
	}

	public function set($key, $val, $ttl = false){
		try {
			$seted = $this->_redis->set($key, $val);
			if($ttl){
                $this->_redis->expire($key, $ttl);
            }
			return $seted;
		} catch (Exception $e){
			return false;
		}
	}

	public function del(...$key){
		try {
			return $this->_redis->del(...$key);
		} catch (Exception $e){
			return false;
		}
	}
	
	public function hkeys($keys){
		try {
			return $this->_redis->hKeys($keys);
		} catch (Exception $e){
			return false;
		}
	}
	
	public function hset($key, $field, $value){
		try {
			return $this->_redis->hSet($key, $field, $value);
		} catch (Exception $e){
			return false;
		}
	}
	
	public function hget($key, $field){
		try {
			return $this->_redis->hGet($key, $field);
		} catch (Exception $e){
			return false;
		}
	}
	
	public function hmset($key, $data = array()){
		try {
			return $this->_redis->hMSet($key, $data);
		} catch (Exception $e){
			return false;
		}
	}
	
	public function hmget($key, $data = array()){
		try {
			return $this->_redis->hMGet($key, $data);
		} catch (Exception $e){
			return false;
		}
	}
	
	public function hDel($key, ...$hashKey){
		try {
			return $this->_redis->hDel($key, ...$hashKey);
		} catch (Exception $e){
			return false;
		}
	}
	
	public function hDelArr($key, $hashKeys=array()){
		try {
			foreach($hashKeys as $item){
				$this->_redis->hDel($key, $item);
			}
			return true;
		} catch (Exception $e){
			return false;
		}
	}
	
	//Returns the values in a hash, as an array of strings.
	public function hVals($key){
		try {
			return $this->_redis->hVals($key);
		} catch (Exception $e){
			return false;
		}
	}
	
	//Add key -> value 
	public function sAdd($key, ...$value){
		try {
			return $this->_redis->sAdd($key, ...$value);
		} catch (Exception $e){
			return false;
		}
	}
	
	//lat tat ca gia tri trong key dc them tu sAdd 
	public function sMembers($key){
		try {
			return $this->_redis->sMembers($key);
		} catch (Exception $e){
			return false;
		}
	}
	
	//Chuyen value tu key1 qua key2 (sAdd)
	public function sMove($key1,$key2,$value){
		try {
			return $this->_redis->sMove($key1,$key2,$value);
		} catch (Exception $e){
			return false;
		}
	}
	
	//check value co trong key dc them tu sAdd 
	public function sIsMember($key, $value){
		try {
			return $this->_redis->sIsMember($key, $value);
		} catch (Exception $e){
			return false;
		}
	}
	
	//Lay data da add vao boi sAdd
	public function sInter(...$keys){
		try {
			return $this->_redis->sInter(...$keys);
		} catch (Exception $e){
			return false;
		}
	}
	
	//Lay random data da add vao boi sAdd
	public function sRandMember($key, $count=1){
		try {
			return $this->_redis->sRandMember($key, $count);
		} catch (Exception $e){
			return false;
		}
	}
	
	//Xoa value trong key da add vao boi sAdd
	public function sRem($key, ...$value){
		try {
			return $this->_redis->sRem($key, ...$value);
		} catch (Exception $e){
			return false;
		}
	}
	//Xoa value trong key da add vao boi sAdd (tuong tu sRem va se bi xoa trong tuong lai)
	public function sRemove($key, ...$value){
		try {
			return $this->_redis->sRemove($key, ...$value);
		} catch (Exception $e){
			return false;
		}
	}
	
	//Increment member of key
	public function hIncrBy($key, $member, $value){
		try {
			return $this->_redis->hIncrBy($key, $member, $value);
		} catch (Exception $e){
			return false;
		}
	}
}