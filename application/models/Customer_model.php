<?php
class Customer_model extends WFF_Model {
    public function get_list() {
        // Chuyển sang MongoDB
        return $this->mongo_db->get('customers');
    }
}