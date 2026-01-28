<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Worker extends WFF_Controller {
    public function __construct() {
        parent::__construct();
        // Chỉ cho phép chạy qua dòng lệnh (CLI)
        if (!is_cli()) {
            show_404();
            exit;
        }
        $this->load->library('beanstalk');
        $this->load->library('phpmailer_lib');
    }
    public function run() {
        echo "===============================================\n";
        echo "Worker Alpha Center đang chạy...\n";
        echo "===============================================\n";
        while (true) {
            try {
                $pheanstalk = $this->beanstalk->get_instance();
                // Watch tube cụ thể và lấy job
                $job = $pheanstalk
                    ->watch('registration_emails')
                    ->ignore('default')
                    ->reserveWithTimeout(10); // Đợi 10s mỗi vòng lặp để tiết kiệm CPU
                if ($job) {
                    $data = json_decode($job->getData(), true);
                    $task = isset($data['task']) ? $data['task'] : 'send_verification';
                    
                    $this->load->model('email_model');
                    $success = false;

                    // Phân loại task để xử lý
                    switch ($task) {
                        case 'send_verification':
                            $success = $this->email_model->send_verification_email($data);
                            $task_name = "Email XÁC MINH";
                            break;   
                        case 'send_download_link':
                            $success = $this->email_model->send_download_email($data);
                            $task_name = "Email tải tài liệu";
                            break;
                        default:
                            $task_name = "Email KHÔNG XÁC ĐỊNH";
                            break;
                    }
                    if ($success) {
                        echo "THÀNH CÔNG: Đã gửi " . $task_name . " cho " . $data['email'] . "\n";
                                echo "===============================================\n";

                        $pheanstalk->delete($job);
                    } else {
                        echo "THẤT BẠI: Lỗi khi gửi " . $task_name . ". Đang đẩy lại vào hàng đợi.\n";
                                echo "===============================================\n";

                        $pheanstalk->release($job, 1024, 60);
                    }
                }
            } catch (Exception $e) {
                echo "\nLỖI HỆ THỐNG: " . $e->getMessage() . "\n";
                sleep(5); 
            }
            usleep(100000); 
        }
    }
}