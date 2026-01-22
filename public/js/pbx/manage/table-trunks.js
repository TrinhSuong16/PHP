/*=========================================================================================
    File Name: table-trunks.js
    Description: Trunks Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/
pbx.init();

function activeSidebar(formData = false) {
    $(".add-new-data").addClass("show");
    $(".overlay-bg").addClass("show");
    $(".cancel-data-btn, .overlay-bg").on("click", function () {
        $(".add-new-data").removeClass("show")
        $(".overlay-bg").removeClass("show")
    });

    $('input[type="text"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })

    if ($('#authentication_switch').is(":checked")) {
        $('.authentication').css("display", "block");
    } else {
        $('.authentication').css("display", "none");
    }

    $('#authentication_switch').change(function () {
        if (this.checked) {
            $('.authentication').css("display", "block");
        } else {
            $('.authentication').css("display", "none");
        }
    });

    var $customer = $('#customer'),
        $did_number = $('#did_number');
    $customer.select2({
        ajax: {
            url: base_url + 'manage/trunks/customers',
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

    $customer.on('select2:select', function (evt) {
        if (evt) {
            $('#customer_code').val(evt.params.data.text);
            $did_number.empty().select2({
                dropdownAutoWidth: false,
                width: '100%',
                ajax: {
                    url: base_url + 'manage/trunks/didnumbers?customer=' + evt.params.data.id,
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
        }
    });

    if (formData !== false) {
        $customer.select2("trigger", "select", { data: { id: formData.customer_id, text: formData.customer_code } });
        $did_number.select2("trigger", "select", { data: { id: formData.did_number, text: formData.did_number } });
        $('.select2-search input, :focus,input').prop('focus', false).blur();
    }
    /*
    // Read db lấy data customers
    let csrf = $('meta[name=csrf]').attr('content').split(":");
    $.post(base_url + "manage/trunks/getListCustomers", {[csrf[0]]:csrf[1]}, function(response, status) {
        if(status==="success" && response.status==1) {
            let html = '<option>--Select option--</option>';
            response.data.forEach(ele => {
                if(formData == null || formData.customer_id !== ele.id) {
                    html += '<option value="'+ ele.id +'">'+ ele.customer_code +'</option>';
                } else {
                    html += '<option value="'+ ele.id +'" selected>'+ ele.customer_code +'</option>';
                }
            });
            $('#customer').html(html);
        }
    }).complete(function(){
        $('#customer').change();
    });

    // Xử lý lấy danh sách did theo customer
    $('#customer').on('change', function(){
        let customer_id = $(this).val();
        if(customer_id) {
            let csrf = $('meta[name=csrf]').attr('content').split(":"), 
                post_data = {[csrf[0]]:csrf[1], 'customer_id':customer_id},
                customer_code = $(this).find('option:selected').text().trim();
            $('#customer_code').val(customer_code);
            $('#did_number').html('');
            $.post(base_url + 'manage/trunks/getListDIDs', post_data, function(response, status){
                if(status==="success" && response.status) {
                    let html ='<option>--Select option--</option>';
                    response.data.forEach(ele => {
                        if(formData == null || formData.did_number !== ele.inbound_did) {
                            html += '<option value="'+ ele.inbound_did +'">'+ ele.inbound_did +'</option>';
                        } else {
                            html += '<option value="'+ ele.inbound_did +'" selected>'+ ele.inbound_did +'</option>';
                        }
                    });
                    $('#did_number').html(html);
                }
            });
        }
    });
    */
    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frmTrunk").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "manage/trunks/add" : "manage/trunks/update");
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
                        toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
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
    $("#add-trunk").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template({}));
        setTimeout(activeSidebar, 200);
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
                    url: base_url + "manage/trunks/lists",
                    contentType: "application/json",
                    type: "GET"
                },
                parameterMap: function (options, operation) {
                    if (operation == "read") {
                        if (options.filter) {
                            $.each(options.filter.filters, function (key, value) {
                                if (value.field == "trunknumber") {
                                    value.field = "name";
                                    value.value = "trunk_" + value.value;
                                    value.operator = "eq";
                                }
                            });
                        }
                        return options;
                    }
                    // return kendo.stringify(options);
                }
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
            change: function () {
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
                    neq: controlsKendo.grid.filter.operators.neq,// "Is not equal to"
                }
            }
        },
        noRecords: true,
        scrollable: true,
        columns: [{
            field: "no",
            title: controlsKendo.grid.column.title.no,
            width: 70,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            },
            filterable: false
        }, {
            field: "customer_code",
            title: controlsKendo.grid.column.title.customer_code,
            width: 130,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "trunkname",
            title: controlsKendo.grid.column.title.trunkname
        }, {
            field: "trunknumber",
            title: controlsKendo.grid.column.title.trunknumber,
            width: 140,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "host",
            title: controlsKendo.grid.column.title.host,
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
            field: "insecure",
            title: controlsKendo.grid.column.title.insecure,
            width: 90,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            },
            filterable: false
        }, {
            field: "canreinvite",
            title: controlsKendo.grid.column.title.canreinvite,
            width: 100,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            },
            filterable: false
        }, {
            template: function (dataItem) {
                if (dataItem.record_calls == 1) {
                    return `<button class="btn-icon btn btn-primary btn-round btn-sm" type="button" data-toggle="tooltip" data-placement="top" data-original-title="In Use"><i class="feather icon-mic"></i></button>`;
                } else {
                    return `<button class="btn-icon btn rounded-circle btn-sm btn-outline-primary" type="button" data-toggle="tooltip" data-placement="top" data-original-title="Not in use"><i class="feather icon-mic-off"></i></button>`;
                }
            },
            title: controlsKendo.grid.column.title.recordimg,
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
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            },
            command: [
                {
                    // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                    name: "edit",
                    //template: "<a href='javascript:void(0)' class='k-button k-grid-edit'><span class='k-icon k-i-edit'></span>"+controlsKendo.grid.button.edit+"</a>",
                    template: kendo.template($("#gridActionEditTemplate").html()),
                    click(e) {
                        e.preventDefault();
                        var tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        var formData = this.dataItem(tr);
                        var data = { formData: formData }
                        var template = kendo.template($("#addnewTemplate").html());
                        var result = template(data);
                        $("#add-new-data-sidebar").html(result);
                        setTimeout(function () {
                            activeSidebar(formData);
                        }, 200);
                    }
                }, {
                    // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                    name: "delete",
                    //template: "<a href='javascript:void(0)' class='k-button  k-primary k-grid-delete'><span class='k-icon k-i-delete'></span>"+controlsKendo.grid.button.delete+"</a>",
                    template: kendo.template($("#gridActionDeleteTemplate").html()),
                    click(e) {
                        e.preventDefault();
                        var windowConfirmTemplate = kendo.template($("#windowConfirmTemplate").html());
                        let tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        let formData = this.dataItem(tr),
                            data = { formData: formData }
                        let result = windowConfirmTemplate(data);
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
                                post = { [csrf[0]]: csrf[1], id: formData.id, customer_id: formData.customer_id, customer_code: formData.customer_code };
                            $.post(base_url + "manage/trunks/destroy", post, function (response, status) {
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
                }
            ],
            title: "&nbsp;",
            width: 170
        }]
    }).data("kendoGrid");;
});