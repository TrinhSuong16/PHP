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
    if ($this->input->server('REQUEST_METHOD') !== 'POST') return;

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

    /* ==============================
     * 1. BUILD FILTER (CHỈ 1 LẦN)
     * ============================== */
    $filters = [];

    if (isset($request->filter->filters)) {
        foreach ($request->filter->filters as $f) {

            // ===== GROUP FILTER =====
            if (isset($f->filters)) {
                $values = [];
                $field = '';

                foreach ($f->filters as $sub) {
                    $field = $field_map[$sub->field] ?? strtolower($sub->field);
                    $val = $sub->value;

                    if (in_array($field, ['is_verified','is_email_opened','is_downloaded'])) {
                        if (in_array($val, ['Đã xác minh','Đã đọc','Đã tải'])) {
                            $values = array_merge($values, [1, true]);
                            continue;
                        }
                        if (in_array($val, ['Chưa xác minh','Chưa đọc','Chưa tải'])) {
                            $values = array_merge($values, [0, false, null, "0"]);
                            continue;
                        }
                    }
                    $values[] = $val;
                }

                if ($field && $values) {
                    $filters[] = [
                        'type'  => 'where_in',
                        'field' => $field,
                        'value' => array_unique($values, SORT_REGULAR)
                    ];
                }
            }

            // ===== SINGLE FILTER =====
            else {
                $field = $field_map[$f->field] ?? strtolower($f->field);
                $val = $f->value;
                $operator = $f->operator ?? 'eq';

                if (in_array($field, ['is_verified','is_email_opened','is_downloaded'])) {
                    if (in_array($val, ['Đã xác minh','Đã đọc','Đã tải'])) {
                        $filters[] = ['type'=>'where_in','field'=>$field,'value'=>[1,true]];
                        continue;
                    }
                    if (in_array($val, ['Chưa xác minh','Chưa đọc','Chưa tải'])) {
                        $filters[] = ['type'=>'where_in','field'=>$field,'value'=>[0,false,null,"0"]];
                        continue;
                    }
                }

                if ($operator === 'contains') {
                    $filters[] = ['type'=>'regex','field'=>$field,'value'=>$val];
                } else {
                    $filters[] = ['type'=>'where','field'=>$field,'value'=>$val];
                }
            }
        }
    }

    /* ==============================
     * 2. COUNT
     * ============================== */
    $this->mongo_db->reset_query();
    foreach ($filters as $f) {
        if ($f['type'] === 'where') {
            $this->mongo_db->where($f['field'], $f['value']);
        }
        elseif ($f['type'] === 'where_in') {
            $this->mongo_db->where_in($f['field'], $f['value']);
        }
        elseif ($f['type'] === 'regex') {
            $this->mongo_db->where(
                $f['field'],
                new MongoDB\BSON\Regex($f['value'], 'i')
            );
        }
    }
    $total = (int)$this->mongo_db->count('customers');

    /* ==============================
     * 3. GET DATA
     * ============================== */
    $this->mongo_db->reset_query();
    foreach ($filters as $f) {
        if ($f['type'] === 'where') {
            $this->mongo_db->where($f['field'], $f['value']);
        }
        elseif ($f['type'] === 'where_in') {
            $this->mongo_db->where_in($f['field'], $f['value']);
        }
        elseif ($f['type'] === 'regex') {
            $this->mongo_db->where(
                $f['field'],
                new MongoDB\BSON\Regex($f['value'], 'i')
            );
        }
    }

    // SORT
    if (!empty($request->sort)) {
        foreach ($request->sort as $s) {
            $field = $field_map[$s->field] ?? strtolower($s->field);
            $this->mongo_db->order_by($field, strtoupper($s->dir));
        }
    } else {
        $this->mongo_db->order_by('created_at', 'DESC');
    }

    // PAGING
    $customers = $this->mongo_db
        ->limit($take)
        ->offset($skip)
        ->get('customers');

    /* ==============================
     * 4. FORMAT RESPONSE
     * ============================== */
    $data = [];
    foreach ($customers as $c) {
        $data[] = [
            'ID'               => (string)$c->_id,
            'Email'            => $c->email ?? '',
            'Fullname'         => $c->fullname ?? '',
            'Gender'           => $c->gender ?? '',
            'Occupation'       => $c->occupation ?? '',
            'StatusVerified'   => !empty($c->is_verified) ? 'Đã xác minh' : 'Chưa xác minh',
            'StatusRead'       => !empty($c->is_email_opened) ? 'Đã đọc' : 'Chưa đọc',
            'StatusDownloaded' => !empty($c->is_downloaded) ? 'Đã tải' : 'Chưa tải',
            'ReadDate'         => !empty($c->opened_at) ? date('d/m/Y H:i', strtotime($c->opened_at)) : '-',
            'DownloadDate'     => !empty($c->downloaded_at) ? date('d/m/Y H:i', strtotime($c->downloaded_at)) : '-',
            'CreatedDate'      => !empty($c->created_at) ? date('d/m/Y H:i', strtotime($c->created_at)) : '-',
            'Address'          => $c->address ?? '',
            'Lat'              => $c->lat ?? '',
            'Lng'              => $c->lng ?? ''
        ];
    }

    echo json_encode([
        'data'  => $data,
        'total' => $total
    ]);
}

}
