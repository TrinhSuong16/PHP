    <style>
        /* CSS STYLES */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        .container {
            background: #fff;
            padding: 40px 30px;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 480px;
        }

        h2 {
            color: #2d3436;
            text-align: center;
            margin-bottom: 10px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .sub-title {
            font-size: 14px;
            color: #636e72;
            text-align: center;
            margin-bottom: 30px;
        }

        label {
            font-weight: 600;
            display: block;
            margin-bottom: 8px;
            color: #2d3436;
            font-size: 14px;
        }

        input,
        select,
        textarea {
            width: 100%;
            padding: 12px 16px;
            margin-bottom: 20px;
            border: 1px solid #dfe6e9;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
            outline: none;
            font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
            border-color: #7367f0;
            box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
        }

        .flex-row {
            display: flex;
            gap: 15px;
        }

        .flex-row > div {
            flex: 1;
        }

        textarea {
            height: 90px;
            resize: none;
        }

        button {
            background-color: #7367f0;
            color: white;
            border: none;
            padding: 16px;
            width: 100%;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        button:hover {
            background-color: #5e50ee;
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(115, 103, 240, 0.3);
        }

        .btn-back {
            display: block;
            text-decoration: none;
            text-align: center;
            color: #b2bec3;
            padding: 12px;
            margin-top: 15px;
            font-size: 14px;
            font-weight: 600;
            transition: color 0.3s;
        }

        .btn-back:hover {
            color: #7367f0;
        }

        .location-status {
            font-size: 12px;
            color: #94a3b8;
            margin-top: -15px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
    </style>

<div class="container">
    <h2>ĐĂNG KÝ NHẬN TÀI LIỆU</h2>
    <p class="sub-title">Điền thông tin bên dưới để nhận tài liệu AI miễn phí.</p>
    
    <form action="<?= base_url('index.php/register/submit'); ?>" method="post">
        <label>Email *</label>
        <input type="email" name="email" placeholder="Ví dụ: nva@gmail.com" required>

        <label>Họ và tên *</label>
        <input type="text" name="fullname" placeholder="Nhập đầy đủ họ tên" required>

        <div class="flex-row">
            <div>
                <label>Giới tính</label>
                <select name="gender">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            <div>
                <label>Ngày sinh</label>
                <input type="date" name="birthday" required>
            </div>
        </div>

        <label>Nghề nghiệp</label>
        <input type="text" name="occupation" placeholder="Ví dụ: Sinh viên, Kỹ sư...">

        <label>Địa chỉ</label>
        <textarea name="address" placeholder="Nhập địa chỉ của bạn"></textarea>

        <input type="hidden" name="lat" id="lat">
        <input type="hidden" name="lng" id="lng">
        
        <div id="status" class="location-status">
            🔍 Đang xác định vị trí...
        </div>

        <button type="submit">ĐĂNG KÝ NGAY</button>
        
        <a href="<?= base_url(); ?>" class="btn-back">QUAY LẠI TRANG CHỦ</a>
    </form>
</div>

<script>
    // XỬ LÝ ĐỊNH VỊ (GEOLOCATION)
    window.onload = function() {
        const statusDisplay = document.getElementById("status");
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    document.getElementById("lat").value = lat;
                    document.getElementById("lng").value = lng;
                    
                    statusDisplay.innerHTML = "✅ Đã lấy được vị trí của bạn.";
                    statusDisplay.style.color = "#28c76f";
                }, 
                function(error) {
                    let msg = "";
                    switch(error.code) {
                        case error.PERMISSION_DENIED: 
                            msg = "❌ Vị trí bị từ chối."; break;
                        case error.POSITION_UNAVAILABLE: 
                            msg = "❌ Không tìm thấy vị trí."; break;
                        case error.TIMEOUT: 
                            msg = "❌ Hết thời gian lấy vị trí."; break;
                        default: 
                            msg = "❌ Lỗi định vị."; break;
                    }
                    statusDisplay.innerHTML = msg;
                    statusDisplay.style.color = "#ea5455";
                }
            );
        } else {
            statusDisplay.innerHTML = "❌ Trình duyệt không hỗ trợ định vị.";
        }
    };
</script>