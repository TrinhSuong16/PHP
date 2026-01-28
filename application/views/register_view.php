<div class="app-content content">
    <div class="content-overlay"></div>
    <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
    <style>
        :root {
            --primary: #7367f0;
            --text-main: #2d3436;
            --text-muted: #636e72;
            --border: #dfe6e9;
        }
        .register-container {
            background: #fff; padding: 40px 30px; border-radius: 16px;
            box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
            width: 100%; max-width: 480px; margin: 0 auto;
        }
        .register-container h2 {
            color: var(--text-main); text-align: center; margin-bottom: 10px;
            font-weight: 700; letter-spacing: -0.5px;
        }
        .sub-title { font-size: 14px; color: var(--text-muted); text-align: center; margin-bottom: 30px; }
        .register-container label { font-weight: 600; display: block; margin-bottom: 8px; color: var(--text-main); font-size: 14px; }
        .register-container input, .register-container select, .register-container textarea {
            width: 100%; padding: 12px 16px; margin-bottom: 20px;
            border: 1px solid var(--border); border-radius: 8px;
            font-size: 14px; transition: all 0.3s ease; outline: none; font-family: inherit;
        }
        .register-container input:focus, .register-container select:focus, .register-container textarea:focus {
            border-color: var(--primary); box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
        }
        .flex-row { display: flex; gap: 15px; }
        .flex-row > div { flex: 1; }
        textarea { height: 45px; resize: none; }
        .register-wrapper { position: relative; width: 100%; }
        .register-btn {
            width: 100%; padding: 16px; font-size: 18px; font-weight: bold;
            border: 2px solid transparent; border-radius: 8px; cursor: pointer;
            display: flex; justify-content: space-between; align-items: center;
            transition: all 0.3s ease; background-color: var(--primary); color: white;
        }
        .register-btn:hover {
            opacity: 0.9; transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(115, 103, 240, 0.3);
        }
        .register-btn .arrow { font-size: 14px; transition: transform 0.3s ease; }
        .register-wrapper:hover .arrow { transform: rotate(180deg); }
        .register-dropdown {
            position: absolute; bottom: 100%; left: 0; right: 0;
            background: #fff; border: 1px solid #ddd;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15); padding: 15px;
            z-index: 1000; margin-bottom: 10px; opacity: 0; visibility: hidden;
            transform: translateY(10px); transition: all 0.3s ease;
        }
        .register-wrapper:hover .register-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
        .btn-back {
            display: block; text-decoration: none; text-align: center; color: #b2bec3;
            padding: 12px; margin-top: 15px; font-size: 14px; font-weight: 600; transition: color 0.3s;
        }
        .btn-back:hover { color: var(--primary); }
        .location-status {
            font-size: 12px; color: #94a3b8; margin-top: -15px; margin-bottom: 20px;
            display: flex; align-items: center; gap: 5px;
        }
        .fieldlist { list-style: none; padding: 0; margin: 0; }
        .fieldlist li { margin-bottom: 10px; display: flex; align-items: center; }
        .fieldlist label { width: 100px; font-weight: 500; margin-bottom: 0; }
        .fieldlist select { flex: 1; margin-bottom: 0; }

        /* Style cho bảng theo dõi trạng thái */
        #stateWindow pre {
            margin: 0;
            padding: 15px;
            background: #1e1e1e;
            color: #d4d4d4;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.5;
            border-radius: 0 0 8px 8px;
        }
        #stateWindow span { color: #9cdcfe; }
        .k-window-titlebar { background: var(--primary); color: white; font-weight: bold; }
    </style>

<div id="stateWindow" style="display:none;">
    <pre class="prettyprint">
{
  email: "<span data-bind="text: email"></span>",
  fullname: "<span data-bind="text: fullname"></span>",
  gender: "<span data-bind="text: gender"></span>",
  birthday: "<span data-bind="text: displayBirthday"></span>",
  occupation: "<span data-bind="text: occupation"></span>",
  address: "<span data-bind="text: address"></span>",
  location: {
    lat: <span data-bind="text: lat"></span>,
    lng: <span data-bind="text: lng"></span>
  }
}
    </pre>
</div>

