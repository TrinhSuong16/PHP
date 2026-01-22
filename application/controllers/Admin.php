<?php
class Admin extends WFF_Controller {
    
    public function __construct() {
        parent::__construct();
    }

    public function index(){
        // Lấy toàn bộ danh sách khách hàng
        // Thử bỏ order_by nếu bạn không chắc chắn bảng có cột created_at
        $query = $this->db->get('customers');
        
        if (!$query) {
            // Nếu query lỗi, in ra lỗi database
            show_error($this->db->error()['message']);
        }

        $this->data['customers'] = $query->result();
        
        // Debug: Bỏ comment dòng dưới để xem dữ liệu có lấy được không rồi die luôn
        // die(print_r($this->data['customers'], true));

        $this->data['contents'] = 'admin_view';
        $this->smarty->layouts($this->data);
    }
}
