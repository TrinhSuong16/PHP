<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends WFF_Controller {
    public function __construct() {
        parent::__construct();
    }

    public function index() {
        $this->data['contents'] = 'home_view';
        $this->smarty->layouts($this->data);
    }
}