<div class="register-container">
    <h2>ĐĂNG KÝ NHẬN TÀI LIỆU</h2>
    <p class="sub-title">Điền thông tin bên dưới để nhận tài liệu AI miễn phí.</p>
    
    <form id="registerForm" action="<?= base_url('index.php/register/submit'); ?>" method="post">
        <label>Email *</label>
        <input type="email" name="email" placeholder="Ví dụ: nva@gmail.com" required 
               data-bind="value: email" style="width: 100%">

        <label>Họ và tên *</label>
        <input type="text" name="fullname" placeholder="Nhập đầy đủ họ tên" required 
               data-bind="value: fullname" style="width: 100%">

        <div class="flex-row">
            <div>
                <label>Giới tính</label>
                <select name="gender" data-role="dropdownlist" 
                        data-bind="source: genders, value: gender" style="width: 100%"></select>
            </div>
            <div>
                <label>Ngày sinh</label>
                <input name="birthday" data-role="datepicker" required 
                       data-bind="value: birthday" style="width: 100%">
            </div>
        </div>

        <label>Nghề nghiệp</label>
        <input type="text" name="occupation" data-role="autocomplete" 
               data-bind="source: occupations, value: occupation" 
               placeholder="Ví dụ: Sinh viên, Kỹ sư..." style="width: 100%">

        <label>Địa chỉ</label>
        <textarea name="address" placeholder="Nhập địa chỉ của bạn"
                  data-bind="value: address"></textarea>

        <input type="hidden" name="lat" id="lat">
        <input type="hidden" name="lng" id="lng">
        
        <div id="status" class="location-status">
            <span data-bind="text: locationStatus, style: { color: statusColor }">🔍 Đang xác định vị trí...</span>
        </div>

       <div id="example">
            <div class="demo-section">

                <div class="register-wrapper position-top">

                    <button type="submit"
                        id="btnRegister"
                        class="register-btn"
                        data-bind="style: {
                            backgroundColor: btnBackground,
                            color: btnColor,
                            borderStyle: btnBorderStyle,
                            borderColor: btnBorderColor,
                            borderRadius: btnBorderRadius
                        }">

                        Đăng ký ngay
                        <span class="arrow">▼</span>
                    </button>

                    <!-- DROPDOWN FORM -->
                    <div class="register-dropdown">
                        <ul class="fieldlist">
                            <li>
                                <label>Màu chữ:</label>
                                <select data-text-field="name"
                                        data-value-field="hex"
                                        data-bind="source: colors, value: btnColor"></select>
                            </li>

                            <li>
                                <label>Màu nền:</label>
                                <select data-text-field="name"
                                        data-value-field="hex"
                                        data-bind="source: colors, value: btnBackground"></select>
                            </li>

                            <li>
                                <label>Màu viền:</label>
                                <select data-text-field="name"
                                        data-value-field="hex"
                                        data-bind="source: colors, value: btnBorderColor"></select>
                            </li>

                            <li>
                                <label>Kiểu viền:</label>
                                <select data-text-field="name"
                                        data-value-field="value"
                                        data-bind="source: borders, value: btnBorderStyle"></select>
                            </li>

                            <li>
                                <label>Bo góc:</label>
                                <select data-bind="source: radii, value: btnBorderRadius"></select>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    </form>
</div>

<script>
    $(document).ready(function () {
        
        var viewModel = kendo.observable({
            // DỮ LIỆU FORM
            email: "",
            fullname: "",
            gender: "Nam",
            birthday: new Date(),
            occupation: "",
            address: "",
            lat: "",
            lng: "",
            locationStatus: "🔍 Đang xác định vị trí...",
            statusColor: "#94a3b8",

            // STYLE NÚT
            btnColor: "#ffffff",
            btnBackground: "#7367f0",
            btnBorderColor: "#ff8c00",
            btnBorderStyle: "solid",
            btnBorderRadius: "8px",

            // DATA SOURCE
            radii: [
                "0px",
                "6px",
                "10px",
                "20px",
                "30px"
            ],

            colors: [
                { name: "Trắng", hex: "#ffffff" },
                { name: "Đỏ cam", hex: "#ff4500" },
                { name: "Cam đậm", hex: "#ff8c00" },
                { name: "Vàng", hex: "#ffd700" },
                { name: "Xanh lá", hex: "#28a745" }
            ],

            borders: [
                { name: "Solid", value: "solid" },
                { name: "Dashed", value: "dashed" },
                { name: "Dotted", value: "dotted" },
                { name: "Double", value: "double" },
                { name: "None", value: "none" }
            ],

            genders: ["Nam", "Nữ", "Khác"],
            
            occupations: [
                "Sinh viên", 
                "Kỹ sư phần mềm", 
                "Chuyên gia AI", 
                "Giảng viên", 
                "Kinh doanh", 
                "Khác"
            ],

            displayBirthday: function() {
                return kendo.toString(this.get("birthday"), "dd/MM/yyyy");
            }
        });

        // Bind toàn bộ body để bao gồm cả Window và Form
        kendo.bind($(".content-body"), viewModel);

        // Khởi tạo Kendo Window để có thể di chuyển (Draggable)
        $("#stateWindow").kendoWindow({
            width: "350px",
            title: "Current View Model State",
            visible: true,
            actions: ["Minimize", "Maximize"],
            position: { top: 20, left: 20 }
        }).data("kendoWindow").wrapper.css({ position: "fixed" });

        // XỬ LÝ ĐỊNH VỊ (GEOLOCATION) TÍCH HỢP VÀO VIEWMODEL
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    viewModel.set("lat", position.coords.latitude);
                    viewModel.set("lng", position.coords.longitude);
                    viewModel.set("locationStatus", "✅ Đã lấy được vị trí của bạn.");
                    viewModel.set("statusColor", "#28c76f");
                    // Cập nhật input hidden cho form submit truyền thống
                    $("#lat").val(position.coords.latitude);
                    $("#lng").val(position.coords.longitude);
                }, 
                function(error) {
                    viewModel.set("locationStatus", "❌ Không thể xác định vị trí.");
                    viewModel.set("statusColor", "#ea5455");
                }
            );
        } else {
            viewModel.set("locationStatus", "❌ Trình duyệt không hỗ trợ định vị.");
            viewModel.set("statusColor", "#ea5455");
        }
    });
</script>
        </div>
    </div>
</div>