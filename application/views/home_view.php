<div class="app-content content">
    <div class="content-overlay"></div>
    <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
    <style>
        .hero-card {
            background: white;
            padding: 50px 40px;
            border-radius: 20px;
            box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
            text-align: center;
            max-width: 550px;
            margin: 0 auto;
        }

        h1 {
            color: #7367f0;
            margin-bottom: 20px;
            font-size: 2.2rem;
            font-weight: 700;
            letter-spacing: 1px;
        }

        p {
            color: #636e72;
            margin-bottom: 35px;
            line-height: 1.8;
            font-size: 1rem;
            text-align: justify;
        }

        .btn-group {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .btn {
            padding: 14px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            display: block;
        }

        .btn-register {
            background-color: #7367f0;
            color: white;
            border: 1px solid #7367f0;
            box-shadow: 0 4px 10px rgba(115, 103, 240, 0.3);
        }

        .btn-register:hover {
            background-color: #5e50ee;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(115, 103, 240, 0.4);
        }

        .btn-login {
            background-color: transparent;
            color: #636e72;
            border: 1px solid #dfe6e9;
        }

        .btn-login:hover {
            background-color: #f8f9fa;
            color: #2d3436;
            border-color: #b2bec3;
        }

        /* Responsive: Màn hình lớn hơn 480px thì dàn hàng ngang */
        @media (min-width: 480px) {
            .btn-group {
                flex-direction: row;
                justify-content: center;
            }
            .btn {
                flex: 1;
            }
        }
    </style>

    <section class="hero-card">
        <h1>ALPHA CENTER</h1>
        <p>
            Nền công nghiệp 4.0 và ứng dụng trí tuệ nhân tạo <strong>AI (Artificial Intelligence)</strong> là những cụm từ được nhắc đến thường xuyên trong thời gian gần đây. Cụ thể hơn đó là <strong>Machine Learning</strong> như một chìa khóa cho cuộc cách mạng công nghiệp 4.0. 
            <br><br>
            Tài liệu này là nguồn nội dung có liên quan cho các chuyên gia khoa học dữ liệu và kỹ sư máy học, những người muốn đi sâu vào các thuật toán phức tạp và cải thiện dự đoán của mô hình.
            <br><br>
            Để nhận được tài liệu này, vui lòng click đăng ký.
        </p>
        
        <div class="btn-group">
            <a href="<?= base_url('index.php/register') ?>" class="btn btn-register">ĐĂNG KÝ</a>
            <!-- <a href="<?= base_url('index.php/admin') ?>" class="btn btn-login">XEM DANH SÁCH</a> -->
        </div>
    </section>
        </div>
    </div>
</div>