(function () {
	this.editProfile = function (ele) {
		$(ele).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
		var data = $('#account_form').serializeObject();
		$.ajax({
			url: base_url + "account/profiles",
			type: "POST",
			data: data,
			dataType: 'json',
			success: function (response) {
				$(ele).removeAttr("disabled"); $('.spinner-border').remove();
				if (response.status == 1) {
					toastr.success(response.message, 'Info!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
				} else {
					toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
				}
			},
			error: function (e) {
				$(ele).removeAttr("disabled"); $('.spinner-border').remove();
				// console.log(e.message);
				toastr.error(e.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
			}
		});
	};

	this.changePassword = function (ele) {
		$(ele).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
		var data = $('#passwordForm').serializeObject();
		$.ajax({
			url: base_url + "account/changepwd",
			type: "POST",
			data: data,
			dataType: 'json',
			success: function (response) {
				$(ele).removeAttr("disabled"); $('.spinner-border').remove();
				if (response.status == 1) {
					alert(response.message);
					pbx.logout(response);
				} else {
					toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
				}
			},
			error: function (e) {
				$(ele).removeAttr("disabled"); $('.spinner-border').remove();
				toastr.error(e.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
			}
		})
	};

	this.checkPassword = function (str) {
		var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
		return re.test(str);
	};
})();