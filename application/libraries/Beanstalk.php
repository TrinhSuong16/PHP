<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once './vendor/autoload.php';
use Pheanstalk\Pheanstalk;

class Beanstalk {
    protected $pheanstalk;

    public function __construct() {
        // Kết nối đến server bạn vừa cài đặt (mặc định localhost, port 11300)
        $this->pheanstalk = Pheanstalk::create('127.0.0.1');
    }

    // Hàm để đẩy job vào hàng đợi
    public function push($tube, $data) {
        return $this->pheanstalk
            ->useTube($tube)
            ->put(json_encode($data));
    }

    // Hàm để lấy instance gốc nếu cần dùng các lệnh phức tạp hơn
    public function get_instance() {
        return $this->pheanstalk;
    }
}