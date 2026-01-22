<?php
class Customer_model extends WFF_Model {
    public function get_list() {
        // Lấy toàn bộ danh sách để ViewModel hiển thị lên Grid
        return $this->db->get('customers')->result_array();
    }
}