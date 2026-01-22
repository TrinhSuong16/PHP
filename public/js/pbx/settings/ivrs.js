/*=========================================================================================
    File Name: ivrs.js
    Description: IVRs Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();


function changeDestination(ele, type, dest = '') {
    if (type == "hangup") {
        $("#" + ele.replace("destination", "detail")).html(`<input type="text" id="${ele.replace("destination", "details")}" name="${ele.replace("_destination", "[details]")}" class="form-control" value="set key" readonly />`);
    } else {
        $.ajax({
            url: base_url + "settings/ivrs/destination/" + type,
            type: "GET",
            dataType: 'json',
            success: function (response) {
                if (response.status == 1) {
                    let html = `<select class="form-control" id="${ele.replace("destination", "details")}" name="${ele.replace("_destination", "[details]")}">`;
                    response.data.forEach(function (item) {
                        if (dest !== item.id) {
                            html += `<option value="${item.id}" data-text="${item.name}">${item.name}</option>`;
                        } else {
                            html += `<option value="${item.id}" data-text="${item.name}" selected>${item.name}</option>`;
                        }
                    });
                    html += "</select>";
                    $("#" + ele.replace("destination", "detail")).html(html);
                    $("#" + ele.replace("destination", "details")).select2({
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

    $('input[type="text"], input[type="number"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })
    var ivrmenu_hours = [], options_keys = [];
    var $audio = $('#audio'),
        $destination = $('#after_hours_destination,#no_sel_destination,#invalid_sel_destination,#options_keys_destination');
    $audio.select2({
        allowClear: true,
        placeholder: "",
        dropdownAutoWidth: false,
        width: '100%',
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (repo) {
            if (repo.loading) {
                return repo.text;
            }
            let $container = $(`<div class='select2-result-repository clearfix'>
                                    <div class='select2-result-repository__title'>
                                        <i class="fa fa-audio-description"></i> ${repo.text}
                                    </div>
                                </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            return `<i class="fa fa-audio-description"></i>  ${repo.text}`;
        },
        ajax: {
            url: base_url + 'settings/ivrs/audio',
            dataType: 'json',
            type: "GET",
            delay: 250,
            data: function (params) {
                var query = {
                    search: params.term,
                    page: params.page || 1
                }
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

    $audio.on('select2:select', function (evt) {
        if (evt) {
            let type = evt.params.data.id,
                target = evt.target;
            // console.log(target)
        }
    })

    $("#from_hour,#to_hour,#from_minute,#to_minute,#from_day,#to_day,#from_day_of_month,#to_day_of_month,#from_month,#to_month").select2({});

    $destination.select2({
        allowClear: true,
        placeholder: "",
        dropdownAutoWidth: false,
        minimumResultsForSearch: Infinity,
        width: '100%',
        ajax: {
            url: base_url + 'settings/ivrs/destinations',
            dataType: 'json',
            type: "GET",
            delay: 250,
            data: function (params) {
                var query = {
                    search: params.term,
                    page: params.page || 1
                }
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

    $destination.on('select2:select', function (evt) {
        if (evt) {
            let type = evt.params.data.id,
                target = evt.target.id;
            if (type == "hangup") {
                $("#" + target.replace("destination", "detail")).html(`<input type="text" id="${target.replace("destination", "details")}" name="${target.replace("_destination", "[details]")}" class="form-control" value="set key" readonly />`);
            } else {
                $.ajax({
                    url: base_url + "settings/ivrs/destination/" + type,
                    type: "GET",
                    dataType: 'json',
                    success: function (response) {
                        if (response.status == 1) {
                            let html = `<select class="form-control" id="${target.replace("destination", "details")}" name="${target.replace("_destination", "[details]")}">`;
                            response.data.forEach(function (item) {
                                html += `<option value="${item.id}" data-text="${item.name}">${item.name}</option>`;
                            });
                            html += "</select>";
                            $("#" + target.replace("destination", "detail")).html(html);
                            $("#" + target.replace("destination", "details")).select2({
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
    });

    $('#digit_timeout,#digit_number,#attempts').select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    $("#grid_time_configs").kendoGrid({
        dataSource: ivrmenu_hours,
        height: 410,
        pageable: {
            refresh: true,
            pageSize: 9,
            buttonCount: 5
        },
        filterable: false,
        noRecords: true,
        sortable: false,
        columns: [{
            field: "from_time",
            title: controlsKendo.grid.column.title.from_time,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "to_time",
            title: controlsKendo.grid.column.title.to_time,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
            command: [/*{
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "edit",
                template: kendo.template($("#gridActionEditTemplate").html()),
                click(e) {
                    e.preventDefault();
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    var formData = this.dataItem(tr);
                    $('#from_hour').select2("trigger", "select", { data: { id: formData.from_hour, text: formData.from_hour } });
                    $('#from_minute').select2("trigger", "select", { data: { id: formData.from_minute, text: formData.from_minute } });
                    $('#from_day').select2("trigger", "select", { data: { id: formData.from_day, text: formData.from_day } });
                    $('#from_day_of_month').select2("trigger", "select", { data: { id: formData.from_day_of_month, text: formData.from_day_of_month } });
                    $('#from_month').select2("trigger", "select", { data: { id: formData.from_month, text: formData.from_month } });

                    $('#to_hour').select2("trigger", "select", { data: { id: formData.to_hour, text: formData.to_hour } });
                    $('#to_minute').select2("trigger", "select", { data: { id: formData.to_minute, text: formData.to_minute } });
                    $('#to_day').select2("trigger", "select", { data: { id: formData.to_day, text: formData.to_day } });
                    $('#to_day_of_month').select2("trigger", "select", { data: { id: formData.to_day_of_month, text: formData.to_day_of_month } });
                    $('#to_month').select2("trigger", "select", { data: { id: formData.to_month, text: formData.to_month } });

                    $('.select2-search input, :focus,input').prop('focus', false).blur();
                }
            }, */
                {
                    name: "delete",
                    template: kendo.template($("#gridActionDeleteTemplate").html()),
                    click(e) {
                        e.preventDefault();
                        var windowConfirmTemplate = kendo.template($("#windowConfirmOptionsKeysTemplate").html());
                        var tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        let formData = this.dataItem(tr),
                            data = { formData: formData }
                        if (formData.isset == 1) {
                            var result = windowConfirmTemplate(data);
                            var windowConfirm = $("#windowConfirm").kendoWindow({
                                title: '',
                                visible: false, //the window will not appear before its .open method is called
                                width: "400px",
                            }).data("kendoWindow");
                            windowConfirm.title($("#windowConfirmOptionsKeysTemplate").attr("title"));
                            windowConfirm.content(result); //send the row data object to the template and render it
                            windowConfirm.center().open();

                            //Xử lý button hủy bỏ xóa
                            $(".k-button-no").click(function () {
                                windowConfirm.close();
                            })

                            $(".k-button-yes").click(function () {
                                var grid_time_configs = $("#grid_time_configs").data("kendoGrid");
                                grid_time_configs.dataSource.remove(formData)
                                grid_time_configs.dataSource.sync()
                                ivrmenu_hours = ivrmenu_hours.filter(function (obj) { return !(obj.from_time == formData.from_time && obj.to_time == formData.to_time); });
                                $('input[name="time_configs"]').val(JSON.stringify(ivrmenu_hours));
                                windowConfirm.close();
                            });
                        } else {
                            var grid_time_configs = $("#grid_time_configs").data("kendoGrid");
                            grid_time_configs.dataSource.remove(formData)
                            grid_time_configs.dataSource.sync()
                            ivrmenu_hours = ivrmenu_hours.filter(function (obj) { return !(obj.from_time == formData.from_time && obj.to_time == formData.to_time); });
                            $('input[name="time_configs"]').val(JSON.stringify(ivrmenu_hours));
                        }
                    }
                }],
            width: "80px"
        }]
    });

    $('#add_time_config').on('click', function (e) {
        let _from_hour = $("#from_hour").val(),
            _from_minute = $("#from_minute").val(),
            _from_day = $("#from_day").val(),
            _from_day_of_month = $("#from_day_of_month").val(),
            _from_month = $("#from_month").val(),
            _to_hour = $("#to_hour").val(),
            _to_minute = $("#to_minute").val(),
            _to_day = $("#to_day").val(),
            _to_day_of_month = $("#to_day_of_month").val(),
            _to_month = $("#to_month").val();

        let _from_time = `${_from_hour}:${_from_minute} ${_from_day} ${_from_day_of_month} ${_from_month.charAt(0).toUpperCase() + _from_month.slice(1)}`,
            _to_time = `${_to_hour}:${_to_minute} ${_to_day} ${_to_day_of_month} ${_to_month.charAt(0).toUpperCase() + _to_month.slice(1)}`;
        let found = ivrmenu_hours.some(el => (el.from_time === _from_time && el.to_time === _to_time));
        if (!found) {
            let grid_time_configs = $("#grid_time_configs").data("kendoGrid");
            let item = {
                from_hour: _from_hour,
                from_minute: _from_minute,
                from_day: _from_day,
                from_day_of_month: _from_day_of_month,
                from_month: _from_month,
                to_hour: _to_hour,
                to_minute: _to_minute,
                to_day: _to_day,
                to_day_of_month: _to_day_of_month,
                to_month: _to_month,
                from_time: _from_time,
                to_time: _to_time,
                isset: 0
            };
            grid_time_configs.dataSource.add(item);
            ivrmenu_hours.push(item);
            $('input[name="time_configs"]').val(JSON.stringify(ivrmenu_hours));
        } else {
            Swal.fire({
                title: "Error!",
                text: "Time range already exist",
                type: "error",
                confirmButtonClass: 'btn btn-warning',
                buttonsStyling: false
            });
        }
    });

    $("#grid_options_keys").kendoGrid({
        dataSource: options_keys,
        height: 400,
        pageable: {
            refresh: true,
            pageSize: 5,
            buttonCount: 5
        },
        filterable: false,
        noRecords: true,
        sortable: false,
        columns: [{
            field: "key",
            title: controlsKendo.grid.column.title.key,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "destination_text",
            title: controlsKendo.grid.column.title.destination,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "detail_text",
            title: controlsKendo.grid.column.title.details,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "useraction",
            title: controlsKendo.grid.column.title.useraction,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
            command: [{
                name: "delete",
                template: kendo.template($("#gridActionDeleteTemplate").html()),
                click(e) {
                    e.preventDefault();
                    var windowConfirmTemplate = kendo.template($("#windowConfirmOptionsKeysTemplate").html());
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    let formData = this.dataItem(tr),
                        data = { formData: formData }
                    if (formData.isset == 1) {
                        var result = windowConfirmTemplate(data);
                        var windowConfirm = $("#windowConfirm").kendoWindow({
                            title: '',
                            visible: false, //the window will not appear before its .open method is called
                            width: "400px",
                            // height: "200px",
                        }).data("kendoWindow");
                        windowConfirm.title($("#windowConfirmOptionsKeysTemplate").attr("title"));
                        windowConfirm.content(result); //send the row data object to the template and render it
                        windowConfirm.center().open();

                        //Xử lý button hủy bỏ xóa
                        $(".k-button-no").click(function () {
                            windowConfirm.close();
                        })

                        $(".k-button-yes").click(function () {
                            var grid_options_keys = $("#grid_options_keys").data("kendoGrid");
                            grid_options_keys.dataSource.remove(formData)  //prepare a "destroy" request
                            grid_options_keys.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                            options_keys = options_keys.filter(function (obj) { return obj.key !== formData.key; });
                            $('input[name="options_keys"]').val(JSON.stringify(options_keys.sort((a, b) => parseInt(a.key) - parseInt(b.key))));
                            windowConfirm.close();
                        });
                    } else {
                        var grid_options_keys = $("#grid_options_keys").data("kendoGrid");
                        grid_options_keys.dataSource.remove(formData)  //prepare a "destroy" request
                        grid_options_keys.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                        options_keys = options_keys.filter(function (obj) { return obj.key !== formData.key; });
                        $('input[name="options_keys"]').val(JSON.stringify(options_keys.sort((a, b) => parseInt(a.key) - parseInt(b.key))));
                    }
                }
            }],
            width: "80px"
        }]
    });

    $('#add_options_keys').on('click', function () {
        let _key = $("#options_keys").val(),
            _destination = $("#options_keys_destination").val(),
            _destination_text = '',
            _details = $("#options_keys_details").val(),
            _details_text = $("#options_keys_details").select2().find(":selected").data('text'),
            _useraction = $("#options_keys_useraction").val(),
            searchKey = $("#grid_options_keys").data("kendoGrid").dataSource.data().some(
                function (dataItem) {
                    return dataItem.key == _key;
                });
        if (searchKey) {
            Swal.fire({
                title: "Error!",
                text: "This key already exist",
                type: "error",
                confirmButtonClass: 'btn btn-warning',
                buttonsStyling: false
            });
            return;
        }
        if (_key != "" && !searchKey) {
            var grid_options_keys = $("#grid_options_keys").data("kendoGrid");
            if (_destination == null) _destination_text = "IVR Menu";
            else {
                _destination_text = $("#options_keys_destination").select2('data')[0]["text"];
            }
            if (_destination == null || _details == null) {
                if ($('#name').val() != '') _details_text = $('#name').val();
                else _details_text = "current";
            }
            let item = { key: _key, destination: _destination, destination_text: _destination_text, details: _details, detail_text: _details_text, useraction: _useraction, isset: 0 };
            grid_options_keys.dataSource.add(item);
            grid_options_keys.dataSource.sort({ field: "key", dir: "asc" });
            options_keys.push(item);
            $('input[name="options_keys"]').val(JSON.stringify(options_keys.sort((a, b) => parseInt(a.key) - parseInt(b.key))));
        }
    });

    $("#audio_preview").on("click", function (e) {
        e.preventDefault();
        let filename = $("#audio").val();
        if (filename) {
            let windowPlayRecord = $("#play_record_audio").kendoWindow({
                title: '',
                visible: false, //the window will not appear before its .open method is called
                resizable: false,
                width: "500px",
                close: function () {
                    $(this.element).empty();
                }
            }).data("kendoWindow");
            let windowPlayRecordTemplate = kendo.template($("#play-audio").html());
            let result = windowPlayRecordTemplate({ data: { filename: filename } });
            windowPlayRecord.title(`Preview audio: ${filename}`);
            windowPlayRecord.content(result); //send the row data object to the template and render it
            windowPlayRecord.center().open();
        }
    });

    if (formData != false) {
        $audio.select2("trigger", "select", { data: { id: formData.audio, text: formData.audio } });
        $('#digit_timeout').select2("trigger", "select", { data: { id: formData.digit_timeout, text: formData.digit_timeout + ' sec' } });
        $('#digit_number').select2("trigger", "select", { data: { id: formData.digit_number, text: formData.digit_number } });
        $('#attempts').select2("trigger", "select", { data: { id: formData.attempts, text: formData.attempts } });
        // 
        $.get(base_url + 'settings/ivrs/menu_destination?menu_id=' + formData.id, function (res) {
            $('#after_hours_destination').select2("trigger", "select", { data: { id: res.data.after_hours, text: res.data.after_hours_text } });
            $('#no_sel_destination').select2("trigger", "select", { data: { id: res.data.no_sel, text: res.data.no_sel_text } });
            $('#invalid_sel_destination').select2("trigger", "select", { data: { id: res.data.invalid_sel, text: res.data.invalid_sel_text } });
            //
            changeDestination('after_hours_destination', res.data.after_hours, res.data.after_hours_detail);
            changeDestination('no_sel_destination', res.data.no_sel, res.data.no_sel_detail);
            changeDestination('invalid_sel_destination', res.data.invalid_sel, res.data.invalid_sel_detail);
            $('.select2-search input, :focus,input').prop('focus', false).blur();
        });

        $.get(`${base_url}settings/ivrs/menu_hours?menu_id=${formData.id}`, function (r) {
            r.data.forEach(ele => {
                let _from_time = `${ele.from_hour}:${ele.from_minute} ${ele.from_day} ${ele.from_day_of_month} ${ele.from_month.charAt(0).toUpperCase() + ele.from_month.slice(1)}`,
                    _to_time = `${ele.to_hour}:${ele.to_minute} ${ele.to_day} ${ele.to_day_of_month} ${ele.to_month.charAt(0).toUpperCase() + ele.to_month.slice(1)}`;
                ele.from_time = _from_time;
                ele.to_time = _to_time;
                ele.isset = 1;
                ivrmenu_hours.push(ele);
            });
            $('input[name="time_configs"]').val(JSON.stringify(ivrmenu_hours));
            $("#grid_time_configs").data("kendoGrid").setDataSource(ivrmenu_hours);
        })
        $.get(`${base_url}settings/ivrs/options_keys?menu_id=${formData.id}`, function (r) {
            options_keys = r.data;
            $('input[name="options_keys"]').val(JSON.stringify(options_keys));
            $("#grid_options_keys").data("kendoGrid").setDataSource(options_keys);
        })
    } else {
        $('#digit_timeout').select2("trigger", "select", { data: { id: 5, text: '5 sec' } });
        $('#digit_number').select2("trigger", "select", { data: { id: 1, text: '1' } });
        $('#attempts').select2("trigger", "select", { data: { id: 2, text: 2 } });
    }
    $('.select2-search input, :focus,input').prop('focus', false).blur();

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_ivr").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/ivrs/add" : "settings/ivrs/update");
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
                            let error_message = `<div class="help-block"><ul role="alert"><li>${response.message}</li></ul></div>`;
                            if (response.field) {
                                let formGroup = $("#" + response.field).closest("div.form-group");
                                if (!formGroup.hasClass('error')) {
                                    formGroup.addClass("error");
                                } else {
                                    $("#" + response.field).parent().parent().find(".help-block").remove();
                                }
                                $("#" + response.field).parent().after(error_message);
                                $("#" + response.field).focus();
                            }
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
    $("#add-ivr").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });

    $("#sync_config").on("click", function () {
        $("#sync_config").attr({ "disabled": "disabled" }).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>`);
        let csrf = $('meta[name=csrf]').attr('content').split(":"),
            post = { [csrf[0]]: csrf[1] };
        $.post(base_url + "settings/ivrs/sync_config", post, function (response, status) {
            if (status === "success" && response.status) {
                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
            } else {
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
            $("#sync_config").removeAttr("disabled").html(`<i class="feather icon-save"></i>`);
        });
    });
})();

$(document).ready(function () {
    var windowConfirm = $("#windowConfirm").kendoWindow({
        title: '',
        visible: false, //the window will not appear before its .open method is called
        width: "400px",
        // height: "200px",
    }).data("kendoWindow");

    var grid = $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "settings/ivrs/lists",
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
        columns: [{
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
            field: "name",
            title: controlsKendo.grid.column.title.name
        }, {
            field: "digit_timeout",
            title: controlsKendo.grid.column.title.digit_timeout,
            width: 120,
            filterable: false,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "digit_number",
            title: controlsKendo.grid.column.title.digit_number,
            width: 120,
            filterable: false,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "attempts",
            title: controlsKendo.grid.column.title.attempts,
            width: 120,
            filterable: false,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "cretime",
            title: controlsKendo.grid.column.title.cretime,
            filterable: false,
            width: 180,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
            command: [{
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "edit",
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
                            post = { [csrf[0]]: csrf[1], id: formData.id, name: formData.name, customer_code: formData.customer_code };
                        $.post(base_url + "settings/ivrs/destroy", post, function (response, status) {
                            kendo.ui.progress(grid.element, false);
                            if (status === "success" && response.status) {
                                grid.dataSource.remove(formData)  //prepare a "destroy" request
                                grid.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                                //Bật thông báo
                                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                            } else {
                                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                            }
                        });
                    });
                }
            }],
            title: "&nbsp;",
            width: 120
        }]
    }).data("kendoGrid");
});