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

            // Hàm cục bộ để tái sử dụng logic filter vì count() sẽ reset query
            $apply_filters = function() use ($request) {
                if (isset($request->filter) && !empty($request->filter->filters)) {
                    foreach ($request->filter->filters as $f) {
                        $sub_filters = isset($f->filters) ? $f->filters : [$f];
                        $field_map = [
                            'StatusVerified'   => 'is_verified',
                            'StatusRead'       => 'is_email_opened',
                            'StatusDownloaded' => 'is_downloaded',
                            'Fullname'         => 'fullname',
                            'Email'            => 'email'
                        ];

                        $filter_values = [];
                        $db_field = '';

                        foreach ($sub_filters as $sf) {
                            $db_field = isset($field_map[$sf->field]) ? $field_map[$sf->field] : strtolower($sf->field);
                            $val = $sf->value;

                            if (in_array($val, ['Đã xác minh', 'Đã đọc', 'Đã tải'])) $val = 1;
                            elseif (in_array($val, ['Chưa xác minh', 'Chưa đọc', 'Chưa tải'])) $val = 0;
                            
                            $filter_values[] = $val;
                        }

                        if (!empty($db_field)) {
                            if (count($filter_values) > 1) {
                                $this->mongo_db->where_in($db_field, $filter_values);
                            } else {
                                $this->mongo_db->where([$db_field => $filter_values[0]]);
                            }
                        }
                    }
                }
            };

            // 1. Áp dụng filter để đếm tổng số bản ghi thỏa điều kiện
            $apply_filters();
            $total = $this->mongo_db->count('customers');

            // 2. Áp dụng lại filter để lấy dữ liệu (vì count đã clear query)
            $apply_filters();

            // 3. Xử lý Sorting (Cũng cần map field)
            if (isset($request->sort) && !empty($request->sort)) {
                $field_map = [
                    'StatusVerified'   => 'is_verified',
                    'StatusRead'       => 'is_email_opened',
                    'StatusDownloaded' => 'is_downloaded',
                    'Fullname'         => 'fullname',
                    'Email'            => 'email'
                ];
                foreach ($request->sort as $s) {
                    $sort_field = isset($field_map[$s->field]) ? $field_map[$s->field] : strtolower($s->field);
                    $this->mongo_db->order_by($sort_field, strtoupper($s->dir));
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
