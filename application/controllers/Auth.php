<?php
class Auth extends WFF_Controller {
    public function __construct() {
        parent::__construct();
    }

    public function login() {
        // Nếu đã đăng nhập rồi thì vào thẳng admin
        // Tạm thời comment để test giao diện login
        // if($this->session->userdata('admin_logged_in')) {
        //     redirect('admin');
        // }
        $this->load->view('login_view', $this->data);
    }

    public function process_login() {
        $user = $this->input->post('username');
        $pass = $this->input->post('password');

        // Tài khoản mặc định (Bạn có thể sửa hoặc check trong DB)
        if($user == 'admin' && $pass == '123456') {
            $this->session->set_userdata('admin_logged_in', true);
            redirect('admin');
        } else {
            $this->session->set_flashdata('error', 'Sai tài khoản hoặc mật khẩu!');
            redirect('auth/login');
        }
    }

    public function logout() {
        $this->session->unset_userdata('admin_logged_in');
        redirect('welcome');
    }
}