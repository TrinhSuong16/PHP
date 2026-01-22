<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

// application/core/WFF_Exceptions.php
class WFF_Exceptions extends CI_Exceptions 
{
    public function __construct()
    {
        parent::__construct();
    }

    public function show_404($page = '', $log_error = TRUE)
    {
        $CI =& get_instance();
        $lang = ($CI->session->userdata("lang")) ? $CI->session->userdata("lang") : 'vietnamese';
        $CI->lang->load("index", $lang,true,false);
        $data = array(
            'title' => '404', 
            'base_url' => base_url(),
            'e404' => $CI->lang->line('e404'),
            'c404' => $CI->lang->line('c404'),
            'back' => $CI->lang->line('back')
        );
        $CI->smarty->error($data);
        echo $CI->output->get_output();
        exit(4); // EXIT_UNKNOWN_FILE
    }
}