/*=========================================================================================
    File Name: sips.js
    Description: Sipusers Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

// $("#grid").on("click", ".customDelete", function () {
//     var row = $(this).closest("tr");
//     $("#grid").data("kendoGrid").removeRow(row);
// });
$("#export").click(function () {
    $("#grid").data("kendoGrid").saveAsExcel();
});

$("#sync_config").click(function () {
    $("#sync_config").attr({ "disabled": "disabled" }).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>`);
    let csrf = $('meta[name=csrf]').attr('content').split(":"),
        post = { [csrf[0]]: csrf[1] };
    $.post(base_url + "settings/sips/sync_config", post, function (response, status) {
        if (status === "success" && response.status) {
            toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
        } else {
            toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
        }
        $("#sync_config").removeAttr("disabled").html(`<i class="feather icon-save"></i>`);
    });
});

function copyExtension(id) {
    var base_url = $('meta[name=base_url]').attr('content');
    var csrf = $('meta[name=csrf]').attr('content').split(":");
    $.ajax({
        url: base_url + "settings/sips/find/" + id,
        type: "GET",
        data: { [csrf[0]]: csrf[1] },
        dataType: 'json',
        success: function (response) {
            data = response.data;
            var from_ext = parseInt(data['extension']) + 1;

            var template = kendo.template($("#copyTemplate").html());
            $("#copy-data-sidebar").html(template);

            $("#frm_copy_extension #from_ext").val(from_ext);
            $("#frm_copy_extension #secret").val(data.secret);
            $("#frm_copy_extension #outbound_group").val(data.outbound_group);
            $("#frm_copy_extension #callgroup").val(data.callgroup);
            $("#frm_copy_extension #record_calls").val(data.record_calls);
            $("#frm_copy_extension #types").val(data.types);
            $("#frm_copy_extension #language").val(data.language);
            $("#frm_copy_extension #nat").val(data.nat);
            $("#frm_copy_extension #call_limit").val(data.call_limit);
            $("#frm_copy_extension #cancallforward").val(data.cancallforward);
            $("#frm_copy_extension #canreinvite").val(data.canreinvite);
            $("#frm_copy_extension #dtmfmode").val(data.dtmfmode);
            $("#frm_copy_extension #timeout").val(data.timeout);
            $("#frm_copy_extension #mailbox").val(data.mailbox);
            $("#frm_copy_extension #pincode").val(data.pincode);
            $("#frm_copy_extension #transport").val(data.transport);
            $("#frm_copy_extension #encryption").val(data.encryption);
            $("#frm_copy_extension #deny").val(data.deny);
            $("#frm_copy_extension #permit").val(data.permit);
            $("#frm_copy_extension #forwarding").val(data.forwanding);
            $("#frm_copy_extension #destinatype").val(data.destinatype);
            $("#frm_copy_extension #destination").val(data.destination);
            $("#frm_copy_extension #webrtc").val(data.webrtc);
            $("#frm_copy_extension #videosupport").val(data.videosupport);

            setTimeout(function () {
                $(".add-new-data").addClass("show");
                $(".overlay-bg").addClass("show");
                $(".cancel-data-btn, .overlay-bg").on("click", function () {
                    $(".add-new-data").removeClass("show");
                    $(".overlay-bg").removeClass("show");
                    $("#copy-data-sidebar").html("");
                });
            }, 200);

            $("#frmCopySubmit").on("click", function () {
                var btself = this;
                $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
                let data = $("#frm_copy_extension").serializeObject(),
                    url = base_url + "settings/sips/copy";
                $.post(url, data, function (response, status) {
                    $(btself).removeAttr("disabled"); $('.spinner-border').remove();
                    if (status === "success") {
                        switch (response.status) {
                            case 1:
                                // Tắt form 
                                $(".add-new-data").removeClass("show")
                                $(".overlay-bg").removeClass("show")
                                $("#copy-data-sidebar").html("");
                                document.body.style.overflow = 'visible';
                                // Load lại data lên Grid
                                $("#grid").data("kendoGrid").dataSource.read();
                                //Bật thông báo
                                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                                break;
                            default:
                                toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                        }
                    } else {
                        toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    }
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function changeDestination(type, dest = '', strategy = '') {
    if (type == "off") {
        $("#destination").html(kendo.template($("#destination-default").html()));
        $("input[name=\"destination\"]").val(dest);
        $("[data-role='tagsinput']").tagsinput();
        $("#strategy").select2({
            dropdownAutoWidth: true,
            width: '100%',
            minimumResultsForSearch: Infinity
        });
        if (strategy) {
            $("#strategy").select2("trigger", "select", { data: { id: strategy, text: strategy.charAt(0).toUpperCase() + strategy.slice(1) } });
        }
    } else {
        $.ajax({
            url: base_url + "settings/sips/destination/" + type,
            type: "GET",
            dataType: 'json',
            success: function (response) {
                if (response.status == 1) {
                    let html = "<select class='form-control' name='destination'>";
                    response.data.forEach(function (item) {
                        if (dest !== item.id)
                            html += "<option value='" + item.id + "'>" + item.name + "</option>";
                        else
                            html += "<option value='" + item.id + "' selected>" + item.name + "</option>";
                    });
                    html += "</select>";
                    $("#destination").html(html);
                    $('select[name="destination"]').select2({
                        dropdownAutoWidth: true,
                        width: '100%'
                    });
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

function activeSidebar(formData = false) {
    $(".add-new-data").addClass("show");
    $(".overlay-bg").addClass("show");
    $(".cancel-data-btn, .overlay-bg").on("click", function () {
        $(".add-new-data").removeClass("show")
        $(".overlay-bg").removeClass("show")
        $("#add-new-data-sidebar").html("");
    });

    $('input[type=radio][name=record_calls]').on('change', function () {
        if ($(this).val() == "1") {
            $(".record-direction").show();
        } else {
            $(".record-direction").hide();
        }
    });

    $('input[type=radio][name=forwarding]').on('change', function () {
        if ($(this).val() == "1") {
            $(".forwarding_ext").show();
        } else {
            $(".forwarding_ext").hide();
        }
    });

    var $callgroup = $('#callgroup'),
        $outbound_group = $('#outbound_group'),
        $mailbox = $('#mailbox'),
        $dtmfmode = $('#dtmfmode'),
        $destinatype = $('#destinatype'),
        $destination = $('#destination');
    $callgroup.select2({
        dropdownAutoWidth: false,
        width: '100%',
        ajax: {
            url: base_url + 'settings/sips/callgroups',
            dataType: 'json',
            type: "GET",
            delay: 250,
            data: function (params) {
                var query = {
                    search: params.term,
                    page: params.page || 1
                }
                // Query parameters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function (response, params) {
                params.page = params.page || 1;
                return {
                    results: response.data,
                    pagination: {
                        more: (params.page * 20) < response.total
                    }
                };
            },
            transport: function (params, success, failure) {
                var $request = $.ajax(params);

                $request.then(success);
                $request.fail(failure);

                return $request;
            },
            cache: true
        }
    });

    $outbound_group.select2({
        dropdownAutoWidth: false,
        width: '100%',
        ajax: {
            url: base_url + 'settings/sips/outbound_group',
            dataType: 'json',
            type: "GET",
            delay: 250,
            data: function (params) {
                var query = {
                    search: params.term,
                    page: params.page || 1
                }
                // Query parameters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function (response, params) {
                params.page = params.page || 1;
                return {
                    results: response.data,
                    pagination: {
                        more: (params.page * 20) < response.total
                    }
                };
            },
            transport: function (params, success, failure) {
                var $request = $.ajax(params);

                $request.then(success);
                $request.fail(failure);

                return $request;
            },
            cache: true
        }
    });

    $mailbox.select2({
        dropdownAutoWidth: false,
        width: '100%',
        ajax: {
            url: base_url + 'settings/sips/mailbox',
            dataType: 'json',
            type: "GET",
            delay: 250,
            data: function (params) {
                var query = {
                    search: params.term,
                    page: params.page || 1
                }
                // Query parameters will be ?search=[term]&page=[page]
                return query;
            },
            processResults: function (response, params) {
                params.page = params.page || 1;
                return {
                    results: response.data,
                    pagination: {
                        more: (params.page * 20) < response.total
                    }
                };
            },
            transport: function (params, success, failure) {
                var $request = $.ajax(params);

                $request.then(success);
                $request.fail(failure);

                return $request;
            },
            cache: true
        }
    });

    $dtmfmode.select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    $destinatype.select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    $destinatype.on('select2:select', function (evt) {
        if (evt) {
            changeDestination(evt.params.data.id);
        }
    });

    if (formData != false) {
        $callgroup.select2("trigger", "select", { data: { id: formData.callgroup, text: formData.groupname } });
        $outbound_group.select2("trigger", "select", { data: { id: formData.outbound_group, text: formData.outbound_group_name } });
        $mailbox.select2("trigger", "select", { data: { id: formData.mailbox, text: formData.mailbox } });
        $dtmfmode.select2("trigger", "select", { data: { id: formData.dtmfmode, text: formData.dtmfmode } });
        if (formData.record_calls != '0') {
            $(".record-direction").show();
        } else {
            $(".record-direction").hide();
        }
        if (formData.forwanding != "off") {
            $(".forwarding_ext").show();
        }
        if (formData.destinatype == "off") {
            changeDestination(formData.destinatype, formData.destination, formData.strategy);
        } else {
            changeDestination(formData.destinatype, formData.destination);
        }
        $('.select2-search input, :focus,input').prop('focus', false).blur();
    } else {
        const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
        $("#secret").val(random(10000000, 99999999));
        $("#destination").html(kendo.template($("#destination-default").html()));
        $("[data-role='tagsinput']").tagsinput();
    }

    let passwordInput = document.getElementById('secret'),
        toggle = document.getElementById('btnToggle'),
        icon = document.getElementById('eyeIcon');

    function togglePassword() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggle.innerHTML = '<i class="feather icon-eye-off" id="eyeIcon"></i>';
        } else {
            passwordInput.type = 'password';
            toggle.innerHTML = '<i class="feather icon-eye" id="eyeIcon"></i>';
        }
    }

    function checkInput() {
        if (passwordInput.value === '') {
            toggle.style.display = 'none';
            toggle.innerHTML = '<i class="feather icon-eye" id="eyeIcon"></i>';
            passwordInput.type = 'password';
        } else {
            toggle.innerHTML = '<i class="feather icon-eye" id="eyeIcon"></i>';
            toggle.style.display = 'block';
        }
    }

    toggle.addEventListener('click', togglePassword, false);
    passwordInput.addEventListener('keyup', checkInput, false);

    $('input[type="text"], input[type="number"], input[type="password"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })

    $("#frmSubmit").on("click", function () {
        var btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_extension").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/sips/add" : "settings/sips/update");
        $.post(url, data, function (response, status) {
            $(btself).removeAttr("disabled"); $('.spinner-border').remove();
            if (status === "success") {
                switch (response.status) {
                    case 1:
                        // Tắt form 
                        $(".add-new-data").removeClass("show")
                        $(".overlay-bg").removeClass("show")
                        $("#add-new-data-sidebar").html("");
                        document.body.style.overflow = 'visible';
                        // Load lại data lên Grid
                        $("#grid").data("kendoGrid").dataSource.read();
                        //Bật thông báo
                        toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                        break;
                    case -1:
                        if (typeof response.field != 'undefined') {
                            let error_field = response.field,
                                error_message = '<div class="help-block"><ul role="alert"><li>' + response.message + '</li></ul></div>';
                            error_field.split(',').forEach(ele => {
                                let formGroup = $("#" + ele).closest("div.form-group");
                                if (!formGroup.hasClass('error')) {
                                    formGroup.addClass("error");
                                } else {
                                    $("#" + ele).parent().parent().find(".help-block").remove();
                                }
                                $("#" + ele).parent().after(error_message);
                            });
                        }
                    default:
                        toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                }
            } else {
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
        });
    });

    // Scrollbar
    if ($(".data-items").length > 0) {
        new PerfectScrollbar(".data-items", { wheelPropagation: false })
    }
}

//Open sidebar 
(function () {
    $("#add-sip").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });

    $('#add-customer').on('click', function (e) {
        e.preventDefault();

        $("#import-data-sidebar").html($("#importTemplate").html());

        setTimeout(function () {
            $(".add-new-data").addClass("show");
            $(".overlay-bg").addClass("show");
            $(".cancel-data-btn, .overlay-bg").on("click", function () {
                $(".add-new-data").removeClass("show")
                $(".overlay-bg").removeClass("show")
                $("#import-data-sidebar").html("");
            });

            var spreadsheet = $("#spreadsheet").kendoSpreadsheet({ toolbar: false, sheetsbar: false, height: 1000 });

            $("#file_import_sips").kendoUpload({
                async: {
                    saveUrl: `${base_url}settings/sips/before_import`
                },
                multiple: false,
                localization: {
                    "select": controlsKendo.upload.select.localization
                },
                upload: function (e) {
                    let csrf = $('meta[name=csrf]').attr('content').split(":");
                    e.data = { [csrf[0]]: csrf[1] };
                },
                select: function (e) {
                    var extension = e.files[0].extension.toLowerCase();
                    if ([".xlsx"].indexOf(extension) == -1) {
                        alert(controlsKendo.upload.select.supported);
                        e.preventDefault();
                    }
                },
                success: function (e) {
                    //load csrf
                    document.querySelector('meta[name="csrf"]').setAttribute("content", e.response.csrf.name + ":" + e.response.csrf.value);
                    $(document).find('input[type="hidden"]').filter('[name="' + e.response.csrf.name + '"]').val(e.response.csrf.value);
                    // Load the converted document into the spreadsheet
                    let exists = e.response.data.exists,
                        skip = e.response.data.skip,
                        good = e.response.data.good,
                        wu_exists = e.response.data.wu_exists,
                        header = e.response.data.header,
                        message = '';
                    if (exists.length) {
                        //let result = objArray.map(a => a.foo);
                        //let result = objArray.map(({ foo }) => foo)
                        message += controlsKendo.upload.success.exists + exists.map(({ extension }) => extension).join() + '<br>';
                    }

                    if (skip.length) {
                        message += controlsKendo.upload.success.skip + skip.map(({ extension }) => extension).join() + '<br>';
                    }

                    if (wu_exists.length) {
                        message += controlsKendo.upload.success.wu_exists + wu_exists.map(({ webuser }) => webuser).join() + '<br>';
                    }

                    if (good.length) {
                        message += controlsKendo.upload.success.good + good.map(({ extension }) => extension).join();
                        $('#sips_array').val(JSON.stringify(good));
                        let sheetJson = {
                            activeSheet: "Data Import",
                            sheets: [{
                                name: "Data Import",
                                columns: [],
                                rows: [{ cells: [], index: 0 }]
                            }]
                        };
                        for (const [key, value] of Object.entries(header)) {
                            sheetJson.sheets[0].columns.push({ width: 100 });
                            sheetJson.sheets[0].rows[0].cells.push({ "background": "#3D85C6", "color": "#FFFFFF", "index": key, "textAlign": "center", "value": value });
                        }
                        for (const [key, value] of Object.entries(good)) {
                            sheetJson.sheets[0].rows[Number(key) + 1] = { cells: [], index: Number(key) + 1 };
                            delete value["secret"];
                            for (const [k, v] of Object.entries(value)) {
                                sheetJson.sheets[0].rows[Number(key) + 1].cells.push({ index: Object.keys(value).indexOf(k), value: v });
                            }
                        }
                        spreadsheet.data("kendoSpreadsheet").fromJSON(sheetJson);
                    }
                    if (message) toastr.info(message, 'Info!', { positionClass: 'toast-top-right', containerId: 'toast-top-right', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });

                    // spreadsheet.getKendoSpreadsheet().saveJSON().then(function(data){
                    // var json = JSON.stringify(data, null, 2);
                    // $("#prepare").text(json);
                    // });
                }
            });

            $('input[type=radio][name=record_calls]').on('change', function () {
                if ($(this).val() == "1") {
                    $(".record-direction").show();
                } else {
                    $(".record-direction").hide();
                }
            });

            $('input[type=radio][name=forwarding]').on('change', function () {
                if ($(this).val() == "1") {
                    $(".forwarding_ext").show();
                } else {
                    $(".forwarding_ext").hide();
                }
            });

            var $callgroup = $('#callgroup'),
                $outbound_group = $('#outbound_group'),
                $mailbox = $('#mailbox'),
                $dtmfmode = $('#dtmfmode'),
                $destinatype = $('#destinatype'),
                $destination = $('#destination');
            $callgroup.select2({
                dropdownAutoWidth: false,
                width: '100%',
                ajax: {
                    url: base_url + 'settings/sips/callgroups',
                    dataType: 'json',
                    type: "GET",
                    delay: 250,
                    data: function (params) {
                        var query = {
                            search: params.term,
                            page: params.page || 1
                        }
                        // Query parameters will be ?search=[term]&page=[page]
                        return query;
                    },
                    processResults: function (response, params) {
                        params.page = params.page || 1;
                        return {
                            results: response.data,
                            pagination: {
                                more: (params.page * 20) < response.total
                            }
                        };
                    },
                    transport: function (params, success, failure) {
                        var $request = $.ajax(params);

                        $request.then(success);
                        $request.fail(failure);

                        return $request;
                    },
                    cache: true
                }
            });

            $outbound_group.select2({
                dropdownAutoWidth: false,
                width: '100%',
                ajax: {
                    url: base_url + 'settings/sips/outbound_group',
                    dataType: 'json',
                    type: "GET",
                    delay: 250,
                    data: function (params) {
                        var query = {
                            search: params.term,
                            page: params.page || 1
                        }
                        // Query parameters will be ?search=[term]&page=[page]
                        return query;
                    },
                    processResults: function (response, params) {
                        params.page = params.page || 1;
                        return {
                            results: response.data,
                            pagination: {
                                more: (params.page * 20) < response.total
                            }
                        };
                    },
                    transport: function (params, success, failure) {
                        var $request = $.ajax(params);

                        $request.then(success);
                        $request.fail(failure);

                        return $request;
                    },
                    cache: true
                }
            });

            $mailbox.select2({
                dropdownAutoWidth: false,
                width: '100%',
                ajax: {
                    url: base_url + 'settings/sips/mailbox',
                    dataType: 'json',
                    type: "GET",
                    delay: 250,
                    data: function (params) {
                        var query = {
                            search: params.term,
                            page: params.page || 1
                        }
                        // Query parameters will be ?search=[term]&page=[page]
                        return query;
                    },
                    processResults: function (response, params) {
                        params.page = params.page || 1;
                        return {
                            results: response.data,
                            pagination: {
                                more: (params.page * 20) < response.total
                            }
                        };
                    },
                    transport: function (params, success, failure) {
                        var $request = $.ajax(params);

                        $request.then(success);
                        $request.fail(failure);

                        return $request;
                    },
                    cache: true
                }
            });

            $dtmfmode.select2({
                dropdownAutoWidth: true,
                width: '100%',
                minimumResultsForSearch: Infinity
            });

            $destinatype.select2({
                dropdownAutoWidth: true,
                width: '100%',
                minimumResultsForSearch: Infinity
            });

            $destinatype.on('select2:select', function (evt) {
                if (evt) {
                    changeDestination(evt.params.data.id);
                }
            });

            $("#destination").html(kendo.template($("#destination-default").html()));
            $("[data-role='tagsinput']").tagsinput();

            $('#frmImportSubmit').on('click', function(e){
                let btself = this;
                $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
                let data = $("#frm_import_extension").serializeObject(),
                    url = `${base_url}settings/sips/import`;
                $.post(url, data, function (response, status) {
                    $(btself).removeAttr("disabled"); $('.spinner-border').remove();
                    if (status === "success") {
                        switch (response.status) {
                            case 1:
                                // Tắt form 
                                $(".add-new-data").removeClass("show")
                                $(".overlay-bg").removeClass("show")
                                $("#add-new-data-sidebar").html("");
                                document.body.style.overflow = 'visible';
                                // Load lại data lên Grid
                                $("#grid").data("kendoGrid").dataSource.read();
                                //Bật thông báo
                                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                                break;
                            case -1:
                                if (typeof response.field != 'undefined') {
                                    let error_field = response.field,
                                        error_message = '<div class="help-block"><ul role="alert"><li>' + response.message + '</li></ul></div>';
                                    error_field.split(',').forEach(ele => {
                                        let formGroup = $("#" + ele).closest("div.form-group");
                                        if (!formGroup.hasClass('error')) {
                                            formGroup.addClass("error");
                                        } else {
                                            $("#" + ele).parent().parent().find(".help-block").remove();
                                        }
                                        $("#" + ele).parent().after(error_message);
                                    });
                                }
                            default:
                                toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                        }
                    } else {
                        toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    }
                });
            });

            // Scrollbar
            if ($(".data-items").length > 0) {
                new PerfectScrollbar(".data-items", { wheelPropagation: false })
            }
        }, 200);
    });
})();

function removeMany(data) {
    let windowConfirm = $("#windowConfirm").kendoWindow({
        title: '',
        visible: false, //the window will not appear before its .open method is called
        width: "400px",
    }).data("kendoWindow");
    let windowConfirmAllTemplate = kendo.template($("#windowConfirmAllTemplate").html());
    let result = windowConfirmAllTemplate({ formData: { extensions: $(data).data('extensions') } });
    windowConfirm.title($("#windowConfirmAllTemplate").attr("title"));
    windowConfirm.content(result); //send the row data object to the template and render it
    windowConfirm.center().open();

    $(".k-button-no").click(function () {
        windowConfirm.close();
    })

    $(".k-button-yes").click(function () {
        windowConfirm.close();
        kendo.ui.progress($("#grid").data("kendoGrid").element, true);
        let csrf = $('meta[name=csrf]').attr('content').split(":"),
            post = { [csrf[0]]: csrf[1], remove: $(data).data('remove'), ids: $(data).data('ids'), extensions: $(data).data('extensions') };
        $.post(base_url + "settings/sips/destroy_many", post, function (response, status) {
            kendo.ui.progress($("#grid").data("kendoGrid").element, false);
            if (status === "success" && response.status) {
                $("#grid").data("kendoGrid").dataSource.read();
                //Bật thông báo
                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
            } else {
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 5000 });
            }
        });
    });
}

$(document).ready(function () {
    function onChange(e) {
        var selectedRows = this.select();
        var selectedDataItems = [];
        for (var i = 0; i < selectedRows.length; i++) {
            var dataItem = this.dataItem(selectedRows[i]);
            selectedDataItems.push({ id: dataItem.id, extension: dataItem.extension, customer_code: dataItem.customer_code });
        }
        if (selectedDataItems.length) {
            // console.log("Selected data items' extension: " + selectedDataItems.map(e => e.extension).join(", "));
            // let ids = this.selectedKeyNames().join(","); // <- use models
            // console.log(selectedDataItems)
            let ids = selectedDataItems.map(e => e.id).join(",");
            let extensions = selectedDataItems.map(e => e.extension).join(", ");
            $(".k-filter-row > th:first-child").html(`<button class="k-button k-primary k-grid-delete" data-extensions='${extensions}' data-ids='${ids}' data-remove='${JSON.stringify(selectedDataItems)}' onclick="removeMany(this)"><span class="k-icon k-i-delete"></span></button>`);
        } else {
            $(".k-filter-row > th:first-child").html('&nbsp');
        }
    }

    var windowConfirm = $("#windowConfirm").kendoWindow({
        title: '',
        visible: false, //the window will not appear before its .open method is called
        width: "400px",
        // height: "200px",
    }).data("kendoWindow");

    var grid = $("#grid").kendoGrid({
        excel: {
            allPages: true
        },
        dataSource: {
            transport: {
                read: {
                    url: base_url + "settings/sips/lists",
                    contentType: "application/json",
                    type: "GET"
                }
            },
            parameterMap: function (data) {
                if (data.filter) {
                    $.each(data.filter.filters, function (key, value) {
                        data.filter.filters[key] = value;
                    });
                }
                return kendo.stringify(data);
            },
            schema: {
                data: "data",
                total: "total"
            },
            page: 1,
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            change: function (e) {
                idx = this.skip() + 1;
                $.each(this.data(), (k, output) => {
                    output.no = idx;
                    idx++;
                })
            }
        },
        dataBound: function (e) {
            $(".k-filter-row > th:first-child").html('&nbsp');
        },
        sortable: false,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        filterable: {
            extra: false,
            mode: "row",
            operators: {
                string: {
                    contains: controlsKendo.grid.filter.operators.contains,// "Starts with",                    
                    eq: controlsKendo.grid.filter.operators.eq,// "Is equal to",
                    neq: controlsKendo.grid.filter.operators.neq// "Is not equal to"
                }
            }
        },
        noRecords: true,
        scrollable: true,
        change: onChange,
        columns: [{
            selectable: true,
            width: 50,
            headerAttributes: {
                class: "table-header-cell checkbox-align",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell checkbox-align",
                style: "text-align: center;"
            }
        }, {
            title: controlsKendo.grid.column.title.copy,
            template: kendo.template($("#action").html()),
            width: 100,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "no",
            title: controlsKendo.grid.column.title.no,
            filterable: false,
            width: 70,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "extension",
            title: controlsKendo.grid.column.title.extension
        }, {
            field: "callername",
            title: controlsKendo.grid.column.title.callername
        }, {
            field: "record_calls",
            title: controlsKendo.grid.column.title.record_calls,
            width: 180,
            template: function (dataItem) {
                if (dataItem.record_calls != 0) {
                    return `<button class="btn-icon btn btn-primary btn-round btn-sm" type="button" data-toggle="tooltip" data-placement="top" data-original-title="In Use"><i class="feather icon-mic"></i></button>`;
                } else {
                    return `<button class="btn-icon btn rounded-circle btn-sm btn-outline-primary" type="button" data-toggle="tooltip" data-placement="top" data-original-title="Not in use"><i class="feather icon-mic-off"></i></button>`;
                }
            },
            filterable: {
                cell: {
                    showOperators: false,
                    template: function (args) {
                        args.element.kendoDropDownList({
                            dataSource: [
                                { id: "1", text: controlsKendo.grid.filter.value.record_use },
                                { id: "0", text: controlsKendo.grid.filter.value.record_not_use }
                            ],
                            optionLabel: "--Select--",
                            dataTextField: "text",
                            dataValueField: "id",
                            valuePrimitive: true
                        });
                    }
                }
            },
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "groupname",
            title: controlsKendo.grid.column.title.groupname,
            filterable: false,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "created_time",
            title: controlsKendo.grid.column.title.created_time,
            filterable: false,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
            //template: "#= (typeof date_create == \"undefined\" || date_create == null  ||  typeof (date_create) == \"object\" || date_create == \"\") ? \"\" : date_create #"
        }, {
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
            command: [{
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "edit",
                //template: "<a href='javascript:void(0)' class='k-button k-grid-edit'><span class='k-icon k-i-edit'></span>" + controlsKendo.grid.button.edit + "</a>",
                template: kendo.template($("#gridActionEditTemplate").html()),
                click(e) {
                    e.preventDefault();
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    var formData = this.dataItem(tr),
                        data = { formData: formData };
                    var template = kendo.template($("#addnewTemplate").html());
                    var result = template(data);
                    $("#add-new-data-sidebar").html(result);
                    // $(this).removeClass("btn-secondary")
                    setTimeout(function () {
                        activeSidebar(formData);
                    }, 200);
                }
            }, {
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "delete",
                //template: "<a href='javascript:void(0)' class='k-button k-primary k-grid-delete k-state-disabled'><span class='k-icon k-i-delete'></span>" + controlsKendo.grid.button.delete + "</a>",
                template: kendo.template($("#gridActionDeleteTemplate").html()),
                click(e) {
                    e.preventDefault();
                    var windowConfirmTemplate = kendo.template($("#windowConfirmTemplate").html());
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    let formData = this.dataItem(tr),
                        data = { formData: formData }
                    var result = windowConfirmTemplate(data);
                    windowConfirm.title($("#windowConfirmTemplate").attr("title"));
                    windowConfirm.content(result); //send the row data object to the template and render it
                    windowConfirm.center().open();

                    //Xử lý button hủy bỏ xóa
                    $(".k-button-no").click(function () {
                        windowConfirm.close();
                    })

                    //Xử lý button xác nhận xóa
                    $(".k-button-yes").click(function () {
                        windowConfirm.close();
                        kendo.ui.progress(grid.element, true);
                        let csrf = $('meta[name=csrf]').attr('content').split(":"),
                            post = { [csrf[0]]: csrf[1], id: formData.id, extension: formData.extension, customer_code: formData.customer_code };
                        $.post(base_url + "settings/sips/destroy", post, function (response, status) {
                            kendo.ui.progress(grid.element, false);
                            if (status === "success" && response.status) {
                                grid.dataSource.remove(formData)  //prepare a "destroy" request
                                grid.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                                //Bật thông báo
                                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                            } else {
                                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                            }
                        });
                    });
                }
            }],
            title: "&nbsp;",
            width: 170
        }]
    }).data("kendoGrid");
});