/*=========================================================================================
    File Name: table-didnumber.js
    Description: DID Number Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/
pbx.init();

(function (window, document, $) {
    'use strict';

    // Input, Select, Textarea validations except submit button
    $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();

})(window, document, jQuery);

function activeSidebar(formData = false) {
    document.body.style.overflow = 'hidden';
    $(".add-new-data").addClass("show");
    $(".overlay-bg").addClass("show");
    $(".cancel-data-btn, .overlay-bg").on("click", function () {
        $(".add-new-data").removeClass("show")
        $(".overlay-bg").removeClass("show")
        $("#add-new-data-sidebar").html("");
        document.body.style.overflow = 'visible';
    });

    $('input[type="text"],input[type="password"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    });

    var $customer = $('#customer'),
        $usergroup = $("#usergroup");

    $customer.select2({
        ajax: {
            url: base_url + 'manage/user/customers',
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

    $usergroup.select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    $customer.on('select2:select', function (evt) {
        if (evt) {
            $usergroup.empty().select2({
                dropdownAutoWidth: true,
                width: '100%',
                placeholder: "",
                ajax: {
                    url: base_url + 'manage/user/usergroups?code=' + evt.params.data.id,
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
        }
    });

    if (formData !== false) {
        $usergroup.empty().select2({
            dropdownAutoWidth: true,
            width: '100%',
            placeholder: "",
            ajax: {
                url: base_url + 'manage/user/usergroups?code=' + formData.customer_id,
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
        if (formData.ongroup != "" && formData.ongroup != null) {
            $.get(base_url + 'manage/user/usergroups?code=' + formData.customer_id + "&ongroup=" + formData.ongroup, function (res) {
                if (res.total) {
                    res.data.forEach(function (val, idx) {
                        $usergroup.select2("trigger", "select", { data: { id: val.id, text: val.text } });
                    })
                }
            });
        }
    }

    // Xử lý lấy danh sách did theo customer
    $('#customer').on('change', function () {
        let customer_id = $(this).val();
        if (customer_id != "") {
            let customer_code = $(this).find('option:selected').text().trim();
            $('#customer_code').val(customer_code);
        }
    });

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_user").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "manage/user/add" : "manage/user/update");
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
    $("#add-user").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
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
                    url: base_url + "manage/user/lists",
                    contentType: "application/json",
                    type: "GET"
                },
                parameterMap: function (options, operation) {
                    if (operation === "read") {
                        return options;
                    }
                    return kendo.stringify(options);
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
            field: "username",
            title: controlsKendo.grid.column.title.username
        }, {
            field: "phone",
            title: controlsKendo.grid.column.title.phone,
            filterable: false,
            width: 150
        }, {
            field: "description",
            title: controlsKendo.grid.column.title.description,
            filterable: false
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
                        e.stopPropagation();
                        var tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        var formData = this.dataItem(tr);
                        if (formData.permission != "") {
                            if (formData.permission.constructor !== ({}).constructor) {
                                formData.permission = JSON.parse(formData.permission);
                            }
                        } else {
                            formData.permission = null;
                        }
                        var data = { formData: formData };
                        var template = kendo.template($("#addnewTemplate").html());
                        var result = template(data);

                        $("#add-new-data-sidebar").html(result);
                        // $(this).removeClass("btn-secondary")
                        setTimeout(function () {
                            activeSidebar(formData);
                        }, 250);
                    }
                }, {
                    // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                    name: "delete",
                    //template: "<a href='javascript:void(0)' class='k-button k-primary k-grid-delete'><span class='k-icon k-i-delete'></span>"+controlsKendo.grid.button.delete+"</a>",
                    template: kendo.template($("#gridActionDeleteTemplate").html()),
                    click(e) {
                        e.preventDefault();
                        let windowConfirmTemplate = kendo.template($("#windowConfirmTemplate").html());
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
                                post = { [csrf[0]]: csrf[1], id: formData.id, username: formData.username };
                            $.post(base_url + "manage/user/destroy", post, function (response, status) {
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
    }).data("kendoGrid");
});