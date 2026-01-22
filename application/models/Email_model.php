<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Email_model extends WFF_Model {

    public function __construct() {
        parent::__construct();
        $this->load->library('phpmailer_lib');
    }

    /**
     * Cấu hình SMTP dùng chung
     */
    private function _init_smtp() {
        $mail = $this->phpmailer_lib->load();
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'suong0344887316@gmail.com'; 
        $mail->Password   = 'pwpe nhdy mfsn jlfr'; 
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom('suong0344887316@gmail.com', 'Trung tâm ALPHA');
        $mail->isHTML(true);
        return $mail;
    }

    /**
     * 1. Gửi mail XÁC MINH (Dùng chung)
     */
    public function send_verification_email($user_data) {
        $user = (array) $user_data;
        $mail = $this->_init_smtp();
        try {
            $mail->addAddress($user['email']);
            $mail->Subject = 'Xác nhận đăng ký nhận tài liệu AI';
            
            $link = base_url("index.php/register/verify/" . $user['activation_code']);
            $mail->Body = "Chào <b>" . $user['fullname'] . "</b>,<br><br>" .
                          "Cảm ơn bạn đã quan tâm đến tài liệu AI của Alpha Center.<br>" .
                          "Vui lòng nhấn vào link bên dưới để xác minh email:<br><br>" .
                          "<a href='$link' style='color: #1900ff; font-weight: bold;'>$link</a><br><br>" . 
                          "Trân trọng,<br>Đội ngũ Alpha Center.";

            return $mail->send();
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * 2. Gửi mail TẢI TÀI LIỆU (Dùng chung)
     */
    public function send_download_email($user_data) {
        $user = (array) $user_data;
        $mail = $this->_init_smtp();
        try {
            $mail->addAddress($user['email']);
            $mail->Subject = 'Tài liệu AI của bạn đã sẵn sàng!';

            $id_user = isset($user['id']) ? $user['id'] : 0;
            $download_link = base_url("index.php/track/download/" . $id_user);
            $tracking_pixel = base_url("index.php/track/open_mail/" . $id_user);

            $mail->Body = "Chào <b>" . $user['fullname'] . "</b>,<br><br>" .
                          "Xác minh thành công! Đây là tài liệu bạn đã đăng ký: <br><br>" .
                          "<a href='$download_link' style='font-size: 18px; color: #1900ff; font-weight: bold;'>NHẤN VÀO ĐÂY ĐỂ TẢI TÀI LIỆU (PDF)</a><br><br>" .
                          "Trân trọng,<br>Đội ngũ Alpha Center." .
                          "<img src='$tracking_pixel' width='1' height='1' style='display:none;'>";

            return $mail->send();
        } catch (Exception $e) {
            return false;
        }
    }
}