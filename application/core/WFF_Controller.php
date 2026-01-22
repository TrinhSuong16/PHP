<?php

(defined('BASEPATH')) OR exit('No direct script access allowed');

/**
 * @property CI_DB_active_record $db              This is the platform-independent base Active Record implementation class.
 * @property CI_DB_forge $dbforge                 Database Utility Class
 * @property CI_Benchmark $benchmark              This class enables you to mark points and calculate the time difference between them.<br />  Memory consumption can also be displayed.
 * @property CI_Calendar $calendar                This class enables the creation of calendars
 * @property CI_Cart $cart                        Shopping Cart Class
 * @property CI_Config $config                    This class contains functions that enable config files to be managed
 * @property CI_Controller $controller            This class object is the super class that every library in.<br />CodeIgniter will be assigned to.
 * @property CI_Email $email                      Permits email to be sent using Mail, Sendmail, or SMTP.
 * @property CI_Encrypt $encrypt                  Provides two-way keyed encoding using XOR Hashing and Mcrypt
 * @property CI_Exceptions $exceptions            Exceptions Class
 * @property CI_Form_validation $form_validation  Form Validation Class
 * @property CI_Ftp $ftp                          FTP Class
 * @property CI_Hooks $hooks                      Provides a mechanism to extend the base system without hacking.
 * @property CI_Image_lib $image_lib              Image Manipulation class
 * @property CI_Input $input                      Pre-processes global input data for security
 * @property CI_Lang $lang                        Language Class
 * @property CI_Loader $load                      Loads views and files
 * @property CI_Log $log                          Logging Class
 * @property CI_Model $model                      CodeIgniter Model Class
 * @property CI_Output $output                    Responsible for sending final output to browser
 * @property CI_Pagination $pagination            Pagination Class
 * @property CI_Parser $parser                    Parses pseudo-variables contained in the specified template view,<br />replacing them with the data in the second param
 * @property CI_Profiler $profiler                This class enables you to display benchmark, query, and other data<br />in order to help with debugging and optimization.
 * @property CI_Router $router                    Parses URIs and determines routing
 * @property CI_Session $session                  Session Class
 * @property CI_Sha1 $sha1                        Provides 160 bit hashing using The Secure Hash Algorithm
 * @property CI_Table $table                      HTML table generation<br />Lets you create tables manually or from database result objects, or arrays.
 * @property CI_Trackback $trackback              Trackback Sending/Receiving Class
 * @property CI_Typography $typography            Typography Class
 * @property CI_Unit_test $unit_test              Simple testing class
 * @property CI_Upload $upload                    File Uploading Class
 * @property CI_URI $uri                          Parses URIs and determines routing
 * @property CI_User_agent $user_agent            Identifies the platform, browser, robot, or mobile devise of the browsing agent
 * @property CI_Validation $validation            //dead
 * @property CI_Xmlrpc $xmlrpc                    XML-RPC request handler class
 * @property CI_Xmlrpcs $xmlrpcs                  XML-RPC server class
 * @property CI_Zip $zip                          Zip Compression Class
 * @property CI_Javascript $javascript            Javascript Class
 * @property CI_Jquery $jquery                    Jquery Class
 * @property CI_Utf8 $utf8                        Provides support for UTF-8 environments
 * @property CI_Security $security                Security Class, xss, csrf, etc...
 * @property AAA $aaa                             AAA  object
 * @property Mongo_db $mongo_db                   Mongo_db  object
 * @property MongoDataSourceResult $mongodatasourceresult  MongoDataSourceResult object
 * @property IMAP $imap                           IMAP library object 
 * @property KendoUI $kendoui                           KendoUI library object 
 */
class WFF_Controller extends MX_Controller {

    public $data = array();

    function __construct() {

        parent::__construct();
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        $modules = $this->uri->segment(1);
        $controller = $this->router->fetch_class();
        
        $this->data['userdata'] = [];
        $version = $this->config->item("current_version");

        $data_lang = array();
        $lang = "vietnamese";
        $class = strtolower(str_replace("Controller", "", get_called_class()));

        
        if (file_exists(APPPATH . 'language/' . $lang . '/' . $class . '_lang.php')) {
            $data_lang = $this->lang->load($class, $lang, TRUE);
        } elseif (file_exists(APPPATH . 'modules/' . $modules . '/language/' . $lang . '/' . $class . '_lang.php')) {
            $data_lang = $this->lang->load($modules . '/' . $class, $lang, TRUE);
        }
        else{
            $data_lang = $this->lang->load('index', $lang, TRUE,FALSE);
        }
        
        $this->data = array_merge($this->data, $data_lang);
        
        $this->data['base_url'] = base_url();
        $this->data['title'] = TITLE_PAGE;
        $this->data['lang_code'] = ($lang === "vietnamese") ? "vi-VN" : "en-US";
        $this->data['token_name'] = $this->security->get_csrf_token_name();
        $this->data['token_value'] = $this->security->get_csrf_hash();
        $this->data['modules'] = $modules;
        $this->data['controller'] = str_replace("Controller", "", $controller);
        
        $this->data['fullname'] = "Full name";
        $this->data['company_name'] = "Company Name";
        $this->data['userdata']['sipcloud'] = "Company Code";
        $this->data['user_type']='customer';
    }

}

class Admin_Controller extends WFF_Controller {

    function __construct() {
        parent::__construct();

        /**
         * Enter your codde here
         */
    }

}

class Tenant_Controller extends WFF_Controller {

    function __construct() {
        parent::__construct();
        /**
         * Enter your codde here
         */
    }

}
