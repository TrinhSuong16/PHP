<div class="app-content content">
    <div class="content-overlay"></div>
    <div class="content-wrapper">
        <div class="content-header row"></div>
        <div class="content-body">
    <style>
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
            color: #7367f0;
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

        .yes { background-color: #28c76f !important; }
        .no { background-color: #ea5455 !important; }

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
            background-color: #7367f0 !important;
            border-color: #7367f0 !important;
        }
        .k-button-solid-info {
            background-color: #00cfe8 !important;
            border-color: #00cfe8 !important;
        }
    </style>

    <div class="header-area">
        <h2>DANH SÁCH ĐĂNG KÝ NHẬN TÀI LIỆU</h2>
        <div>
            <span style="margin-right: 15px; font-style: italic; color: #94a3b8;">
                Giờ hệ thống: <?= date('H:i d/m/Y') ?>
            </span>
            <a href="<?= base_url('index.php/auth/logout') ?>" class="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base">Đăng xuất</a>
        </div>
    </div>

    <div id="grid"></div>

    <script>
        // 1. URL CONFIGURATION
        var GLOBAL_RESEND_URL = "<?= base_url('index.php/register/resend_handler/') ?>";
        var GLOBAL_API_URL = "<?= base_url('index.php/admin/api_get_data') ?>";

        // 2. DATA SOURCE FROM PHP
        var DATA_FROM_PHP = [
            <?php foreach($customers as $c): ?>
            {
                ID: "<?= $c->id ?>",
                Email: "<?= $c->email ?>",
                Fullname: "<?= $c->fullname ?>",
                Gender: "<?= $c->gender ?>",
                Occupation: "<?= $c->occupation ?>",
                StatusVerified: "<?= $c->is_verified ? 'Đã xác minh' : 'Chưa xác minh' ?>",
                StatusRead: "<?= $c->is_email_opened ? 'Đã đọc' : 'Chưa đọc' ?>",
                StatusDownloaded: "<?= $c->is_downloaded ? 'Đã tải' : 'Chưa tải' ?>",
                ReadDate: "<?= $c->opened_at ? date('d/m/Y H:i', strtotime($c->opened_at)) : '-' ?>",
                DownloadDate: "<?= $c->downloaded_at ? date('d/m/Y H:i', strtotime($c->downloaded_at)) : '-' ?>",
                CreatedDate: "<?= date('d/m/Y H:i', strtotime($c->created_at)) ?>",
                Address: "<?= addslashes($c->address) ?>"
            },
            <?php endforeach; ?>
        ];

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
                    data: DATA_FROM_PHP,
                    pageSize: 15
                },
                height: 650,
                sortable: true,
                pageable: { refresh: true, pageSizes: [15, 30, 50], buttonCount: 5 },
                filterable: { mode: "menu" },
                columns: [
                    { field: "Fullname", title: "Họ tên", width: 160, locked: true },
                    { field: "Email", title: "Email", width: 200 },
                    { field: "StatusVerified", title: "Xác minh", width: 130, 
                      template: "<span class='status-badge #= StatusVerified == \"Đã xác minh\" ? \"yes\" : \"no\" #'>#= StatusVerified #</span>" 
                    },
                    { field: "StatusRead", title: "Đọc Email", width: 130, 
                      template: "<span class='status-badge #= StatusRead == \"Đã đọc\" ? \"yes\" : \"no\" #'>#= StatusRead #</span>" 
                    },
                    { field: "StatusDownloaded", title: "Tải tài liệu", width: 130, 
                      template: "<span class='status-badge #= StatusDownloaded == \"Đã tải\" ? \"yes\" : \"no\" #'>#= StatusDownloaded #</span>" 
                    },
                    {
                        title: "Thao tác", width: 180,
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
                    { field: "ReadDate", title: "Ngày đọc", width: 140 },
                    { field: "DownloadDate", title: "Ngày tải", width: 140 },
                    { field: "CreatedDate", title: "Ngày ĐK", width: 140 }
                ]
            });
        });
    </script>
        </div>
    </div>
</div>