<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Smssent extends WFF_Controller {

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

    public function index() {
        $this->data['user_type'] = 'customer';
        $this->style_scripts();
        $this->data['contents'] = "smssent";
        $this->smarty->layouts($this->data);
    }

    public function readdb() {
        if ($this->input->server('REQUEST_METHOD') === 'POST') {
            header('Content-Type: application/json');
            $request = json_decode(file_get_contents('php://input'));
            
            $this->load->model('smssent_model');
            $data = $this->smssent_model->readdb($request);
            
            echo json_encode($data);
        }
    }

    function readfilter() {
        if ($this->input->server('REQUEST_METHOD') === 'POST') {
            
            header('Content-Type: application/json');
            $request = json_decode(file_get_contents('php://input'));
            $column_filter = $this->input->get('details');
            
            $this->load->model('smssent_model');
            $data = $this->smssent_model->readfilter($request,$column_filter);
            echo json_encode($data);
            
        }
    }

}
