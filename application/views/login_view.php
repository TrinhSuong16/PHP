<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập Admin - ALPHA</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        /* Toàn bộ mã CSS được đặt ở đây */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            margin: 0;
        }

        .login-box {
            background: white;
            padding: 40px 30px;
            border-radius: 15px;
            width: 100%;
            max-width: 380px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h3 {
            color: #2d3436;
            margin-bottom: 25px;
            padding-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-size: 1.5rem;
            position: relative;
        }

        /* Tạo gạch chân trang trí dưới tiêu đề */
        h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 3px;
            background: #7367f0;
            border-radius: 2px;
        }

        /* Thông báo lỗi */
        .error-msg {
            color: #dc3545;
            background: #fff5f5;
            border: 1px solid #feb2b2;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 20px;
            text-align: left;
        }

        /* Form styling */
        form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        input {
            width: 100%;
            padding: 14px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
            outline: none;
        }

        input:focus {
            border-color: #7367f0;
            box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.15);
        }

        button {
            width: 100%;
            padding: 14px;
            background: #7367f0;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        button:hover {
            background: #5e50ee;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(115, 103, 240, 0.3);
        }

        button:active {
            transform: translateY(0);
        }

        .btn-back {
            display: inline-block;
            margin-top: 25px;
            text-decoration: none;
            color: #94a3b8;
            font-size: 14px;
            transition: color 0.3s;
        }

        .btn-back:hover {
            color: #7367f0;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h3>ĐĂNG NHẬP</h3>
        
        <?php if($this->session->flashdata('error')): ?>
            <div class="error-msg">
                ⚠️ <?= $this->session->flashdata('error') ?>
            </div>
        <?php endif; ?>

        <form action="<?= base_url('index.php/auth/process_login') ?>" method="post">
            <input type="text" name="username" placeholder="Tên đăng nhập" required autocomplete="username">
            <input type="password" name="password" placeholder="Mật khẩu" required autocomplete="current-password">
            <button type="submit">ĐĂNG NHẬP HỆ THỐNG</button>
        </form>

        <a href="<?= base_url() ?>" class="btn-back">← Quay lại trang chủ</a>
    </div>
</body>
</html>