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

            $field_map = [
                'StatusVerified'   => 'is_verified',
                'StatusRead'       => 'is_email_opened',
                'StatusDownloaded' => 'is_downloaded',
                'Fullname'         => 'fullname',
                'Email'            => 'email',
                'ReadDate'         => 'opened_at',
                'DownloadDate'     => 'downloaded_at',
                'CreatedDate'      => 'created_at',
                'Address'          => 'address'
            ];

            // Hàm cục bộ để tái sử dụng logic filter
            $apply_filters = function() use ($request, $field_map) {
                if (!isset($request->filter) || empty($request->filter->filters)) return;

                // Mảng chứa tất cả điều kiện where
                $all_wheres = [];

                foreach ($request->filter->filters as $f) {
                    // 1. Trường hợp lọc nhiều giá trị (Multi-check checkbox)
                    if (isset($f->filters) && !empty($f->filters)) {
                        $sub_values = [];
                        $target_field = '';
                        
                        foreach ($f->filters as $sub) {
                            $field_name = isset($sub->field) ? $sub->field : '';
                            if (!$field_name) continue;
                            
                            $target_field = isset($field_map[$field_name]) ? $field_map[$field_name] : strtolower($field_name);
                            $val = $sub->value;

                            // Chỉ chuyển đổi giá trị cho các cột trạng thái
                            if (in_array($target_field, ['is_verified', 'is_email_opened', 'is_downloaded'])) {
                                if (in_array($val, ['Đã xác minh', 'Đã đọc', 'Đã tải'])) $val = 1;
                                elseif (in_array($val, ['Chưa xác minh', 'Chưa đọc', 'Chưa tải'])) {
                                    // Lọc giá trị 0 HOẶC các bản ghi chưa có trường này (null)
                                    $sub_values[] = 0;
                                    $val = null;
                                }
                            }
                            $sub_values[] = $val;
                        }
                        if ($target_field && !empty($sub_values)) {
                            $all_wheres[$target_field] = ['$in' => array_unique($sub_values, SORT_REGULAR)];
                        }
                    } 
                    // 2. Trường hợp lọc đơn (Tìm kiếm văn bản hoặc chọn đơn)
                    else {
                        $field_name = isset($f->field) ? $f->field : '';
                        if (!$field_name) continue;

                        $target_field = isset($field_map[$field_name]) ? $field_map[$field_name] : strtolower($field_name);
                        $val = $f->value;

                        if (in_array($target_field, ['is_verified', 'is_email_opened', 'is_downloaded'])) {
                            if (in_array($val, ['Đã xác minh', 'Đã đọc', 'Đã tải'])) $val = 1;
                            elseif (in_array($val, ['Chưa xác minh', 'Chưa đọc', 'Chưa tải'])) {
                                $val = ['$in' => [0, null]];
                            }
                        }
                        
                        $operator = isset($f->operator) ? $f->operator : 'eq';
                        if ($operator === 'contains') {
                            // Tạo Regex object cho từng điều kiện contains
                            $regex = new MongoDB\BSON\Regex($val, 'i');
                            $all_wheres[$target_field] = $regex;
                        } else {
                            $all_wheres[$target_field] = $val;
                        }
                    }
                }

                if (!empty($all_wheres)) {
                    $this->mongo_db->where($all_wheres);
                }
            };


            // 1. Áp dụng filter để đếm tổng số bản ghi thỏa điều kiện
            $apply_filters();
            $total = $this->mongo_db->count('customers');

            // 2. Áp dụng lại filter để lấy dữ liệu (vì count đã clear query)
            $apply_filters();

            // 3. Xử lý Sorting (Cũng cần map field)
            if (isset($request->sort) && !empty($request->sort)) {
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
