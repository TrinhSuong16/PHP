function resendAction(id, type) {
    var title = (type === 'activation') ? "Gửi lại mail xác minh?" : "Gửi lại link tải tài liệu?";
    if (confirm(title)) {
        kendo.ui.progress($("#grid"), true);
        $.ajax({
            // Sử dụng biến GLOBAL_URL được định nghĩa ở file PHP
            url: GLOBAL_RESEND_URL + type + "/" + id,
            type: "GET",
            dataType: "json",
            success: function(res) {
                kendo.ui.progress($("#grid"), false);
                if(res.status === 'success') {
                    alert("Thành công: " + res.message);
                } else {
                    alert("Lỗi: " + res.message);
                }
            },
            error: function() {
                kendo.ui.progress($("#grid"), false);
                alert("Lỗi kết nối hệ thống!");
            }
        });
    }
}

// Khai báo ViewModel giữ nguyên như cũ
var adminVM = kendo.observable({
    customers: new kendo.data.DataSource({
        transport: {
            read: { 
                url: GLOBAL_API_URL, 
                dataType: "json" 
            }
        },
        pageSize: 10
    }),
    resendToQueue: function(id, type) {
        kendo.ui.progress($("#grid"), true);
        $.ajax({
            url: GLOBAL_ENQUEUE_URL + type + "/" + id,
            type: "GET",
            dataType: "json",
            success: function(res) {
                kendo.ui.progress($("#grid"), false);
                alert("Nhiệm vụ đã được đưa vào hàng đợi Linux thành công!");
            }
        });
    }
});

$(document).ready(function () {
    // Khởi tạo Grid với dataSource lấy từ biến PHP truyền sang
    $("#grid").kendoGrid({
        dataSource: {
            data: DATA_FROM_PHP, // Biến này chứa dữ liệu PHP foreach lúc nãy
            pageSize: 10
        },
        height: 600,
        pageable: { refresh: true, pageSizes: [10, 20, 50], buttonCount: 5 },
        filterable: { mode: "menu" },
        columnMenu: false,
        columns: GRID_COLUMNS_CONFIG // Cấu hình cột giữ nguyên bên file PHP truyền qua
    });
});