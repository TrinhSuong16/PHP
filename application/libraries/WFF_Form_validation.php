<?php
class WFF_Form_validation extends CI_Form_validation 
{
    public function __construct($rules = array())
    {
        // Đảm bảo CI instance và Loader đã sẵn sàng
        $CI =& get_instance();
        if (!isset($CI->load)) {
            $CI->load =& load_class('Loader', 'core');
            $CI->load->initialize();
        }
        
        parent::__construct($rules);
    }
    
    function run($module = '', $group = '') {
        (is_object($module)) AND $this->CI = &$module;
        return parent::run($group);
    }

} 