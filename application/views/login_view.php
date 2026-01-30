<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thông tin thành viên - Alpha Center</title>
    <link href="https://kendo.cdn.telerik.com/themes/12.3.0/default/default-ocean-blue.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://kendo.cdn.telerik.com/2025.4.1321/js/kendo.all.min.js"></script>
    <style>
        :root { --primary: #7367f0; --bg: #f4f7fa; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: var(--bg); padding: 50px; }
        .container { display: flex; gap: 30px; max-width: 900px; margin: 0 auto; }
        .form-section, .preview-section { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); flex: 1; }
        h3 { color: var(--primary); margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        label { display: block; margin: 15px 0 5px; font-weight: 600; font-size: 14px; }
        input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
        
        /* Card Preview Style */
        .profile-card {
            background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);
            color: white; padding: 20px; border-radius: 12px; position: relative; overflow: hidden;
        }
        .profile-card::after {
            content: "ALPHA"; position: absolute; right: -20px; bottom: -10px;
            font-size: 80px; font-weight: 900; opacity: 0.1;
        }
        .card-name { font-size: 22px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
        .card-info { font-size: 14px; opacity: 0.9; margin-bottom: 3px; }
        .status-tag { 
            display: inline-block; background: rgba(255,255,255,0.2); 
            padding: 4px 10px; border-radius: 4px; font-size: 12px; margin-top: 15px; 
        }
        .btn-send {
            width: 100%; background: var(--primary); color: white; border: none;
            padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;
            margin-top: 20px; transition: all 0.3s;
        }
        .btn-send:disabled { background: #ccc; cursor: not-allowed; }
        .success-alert { 
            background: #d4edda; color: #155724; padding: 15px; 
            border-radius: 8px; margin-top: 20px; text-align: center;
        }
    </style>
</head>
<body>
    <div class="container" id="app">
        <!-- Cột nhập liệu -->
        <div class="form-section">
            <h3>NHẬP THÔNG TIN</h3>
            
            <label>Họ và tên:</label>
            <input type="text" data-bind="value: fullname" placeholder="VD: Nguyễn Văn A" />

            <label>Email liên hệ:</label>
            <input type="email" data-bind="value: email" placeholder="admin@alphacenter.vn" />

            <label>Chuyên môn:</label>
            <select data-bind="value: major">
                <option value="AI Engineer">AI Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Software Developer">Software Developer</option>
            </select>

            <label>
                <input type="checkbox" data-bind="checked: isConfirmed" /> Tôi xác nhận thông tin chính xác
            </label>

            <button class="btn-send" 
                    data-bind="enabled: isConfirmed, events: { click: transmitData, mouseover: onHover }">
                TRUYỀN THÔNG TIN HỆ THỐNG
            </button>

            <div class="success-alert" data-bind="visible: showSuccess">
                ✅ Thông tin đã được truyền đi thành công!
            </div>
        </div>

        <!-- Cột xem trước (Live Preview) -->
        <div class="preview-section">
            <h3>XEM TRƯỚC THẺ</h3>
            <div class="profile-card">
                <div class="card-name" data-bind="text: fullname"></div>
                <div class="card-info">📧 Email: <span data-bind="text: email"></span></div>
                <div class="card-info">🚀 Chuyên môn: <span data-bind="text: major"></span></div>
                <div class="status-tag" data-bind="text: statusLabel"></div>
            </div>

            <div style="margin-top: 20px; font-size: 13px; color: #666;">
                <p><i>* Trang này sử dụng Kendo MVVM để đồng bộ dữ liệu giữa Form và Thẻ xem trước.</i></p>
                <a href="<?= base_url() ?>" style="color: var(--primary); text-decoration: none;">← Quay lại trang chủ</a>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            var viewModel = kendo.observable({
                fullname: "CHƯA NHẬP TÊN",
                email: "chưa có email",
                major: "AI Engineer",
                isConfirmed: false,
                showSuccess: false,

                // Tính toán nhãn trạng thái dựa trên checkbox
                statusLabel: function() {
                    return this.get("isConfirmed") ? "MEMBER VERIFIED" : "PENDING CONFIRMATION";
                },

                // Hàm truyền thông tin
                transmitData: function(e) {
                    this.set("showSuccess", true);
                    console.log("Dữ liệu truyền đi:", {
                        name: this.get("fullname"),
                        email: this.get("email"),
                        major: this.get("major")
                    });
                    
                    // Tự động ẩn thông báo sau 3 giây
                    var that = this;
                    setTimeout(function() { that.set("showSuccess", false); }, 3000);
                },

                onHover: function(e) {
                    console.log("User đang cân nhắc truyền dữ liệu...");
                }
            });

            kendo.bind($("#app"), viewModel);
        });
    </script>
</body>
</html>
