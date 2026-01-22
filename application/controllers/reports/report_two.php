<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Report_two extends WFF_Controller {

    private function style_scripts() {

    }

    public function index() {
        $this->style_scripts();
        $this->data['contents'] = "report_two";
        $this->smarty->layouts($this->data);
    }

}
