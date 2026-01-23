<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Track extends WFF_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->library('mongo_db');
        $this->load->helper('download'); // Nạp helper download của CodeIgniter
                date_default_timezone_set('Asia/Ho_Chi_Minh');

    }
    // Theo dõi mở email qua Tracking Pixel
    public function open_mail($id = NULL) {
        if ($id) {
            $this->mongo_db->where(['_id' => $this->mongo_db->create_document_id($id)])->set([
                'is_email_opened' => 1, 
                'opened_at' => date('Y-m-d H:i:s')
            ])->update('customers');
        }
        header('Content-Type: image/png');
        echo base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
    // Theo dõi và thực hiện tải file PDF
    public function download($id = NULL) {
        if ($id) {
            $results = $this->mongo_db->get_Where('customers', ['_id' => $this->mongo_db->create_document_id($id)]);
            $user = !empty($results) ? $results[0] : null;
            if ($user && $user->is_downloaded == 0) {
                $this->mongo_db->where(['_id' => $this->mongo_db->create_document_id($id)])->set([
                    'is_downloaded' => 1, 
                    'downloaded_at' => date('Y-m-d H:i:s')
                ])->update('customers');
            }
        }
        // ĐƯỜNG DẪN FILE PDF CỦA BẠN
        $file_path = FCPATH . 'uploads/Bai_Kiemtra_PHP_Thuviec.pdf';

        if (file_exists($file_path)) {
            // force_download sẽ tự động thiết lập header PDF cho bạn
            force_download($file_path, NULL);
        } else {
            show_error("File PDF không tồn tại tại đường dẫn: " . $file_path, 404);
        }
    }
}