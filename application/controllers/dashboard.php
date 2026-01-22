<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends WFF_Controller {

    private function style_scripts() {
        
        enqueue_styles(base_url("public/vendors/css/charts/apexcharts.css"));
        
        enqueue_scripts_footer(array(
            base_url("public/vendors/js/charts/apexcharts.min.js"),
            base_url("public/vendors/js/charts/chart.min.js"),
            base_url("public/js/pbx/sse.js")
        ));
    }

    public function index() {
        $this->style_scripts();
        $this->data['contents'] = "dashboard";
        $this->smarty->layouts($this->data);
    }

    private function echoEvent($type, $response = "") {
        echo "event: $type\ndata: {$response}\n\n";
    }
    
   

    public function sse() {
        if ($this->input->server('REQUEST_METHOD') === "GET") {
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');

            $time = time();

            echo "id: {$time}\nretry: 3000\n";
            // Event every second
            $this->echoEvent("ping", json_encode(["time" => $time]));
            
            ob_flush();
            flush();
        }
    }

}
