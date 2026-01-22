<?php

/**
 * Description of smssent_model
 * 
 * Define schema of this model
 * { 
 * from: "HELLOTWO"  -- SMS Sender  Name
 * to: "84986112xxx" -- Phone receiver.
 * text:"Ghi abc vao ngay: 4. Vui long truy cap website: dvkh.abc.com de tao ta..." -- SMS Content
 * receivedTimestamp:1454470366 -- timestamp at system received this sms
 * clientIP:"123.30.180.59" -- IP of client 
 * user:"helloworld" -- account name of client
 * processTimestamp:1454470366 -- timestamp at system process this sms
 * status:"1"  -- Status of sent proccess (1: success 0: fail)
 * sentTimestamp;1454470366 -- timestamp at system sent this sms
 * }
 * 
 * Version control, history change:
 * - yyyy/mm/dd: add processTimestamp column  [example] @by: hieu.nguyen
 * 
 * @author nguyenngocbinh
 */

class Smssent_Model extends WFF_Model {
    
    /**
     * 
     * @param type $request
     * @return type
     */
    public function readdb($request) {
       try{
            //$this->mongo_db->insert('__debugs_'.date("Ymd",time()), ['eventdate'=> date('c',time()), 'Request'=>$request, 'file'=>__FILE__]);
            
           $this->load->library('mongodatasourceresult');
            $data = $this->mongodatasourceresult->read('smssent', array('user', 'from', 'to', 'text', 'receivedTimestamp', 'sentTimestamp', 'status'), $request);
            return $data;
            
        } catch (Exception $ex) {
            $this->mongo_db->insert('__debugs_'.date("Ymd",time()), ['eventdate'=> date('c',time()), 'Exception'=>$ex, 'file'=>__FILE__]);
            return []; 
       }
    }
    
    /**
     * 
     * @param type $request
     * @param type $column_filter
     * @return type
     */
    public function readfilter($request,$column_filter){
        try {
            //$this->mongo_db->insert('__debugs_'.date("Ymd",time()), ['eventdate'=> date('c',time()), 'Request'=>$request, 'file'=>__FILE__]);

            $this->load->library('mongodatasourceresult');
            $data = $this->mongodatasourceresult->read('smssent', array('DISTINCT' => $column_filter), $request);
            return $data;
        } catch (Exception $ex) {
            $this->mongo_db->insert('__debugs_' . date("Ymd", time()), ['eventdate' => date('c', time()), 'Exception' => $ex, 'file' => __FILE__]);
            return [];
        }
    }
}
