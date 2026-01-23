<?php
class Admin extends WFF_Controller {
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
    }

    public function index(){
        $this->style_scripts();
        // Lấy dữ liệu từ MongoDB
        $this->mongo_db->order_by('_id', 'DESC');
        $this->data['customers'] = $this->mongo_db->get('customers');
        
        // Debug: Bỏ comment dòng dưới để xem dữ liệu có lấy được không rồi die luôn
        // die(print_r($this->data['customers'], true));

        $this->data['contents'] = 'admin_view';
        $this->smarty->layouts($this->data);
    }
}
