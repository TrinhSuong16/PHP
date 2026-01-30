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
        .register-wrapper.active .arrow { transform: rotate(90deg); }
        .register-dropdown {
            position: absolute; bottom: 100%; left: 0; right: 0;
            background: #fff; border: 1px solid #ddd;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15); padding: 15px;
            z-index: 1000; margin-bottom: 10px; opacity: 0; visibility: hidden;
            transform: translateY(10px); transition: all 0.3s ease;
        }
        .register-wrapper.active .register-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
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
        - email: "<span data-bind="text: email"></span>"
        - fullname: "<span data-bind="text: fullname"></span>"
        - gender: "<span data-bind="text: gender"></span>"
        - birthday: "<span data-bind="text: displayBirthday"></span>"
        - occupation: "<span data-bind="text: occupation"></span>"
        - address: "<span data-bind="text: address"></span>"
        - location: 
            + lat: <span data-bind="text: lat"></span>
            + lng: <span data-bind="text: lng"></span>
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
               data-min-length="0"
               data-bind="source: occupations, value: occupation" 
               placeholder="Ví dụ: Sinh viên, Kỹ sư..." style="width: 100%">

        <label>Địa chỉ</label>
        <input type="text" id="addressAutocomplete" name="address" required
               placeholder="171 Nguyễn Tư gian..." 
               data-bind="value: address" style="width: 100%">

        <input type="hidden" name="lat" data-bind="value: lat">
        <input type="hidden" name="lng" data-bind="value: lng">
        
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
                        }, 
                        events: { click: listener, dblclick: listener, mouseover: listener, mouseout: listener }">
                        Đăng ký ngay
                        <span class="arrow">▼</span>
                    </button>
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
                                <select data-bind="source: radio, value: btnBorderRadius"></select>
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
            email: "",
            fullname: "",
            gender: "",
            birthday: new Date(),
            occupation: "",
            address: "",
            lat: "",
            lng: "",
            locationStatus: "🔍 Đang xác định vị trí...",
            statusColor: "#94a3b8",

            btnColor: "#ffffff",
            btnBackground: "#7367f0",
            btnBorderColor: "#ff8c00",
            btnBorderStyle: "solid",
            btnBorderRadius: "8px",

            radio: [
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

            genders: ["Nam", "Nữ"],
            
            occupations: [
                "Sinh viên",
                "Lập trình viên (Frontend/Backend)",
                "Kỹ sư phần mềm (Software Engineer)",
                "Chuyên gia AI / Machine Learning",
                "Kỹ sư dữ liệu (Data Engineer)",
                "Chuyên gia phân tích dữ liệu (Data Analyst)",
                "Kỹ sư DevOps",
                "Kiểm thử phần mềm (Tester/QA)",
                "Quản trị hệ thống (System Admin)",
                "Chuyên gia bảo mật (Cyber Security)",
                "Quản lý dự án (Project Manager)",
                "Product Manager",
                "Thiết kế đồ họa (Graphic Designer)",
                "Thiết kế UI/UX",
                "Marketing / SEO Specialist",
                "Content Creator / Copywriter",
                "Kinh doanh / Sales",
                "Chuyên viên nhân sự (HR)",
                "Kế toán / Kiểm toán",
                "Phân tích tài chính",
                "Nhân viên ngân hàng",
                "Luật sư / Pháp chế",
                "Bác sĩ / Y tá",
                "Dược sĩ",
                "Giảng viên / Giáo viên",
                "Nghiên cứu khoa học",
                "Kiến trúc sư",
                "Kỹ sư xây dựng",
                "Kỹ sư điện / Cơ khí",
                "Biên tập viên / Nhà báo",
                "Video Editor",
                "Nhiếp ảnh gia",
                "Tiếp viên hàng không",
                "Hướng dẫn viên du lịch",
                "Đầu bếp / Bartender",
                "Freelancer",
                "Chủ doanh nghiệp",
                "Nhân viên văn phòng",
                "Khác"
            ].sort(),

            displayBirthday: function() {
                return kendo.toString(this.get("birthday"), "dd/MM/yyyy");
            },

            listener: function(e) {
                console.log("Event on Register Button: " + e.type);
            }
        });

        kendo.bind($(".content-body"), viewModel);

        // Cấu hình Autocomplete cho địa chỉ sử dụng OpenStreetMap
        $("#addressAutocomplete").kendoAutoComplete({
            dataTextField: "display_name",
            filter: "contains",
            minLength: 3,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: {
                        url: "https://nominatim.openstreetmap.org/search",
                        dataType: "json",
                        data: function() {
                            return {
                                q: $("#addressAutocomplete").val(),
                                format: "json",
                                addressdetails: 1,
                                limit: 5,
                                // countrycodes: "vn" // Chỉ tìm kiếm tại Việt Nam
                            };
                        }
                    }
                }
            },
            select: function(e) {
                var dataItem = this.dataItem(e.item.index());
                viewModel.set("lat", dataItem.lat);
                viewModel.set("lng", dataItem.lon);
                viewModel.set("locationStatus", "✅ Đã xác định vị trí từ địa chỉ chọn.");
                viewModel.set("statusColor", "#28c76f");
            }
        });

        $("#stateWindow").kendoWindow({
            width: "350px",
            title: "Thông tin đăng ký",
            visible: true,
            actions: ["Minimize"],
        }).data("kendoWindow").wrapper.css({
            position: "fixed",
            top: "50%",
            left: "20px",
            transform: "translateY(-50%)"
        });

        // XỬ LÝ ĐỊNH VỊ (GEOLOCATION) TÍCH HỢP VÀO VIEWMODEL
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    viewModel.set("lat", position.coords.latitude);
                    viewModel.set("lng", position.coords.longitude);
                    viewModel.set("locationStatus", "✅ Đã lấy được vị trí của bạn.");
                    viewModel.set("statusColor", "#28c76f");
                }, 
                function(error) {
                    var msg = "❌ Không thể xác định vị trí.";
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            msg = "❌ Bạn đã từ chối quyền truy cập vị trí.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            msg = "❌ Thông tin vị trí không khả dụng.";
                            break;
                        case error.TIMEOUT:
                            msg = "❌ Hết thời gian chờ lấy vị trí.";
                            break;
                    }
                    viewModel.set("locationStatus", msg);
                    viewModel.set("statusColor", "#ea5455");
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            viewModel.set("locationStatus", "❌ Trình duyệt không hỗ trợ định vị.");
            viewModel.set("statusColor", "#ea5455");
        }

        // Kích hoạt gợi ý ngay khi nhấn vào ô Nghề nghiệp
        $("[name='occupation']").on("focus", function() {
            $(this).data("kendoAutoComplete").search("");
        });

        // Xử lý click vào mũi tên để hiện dropdown thay vì hover
        $(".arrow").on("click", function(e) {
            e.preventDefault(); 
            e.stopPropagation(); 
            $(this).closest(".register-wrapper").toggleClass("active");
        });

        // Đóng dropdown khi click ra ngoài vùng register-wrapper
        $(document).on("click", function(e) {
            if (!$(e.target).closest(".register-wrapper").length) {
                $(".register-wrapper").removeClass("active");
            }
        });
    });
</script>
        </div>
    </div>
</div>