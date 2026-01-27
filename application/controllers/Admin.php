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
            $take = isset($request->take) ? (int)$request->take : 1;

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

            // Hàm cục bộ để áp dụng filter trực tiếp vào đối tượng mongo_db
            // Điều này giúp tránh lỗi khi truyền mảng lồng nhau vào hàm where()
            $apply_filters = function() use ($request, $field_map) {
                if (!isset($request->filter) || empty($request->filter->filters)) return;

                foreach ($request->filter->filters as $f) {
                    if (isset($f->filters) && !empty($f->filters)) {
                        $sub_values = [];
                        $target_field = '';
                        foreach ($f->filters as $sub) {
                            $target_field = isset($field_map[$sub->field]) ? $field_map[$sub->field] : strtolower($sub->field);
                            $val = $sub->value;

                            if (in_array($target_field, ['is_verified', 'is_email_opened', 'is_downloaded'])) {
                                if (in_array($val, ['Đã xác minh', 'Đã đọc', 'Đã tải'])) {
                                    $sub_values = array_merge($sub_values, [1, true]);
                                    continue;
                                }
                                elseif (in_array($val, ['Chưa xác minh', 'Chưa đọc', 'Chưa tải'])) {
                                    $sub_values = array_merge($sub_values, [0, false, null, "0"]);
                                    continue;
                                }
                            }
                            $sub_values[] = $val;
                        }
                        if ($target_field && !empty($sub_values)) {
                            $this->mongo_db->where_in($target_field, array_unique($sub_values, SORT_REGULAR));
                        }
                    } else {
                        $target_field = isset($field_map[$f->field]) ? $field_map[$f->field] : strtolower($f->field);
                        $val = $f->value;
                        $operator = isset($f->operator) ? $f->operator : 'eq';

                        if (in_array($target_field, ['is_verified', 'is_email_opened', 'is_downloaded'])) {
                            if (in_array($val, ['Đã xác minh', 'Đã đọc', 'Đã tải'])) {
                                $this->mongo_db->where_in($target_field, [1, true]);
                                continue;
                            }
                            elseif (in_array($val, ['Chưa xác minh', 'Chưa đọc', 'Chưa tải'])) {
                                // Xử lý trường hợp lọc đơn cho trạng thái "Chưa"
                                $this->mongo_db->where_in($target_field, [0, false, null, "0"]);
                                continue;
                            }
                        }
                        
                        if ($operator === 'contains') {
                            // Một số thư viện dùng like(), một số dùng where_like()
                            // Sử dụng Regex trực tiếp là cách an toàn nhất cho MongoDB
                            $this->mongo_db->where($target_field, new MongoDB\BSON\Regex($val, 'i'));
                        } else {
                            $this->mongo_db->where($target_field, $val);
                        }
                    }
                }
            };

            // BƯỚC 1: Tính tổng số bản ghi (Total)
            $this->mongo_db->reset_query(); // Đảm bảo sạch query trước khi bắt đầu
            $apply_filters();
            $count_res = $this->mongo_db->count('customers');
            
            // Đảm bảo total luôn là số nguyên, kể cả khi count trả về null hoặc object
            $total = 0;
            if (is_numeric($count_res)) $total = (int)$count_res;
            elseif (is_object($count_res) && isset($count_res->n)) $total = (int)$count_res->n;

            // BƯỚC 2: Lấy dữ liệu phân trang
            // Quan trọng: Phải gọi lại apply_filters vì hàm count() đã reset query bên trong thư viện
            $apply_filters();

            if (isset($request->sort) && !empty($request->sort)) {
                foreach ($request->sort as $s) {
                    $sort_field = isset($field_map[$s->field]) ? $field_map[$s->field] : strtolower($s->field);
                    $this->mongo_db->order_by($sort_field, strtoupper($s->dir));
                }
            } else {
                $this->mongo_db->order_by('created_at', 'DESC');
            }

            // Thực hiện skip và take
            $customers = $this->mongo_db->limit($take)->offset($skip)->get('customers');

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
