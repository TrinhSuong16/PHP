// assets/js/registerViewModel.js

// Đối tượng ViewModel cho trang Đăng ký
var registerVM = kendo.observable({
    email: "",
    fullname: "",
    gender: "Nam",
    birthday: "",
    occupation: "",
    address: "",
    lat: "",
    lng: "",
    locationStatus: "Đang xác định vị trí... (Vui lòng Cho phép)",
    statusColor: "#666",

    initGeolocation: function() {
        var that = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    that.set("lat", lat);
                    that.set("lng", lng);
                    that.set("locationStatus", "✅ Đã lấy được vị trí của bạn.");
                    that.set("statusColor", "green");
                }, 
                function(error) {
                    var msg = "";
                    switch(error.code) {
                        case error.PERMISSION_DENIED: msg = "❌ Bạn đã từ chối chia sẻ vị trí."; break;
                        case error.POSITION_UNAVAILABLE: msg = "❌ Không thể xác định vị trí."; break;
                        case error.TIMEOUT: msg = "❌ Hết thời gian yêu cầu."; break;
                        default: msg = "❌ Lỗi định vị không xác định."; break;
                    }
                    that.set("locationStatus", msg);
                    that.set("statusColor", "red");
                }
            );
        } else {
            this.set("locationStatus", "Trình duyệt không hỗ trợ định vị.");
        }
    }
});

$(document).ready(function() {
    // Thực hiện kết nối MVVM
    kendo.bind($(".container"), registerVM);
    // Chạy định vị
    registerVM.initGeolocation();
});