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
        $this->data['contents'] = 'admin_view';
        $this->smarty->layouts($this->data);
    }

    public function api_get_data() {
        if ($this->input->server('REQUEST_METHOD') === 'POST') {
            header('Content-Type: application/json');
            $request = json_decode(file_get_contents('php://input'));

            $skip = isset($request->skip) ? (int)$request->skip : 0;
            $take = isset($request->take) ? (int)$request->take : 15;

            // 1. Xử lý Filtering (Nếu có)
            if (isset($request->filter) && !empty($request->filter->filters)) {
                foreach ($request->filter->filters as $f) {
                    // Map tên field từ Grid sang DB nếu cần
                    $field_map = [
                        'StatusVerified'  => 'is_verified',
                        'StatusRead'      => 'is_email_opened',
                        'StatusDownloaded' => 'is_downloaded'
                    ];
                    $db_field = isset($field_map[$f->field]) ? $field_map[$f->field] : $f->field;
                    
                    // Xử lý logic lọc cho các trạng thái (vì Grid gửi text tiếng Việt)
                    if (in_array($f->value, ['Đã xác minh', 'Đã đọc', 'Đã tải'])) {
                        $this->mongo_db->where([$db_field => 1]);
                    } elseif (in_array($f->value, ['Chưa xác minh', 'Chưa đọc', 'Chưa tải'])) {
                        $this->mongo_db->where([$db_field => 0]);
                    } else {
                        $this->mongo_db->where([$db_field => $f->value]);
                    }
                }
            }

            // 2. Lấy tổng số bản ghi sau khi lọc
            $total = $this->mongo_db->count('customers');

            // 3. Xử lý Sorting
            if (isset($request->sort) && !empty($request->sort)) {
                foreach ($request->sort as $s) {
                    $this->mongo_db->order_by($s->field, strtoupper($s->dir));
                }
            } else {
                $this->mongo_db->order_by('_id', 'DESC');
            }

            // 4. Lấy dữ liệu phân trang
            $customers = $this->mongo_db->limit($take, $skip)->get('customers');

            $data = [];
            foreach ($customers as $c) {
                $data[] = [
                    'ID'               => (string)$c->_id,
                    'Email'            => isset($c->email) ? $c->email : '',
                    'Fullname'         => isset($c->fullname) ? $c->fullname : '',
                    'Gender'           => isset($c->gender) ? $c->gender : '',
                    'Occupation'       => isset($c->occupation) ? $c->occupation : '',
                    'StatusVerified'   => !empty($c->is_verified) ? 'Đã xác minh' : 'Chưa xác minh',
                    'StatusRead'       => !empty($c->is_email_opened) ? 'Đã đọc' : 'Chưa đọc',
                    'StatusDownloaded' => !empty($c->is_downloaded) ? 'Đã tải' : 'Chưa tải',
                    'ReadDate'         => !empty($c->opened_at) ? date('d/m/Y H:i', strtotime($c->opened_at)) : '-',
                    'DownloadDate'     => !empty($c->downloaded_at) ? date('d/m/Y H:i', strtotime($c->downloaded_at)) : '-',
                    'CreatedDate'      => !empty($c->created_at) ? date('d/m/Y H:i', strtotime($c->created_at)) : '-',
                    'Address'          => isset($c->address) ? $c->address : '',
                    'Lat'              => isset($c->lat) ? $c->lat : '',
                    'Lng'              => isset($c->lng) ? $c->lng : ''
                ];
            }

            echo json_encode(['data' => $data, 'total' => $total]);
        }
    }
}
