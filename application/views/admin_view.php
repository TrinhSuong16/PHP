<div class="app-content content">
    <div class="content-overlay"></div>
    <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
    <style>
        :root {
            --primary-color: #7367f0;
            --success-color: #28c76f;
            --danger-color: #ea5455;
            --info-color: #00cfe8;
        }

        /* CSS Admin Style */
        .header-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            background: white;
            padding: 15px 25px;
            border-radius: 12px;
            box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
        }

        h2 {
            color: var(--primary-color);
            margin: 0;
            font-weight: 700;
            font-size: 1.5rem;
        }

        .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            color: white;
            display: inline-block;
            min-width: 95px;
            text-align: center;
            text-transform: uppercase;
        }

        .yes { background-color: var(--success-color) !important; }
        .no { background-color: var(--danger-color) !important; }

        /* Kendo Grid Customization */
        .k-grid {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: none;
        }

        .k-grid-header th.k-header {
            background-color: #f8f9fa !important;
            font-weight: 700 !important;
            color: #5e5873 !important;
            text-align: center !important;
            padding: 15px !important;
        }

        .k-grid td {
            text-align: center !important;
            vertical-align: middle !important;
            padding: 12px !important;
            border-bottom: 1px solid #edf2f7;
        }

        /* Đồng bộ màu nút bấm Kendo với Theme */
        .k-button-solid-primary {
            background-color: var(--primary-color) !important;
            border-color: var(--primary-color) !important;
        }
        .k-button-solid-info {
            background-color: var(--info-color) !important;
            border-color: var(--info-color) !important;
        }
        .k-button-solid-success {
            background-color: var(--success-color) !important;
            border-color: var(--success-color) !important;
        }
        .k-button-solid-warning {
            background-color: var(--danger-color) !important;
            border-color: var(--danger-color) !important;
        }

        /* Theme Switcher Styles */
        .theme-switcher {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .theme-opt {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #fff;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .theme-opt:hover { transform: scale(1.2); }
    </style>

    <div class="header-area">
        <h2>DANH SÁCH ĐĂNG KÝ NHẬN TÀI LIỆU</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
            <div class="theme-switcher">
                <span style="font-size: 12px; color: #94a3b8; font-weight: 600;"></span>
                <span class="theme-opt" style="background: #7367f0;" onclick="changeTheme('purple')" title="Tím hiện đại"></span>
                <span class="theme-opt" style="background: #2d3436;" onclick="changeTheme('dark')" title="Đen chuyên nghiệp"></span>
                <span class="theme-opt" style="background: #10ac84;" onclick="changeTheme('nature')" title="Xanh thiên nhiên"></span>
                <span class="theme-opt" style="background: #0984e3;" onclick="changeTheme('ocean')" title="Xanh đại dương"></span>
            </div>
            <span style="margin-right: 15px; font-style: italic; color: #94a3b8;">
                Giờ hệ thống: <?= date('H:i d/m/Y') ?>
            </span>
        </div>
    </div>

    <div id="grid"></div>

    <script>
        // 1. URL CONFIGURATION
        var GLOBAL_RESEND_URL = "<?= base_url('index.php/register/resend_handler/') ?>";
        var GLOBAL_API_URL = "<?= base_url('index.php/admin/api_get_data') ?>";

        // 2. THEME LOGIC
        var themes = {
            purple: { primary: '#7367f0', success: '#28c76f', danger: '#f07676', info: '#00cfe8' },
            dark:   { primary: '#2d3436', success: '#05ad51', danger: '#de4949', info: '#0984e3' },
            nature: { primary: '#10ac84', success: '#1dd1a1', danger: '#de9595', info: '#48dbfb' },
            ocean:  { primary: '#0984e3', success: '#00cec9', danger: '#fab1a0', info: '#74b9ff' }
        };

        function changeTheme(themeKey) {
            var theme = themes[themeKey] || themes.purple;
            var root = document.documentElement;
            
            root.style.setProperty('--primary-color', theme.primary);
            root.style.setProperty('--success-color', theme.success);
            root.style.setProperty('--danger-color', theme.danger);
            root.style.setProperty('--info-color', theme.info);
            
            localStorage.setItem('admin_theme_key', themeKey);
        }

        // Khôi phục theme từ localStorage khi load trang
        var savedThemeKey = localStorage.getItem('admin_theme_key');
        if (savedThemeKey) {
            changeTheme(savedThemeKey);
        }

        // 3. ACTIONS
        function resendAction(id, type) {
            var title = (type === 'activation') ? "Gửi lại mail xác minh?" : "Gửi lại link tải tài liệu?";
            if (confirm(title)) {
                kendo.ui.progress($("#grid"), true);
                $.ajax({
                    url: GLOBAL_RESEND_URL + type + "/" + id,
                    type: "GET",
                    dataType: "json",
                    success: function(res) {
                        kendo.ui.progress($("#grid"), false);
                        alert(res.status === 'success' ? "Thành công: " + res.message : "Lỗi: " + res.message);
                    },
                    error: function() {
                        kendo.ui.progress($("#grid"), false);
                        alert("Lỗi kết nối hệ thống!");
                    }
                });
            }
        }

        // 4. GRID INITIALIZATION
        $(document).ready(function () {
            $("#grid").kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: GLOBAL_API_URL,
                            type: "POST",
                            contentType: "application/json"
                        },
                        parameterMap: function(data) {
                            return kendo.stringify(data);
                        }
                    },
                    schema: {
                        data: "data",
                        total: "total"
                    },
                    pageSize: 15,
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true
                },
                height: 650,
                sortable: true,
                pageable: { refresh: true, pageSizes: [15, 30, 50], buttonCount: 5 },
                filterable: { mode: "menu" },
                columns: [
                    { field: "Fullname", title: "Họ tên", width: 160, locked: true,filterable: false },
                    { field: "Email", title: "Email", width: 200,filterable: false },
                    { 
                field: "StatusVerified", 
                title: "Xác minh", 
                width: 140,
                template: "<span class='status-badge #= StatusVerified == \"Đã xác minh\" ? \"yes\" : \"no\" #'>#= StatusVerified #</span>",
                filterable: { 
                    multi: true, 
                    dataSource: [{ StatusVerified: "Đã xác minh" }, { StatusVerified: "Chưa xác minh" }] 
                }
            },
            { 
                field: "StatusRead", 
                title: "Đọc Email", 
                width: 130,
                template: "<span class='status-badge #= StatusRead == \"Đã đọc\" ? \"yes\" : \"no\" #'>#= StatusRead #</span>",
                filterable: { 
                    multi: true, 
                    dataSource: [{ StatusRead: "Đã đọc" }, { StatusRead: "Chưa đọc" }] 
                }
            },
            { 
                field: "StatusDownloaded", 
                title: "Tải tài liệu", 
                width: 130,
                template: "<span class='status-badge #= StatusDownloaded == \"Đã tải\" ? \"yes\" : \"no\" #'>#= StatusDownloaded #</span>",
                filterable: { 
                    multi: true, 
                    dataSource: [{ StatusDownloaded: "Đã tải" }, { StatusDownloaded: "Chưa tải" }] 
                }
            },
                    {
                        title: "Thao tác", width: 180,filterable: false,
                        template: function(dataItem) {
                            if (dataItem.StatusVerified === "Chưa xác minh" || dataItem.StatusRead === "Chưa đọc") {
                                return "<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-warning' onclick='resendAction(\"" + dataItem.ID + "\", \"activation\")'>Gửi lại mail xác minh</button>";
                            } else if (dataItem.StatusVerified === "Đã xác minh" && dataItem.StatusDownloaded === "Chưa tải") {
                                return "<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-info' onclick='resendAction(\"" + dataItem.ID + "\", \"download\")'>Gửi lại mail tải</button>";
                            } else {
                                return "<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-success' disabled style='opacity: 1;'><span class='k-icon k-i-check'></span> Hoàn tất</button>";
                            }
                        }
                    },
                    { field: "ReadDate", title: "Ngày đọc", width: 140,filterable: false },
                    { field: "DownloadDate", title: "Ngày tải", width: 140,filterable: false },
                    { field: "CreatedDate", title: "Ngày ĐK", width: 140,filterable: false },
                    { field: "Address", title: "Địa chỉ", width: 200, filterable: false },
                    { 
                        title: "Vị trí", 
                        width: 160, 
                        filterable: false,
                        // Hiển thị tọa độ, nếu có tọa độ thì tạo link mở Google Maps luôn cho tiện
                        template: "#= Lat && Lng ? '<a href=\"https://www.google.com/maps?q=' + Lat + ',' + Lng + '\" target=\"_blank\">📍 ' + Lat + ', ' + Lng + '</a>' : '-' #"
                    }
                ]
            });
        });
    </script>
        </div>
    </div>
</div>