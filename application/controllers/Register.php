<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use Pheanstalk\Pheanstalk;
class Register extends WFF_Controller {
    private function style_scripts() {
        enqueue_styles(array(
            base_url("public/vendors/css/pickers/pickadate/pickadate.css"),
            base_url("public/vendors/css/forms/select/select2.min.css"),
            base_url("private/kendo/styles/kendo.default-v2.min.css")
        ));

        enqueue_scripts(array(
            base_url("private/kendo/js/jquery.min.js"),
        ));

        enqueue_scripts_footer(array(
            base_url("private/kendo/js/kendo.all.min.js"),
            base_url("private/kendo/js/jszip.min.js"),
            base_url("private/kendo/js/cultures/kendo.culture." . $this->data['lang_code'] . ".min.js"),
            base_url("private/kendo/js/messages/kendo.messages." . $this->data['lang_code'] . ".min.js"),
            base_url("private/js/moment-1.18.min.js"),
            base_url("public/vendors/js/forms/select/select2.full.min.js"),
            base_url("public/vendors/js/extensions/sweetalert2.all.min.js")
        ));
    }
    public function __construct() {
        parent::__construct();
        $this->load->library('mongo_db');
        $this->load->library('phpmailer_lib');
        $this->load->library('beanstalk');
                date_default_timezone_set('Asia/Ho_Chi_Minh');

    }

    // 1. Hiển thị Form đăng ký
    public function index() {
        $this->style_scripts();
        $this->data['contents'] = 'register_view';
        $this->smarty->layouts($this->data);
    }
    // 2. Xử lý khi khách hàng Submit Form
    public function submit() {
        $data = [
            'email'           => $this->input->post('email'),
            'fullname'        => $this->input->post('fullname'),
            'gender'          => $this->input->post('gender'),
            'birthday'        => $this->input->post('birthday'),
            'occupation'      => $this->input->post('occupation'),
            'address'         => $this->input->post('address'),
            'lat'             => $this->input->post('lat'),
            'lng'             => $this->input->post('lng'),
            'activation_code' => md5(uniqid(rand(), true)),
            'is_verified'     => 0,
            'is_email_opened' => 0,
            'is_downloaded'   => 0,
            'created_at'      => date('Y-m-d H:i:s')
        ];

        // 2. Lưu thông tin vào Database
        if ($this->mongo_db->insert('customers', $data)) {
            
            // --- BẮT ĐẦU DÙNG BEANSTALKD ---
            try {
                // Load thư viện beanstalk đã tạo ở bước trước                
                // Đẩy dữ liệu email vào ống (tube) tên là 'registration_emails'
                // Chúng ta truyền $data để Worker biết gửi cho ai và dùng mã xác minh nào
                $this->beanstalk->push('registration_emails', $data);
                
                echo "Đăng ký thành công! Hệ thống đang gửi email xác minh cho bạn.";
            } catch (Exception $e) {
                // Nếu Beanstalkd lỗi, có thể chọn gửi trực tiếp hoặc báo lỗi
                log_message('error', 'Beanstalkd Error: ' . $e->getMessage());
                $this->send_verification_email($data); 
                echo "Đăng ký thành công! (Email được gửi trực tiếp)";
            }
            // --- KẾT THÚC DÙNG BEANSTALKD ---

        } else {
            echo "Lỗi: Không thể lưu thông tin vào hệ thống.";
        }
    }
    public function verify($code) {
        $results = $this->mongo_db->get_Where('customers', ['activation_code' => $code]);
        $user = !empty($results) ? $results[0] : null;
        
        if ($user) {
            $update_data = [
                'is_verified'     => 1,
                'opened_at'       => date('Y-m-d H:i:s')
            ];
            $this->mongo_db->where(['_id' => $this->mongo_db->create_document_id($user->_id)])
                           ->set($update_data)->update('customers');

            // Đẩy job vào Queue để Worker xử lý (giúp người dùng không phải đợi lâu)
            $this->beanstalk->push('registration_emails', [
                'task'     => 'send_download_link',
                'id'       => $user->_id,
                'email'    => $user->email,
                'fullname' => $user->fullname
            ]);

            echo "Xác minh thành công! Tài liệu đang được gửi vào: " . $user->email;
        } else {
            echo "Mã xác minh không hợp lệ.";
        }
    }

    public function resend_handler($type, $id) {
        // 1. Lấy thông tin user
        $results = $this->mongo_db->get_Where('customers', ['_id' => $this->mongo_db->create_document_id($id)]);
        $user = !empty($results) ? $results[0] : null;
        if (!$user) {
            echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy người dùng']);
            return;
        }
        // 2. Thay vì gửi mail trực tiếp (chậm), ta đẩy vào Queue (nhanh)
        $pheanstalk = $this->beanstalk->get_instance();
        $job_data = [
            'id'       => $user->_id,
            'email'    => $user->email,
            'fullname' => $user->fullname
        ];

        if ($type === 'activation') {
            // Cập nhật mã mới
            $new_code = md5(uniqid(rand(), true));
            $this->mongo_db->where(['_id' => $this->mongo_db->create_document_id($id)])
                           ->set(['activation_code' => $new_code])->update('customers');
            
            $job_data['task'] = 'send_verification';
            $job_data['activation_code'] = $new_code;
        } elseif ($type === 'download') {
            $job_data['task'] = 'send_download_link';
        }

        // Đẩy vào ống để Worker xử lý ngầm
        $pheanstalk->useTube('registration_emails')->put(json_encode($job_data));
        // Trả về kết quả ngay lập tức cho Giao diện
        echo json_encode([
            'status' => 'success', 
            'message' => 'Yêu cầu đã được tiếp nhận. '
        ]);
    }
}