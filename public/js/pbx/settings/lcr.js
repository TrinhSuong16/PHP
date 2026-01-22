/*=========================================================================================
    File Name: lcr.js
    Description: LCR Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

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
    });

    var $lcrgroup = $('#lcrgroup'),
        $trunk_id = $('#trunk_id');

    $lcrgroup.select2({
        allowClear: true,
        dropdownAutoWidth: false,
        placeholder: "",
        width: '100%',
        ajax: {
            url: base_url + 'settings/lcr/lcr_groups',
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

    $lcrgroup.on('select2:select', function (evt) {
        if (evt) {
            $(evt.target).closest("div.form-group").removeClass("error");
            $(evt.target).parent().parent().find(".help-block").remove();
        }
    });

    $trunk_id.select2({
        allowClear: true,
        dropdownAutoWidth: false,
        placeholder: "",
        width: '100%',
        ajax: {
            url: base_url + 'settings/lcr/trunks',
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

    $trunk_id.on('select2:select', function (evt) {
        if (evt) {
            $(evt.target).closest("div.form-group").removeClass("error");
            $(evt.target).parent().parent().find(".help-block").remove();
        }
    });

    if (formData != false) {
        $lcrgroup.select2("trigger", "select", { data: { id: formData.lcrgroup, text: formData.lcrname } });
        $trunk_id.select2("trigger", "select", { data: { id: formData.trunk_id, text: formData.trunkname } });
        $('.select2-search input, :focus,input').prop('focus', false).blur();
    }

    $('#route_to_prefix').on('change', function () {
        if (this.checked) {
            $('#asterisk-prefix').show();
            $('#prefix').prop('disabled', false);
        } else {
            $('#asterisk-prefix').hide();
            $('#prefix').prop('disabled', true);
            $('#prefix').closest("div.form-group").removeClass("error");
            $('#prefix').parent().parent().find(".help-block").remove();
        }
    });

    $('#prefix').on('keypress', function (event) {
        var regex = new RegExp("^[a-zA-Z]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

    $('#route_to_carrier').on('change', function () {
        if (this.checked) {
            $('input:checkbox[name^="carrier"]').prop('disabled', false);
        } else {
            $('input:checkbox[name^="carrier"]').prop('disabled', true);
        }
    });

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_lcr").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/lcr/add" : "settings/lcr/update");
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
                            let error_message = `<div class="help-block"><ul role="alert"><li>${response.message}</li></ul></div>`;
                            if (response.field) {
                                let formGroup = $("#" + response.field).closest("div.form-group");
                                if (!formGroup.hasClass('error')) {
                                    formGroup.addClass("error");
                                } else {
                                    $("#" + response.field).parent().parent().find(".help-block").remove();
                                }
                                if ($.inArray(response.field, ["cfrom", "cto", "add_suffix"]) < 0) {
                                    $("#" + response.field).parent().after(error_message);
                                }
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

function showConfigLCRGroups() {
    var windowLCRGroups = $("#windowLCRGroups").kendoWindow({
        title: "LCR Groups",
        visible: false, //the window will not appear before its .open method is called
        width: (window.innerWidth - 50) + "px",
        height: (window.outerHeight - 260) + "px",
        close: function (e) {
            $('#grid_lcrgroups').empty();
        }
    }).data("kendoWindow");

    var grid_lcrgroups = $("#grid_lcrgroups").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: base_url + "settings/lcr_groups/lists",
                    contentType: "application/json",
                    type: "GET"
                },
                create: {
                    url: base_url + "settings/lcr_groups/add",
                    type: "POST",
                    complete: function (e) {
                        let response = e.responseJSON;
                        if (response.status == 1) {
                            toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                        } else {
                            toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2500 });
                        }
                        $("#grid_lcrgroups").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: base_url + "settings/lcr_groups/update",
                    type: "POST",
                    complete: function (e) {
                        let response = e.responseJSON;
                        if (response.status == 1) {
                            toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                        } else {
                            toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2500 });
                        }
                        $("#grid_lcrgroups").data("kendoGrid").dataSource.read();
                    }
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options) {
                        let csrf = $('meta[name=csrf]').attr('content').split(":");
                        options[[csrf[0]]] = csrf[1];
                    }
                    return options;
                }
            },
            schema: {
                data: "data",
                total: "total",
                model: {
                    id: "id",
                    fields: {
                        name: { editable: true, validation: { required: true } },
                        description: { editable: true, defaultValue: "", validation: { required: false } }
                    }
                }
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
        edit: function (e) {
            e.container.find(".k-edit-label:last").hide();
            e.container.find(".k-edit-field:last").hide();
        },
        height: window.outerHeight - 310,
        sortable: false,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        filterable: false,
        noRecords: true,
        scrollable: true,
        toolbar: ["create"],
        editable: "popup",
        columns: [
            {
                field: "name",
                title: controlsKendo.grid.column.title.lcrname,
                width: 250,
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center; font-size: 14px"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center;"
                }
            }, {
                field: "description",
                title: controlsKendo.grid.column.title.description,
                headerAttributes: {
                    "class": "table-header-cell",
                    style: "text-align: center; font-size: 14px"
                },
                attributes: {
                    "class": "table-cell",
                    style: "text-align: center;"
                }
            }, {
                field: "create_time",
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
                    "class": "table-cell",
                    style: "text-align: center;"
                },
                command: [{
                    // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                    name: "edit",
                    template: kendo.template($("#gridActionEditTemplate").html())
                }, {
                    name: "delete-group",
                    template: kendo.template($("#gridActionDeleteGroupTemplate").html()),
                    click(e) {
                        e.preventDefault();
                        var windowConfirmTemplate = kendo.template($("#windowConfirmGroupsTemplate").html());
                        var tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        let formData = this.dataItem(tr),
                            data = { formData: formData }

                        var result = windowConfirmTemplate(data);
                        var windowConfirm = $("#windowConfirm").kendoWindow({
                            title: '',
                            visible: false, //the window will not appear before its .open method is called
                            width: "400px",
                            // height: "200px",
                        }).data("kendoWindow");
                        windowConfirm.title($("#windowConfirmGroupsTemplate").attr("title"));
                        windowConfirm.content(result); //send the row data object to the template and render it
                        windowConfirm.center().open();

                        //Xử lý button hủy bỏ xóa
                        $(".k-button-no").click(function () {
                            windowConfirm.close();
                        })

                        //Xử lý button xác nhận xóa
                        $(".k-button-yes").click(function () {
                            windowConfirm.close();
                            kendo.ui.progress($("#grid_lcrgroups").data("kendoGrid").element, true);
                            let csrf = $('meta[name=csrf]').attr('content').split(":"),
                                post = { [csrf[0]]: csrf[1], id: formData.id, name: formData.name, customer_code: formData.customer_code };
                            $.post(base_url + "settings/lcr_groups/destroy", post, function (response, status) {
                                kendo.ui.progress($("#grid_lcrgroups").data("kendoGrid").element, false);
                                if (status === "success" && response.status) {
                                    $("#grid_lcrgroups").data("kendoGrid").dataSource.read();
                                    //Bật thông báo
                                    toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                                } else {
                                    //Bật thông báo
                                    toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                                }
                            });
                        });
                    }
                }],
                title: "&nbsp;",
                width: 120
            }
        ]
    }).data("kendoGrid");

    windowLCRGroups.one("activate", function () {
        grid_lcrgroups.resize();
    });
    windowLCRGroups.center().open();
}

//Open sidebar 
(function () {
    $("#add-lcr").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });

    $("#show-lcrgroup").on("click", function (e) {
        e.preventDefault();
        showConfigLCRGroups();
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
                    url: base_url + "settings/lcr/lists",
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
            field: "lcrname",
            title: controlsKendo.grid.column.title.lcrname,
            filterable: false,
            width: 120,
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
            title: controlsKendo.grid.column.title.name,
            width: 150,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "prefix",
            title: controlsKendo.grid.column.title.prefix,
            width: 120,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "carrier",
            title: controlsKendo.grid.column.title.carrier,
            filterable: false,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            },
            template: function (dataItem) {
                let html = '';
                if (dataItem.carrier != null && dataItem.carrier != "") {
                    let carriers = JSON.parse(dataItem.carrier);
                    carriers.forEach(function (item) {
                        html += `<div class="badge badge-primary mr-1 mb-1"><span>${item}</span></div>`;
                    });
                }
                return html;
            }
        }, /*{
            field: "cfrom",
            title: controlsKendo.grid.column.title.prefix_from,
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
            field: "cto",
            title: controlsKendo.grid.column.title.prefix_to,
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
        },*/{
            title: controlsKendo.grid.column.title.auto_rewrite_destination,
            filterable: false,
            width: 180,
            template: function (dataItem) {
                if(dataItem.cfrom && dataItem.cto) {
                    return `${dataItem.cfrom} <i class="feather icon-arrow-right"></i> ${dataItem.cto}`;
                }
                return '';
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
            field: "trunkname",
            title: controlsKendo.grid.column.title.trunk_name,
            filterable: false,
            width: 150,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "status",
            title: controlsKendo.grid.column.title.status,
            width: 125,
            template: function (dataItem) {
                if (dataItem.status == "enable") {
                    return `<button class="btn-icon btn btn-primary btn-round btn-sm" type="button" data-toggle="tooltip" data-placement="top" data-original-title="In Use"><i class="feather icon-check-circle"></i></button>`;
                } else {
                    return `<button class="btn-icon btn rounded-circle btn-sm btn-outline-primary" type="button" data-toggle="tooltip" data-placement="top" data-original-title="Not in use"><i class="feather icon-x-circle"></i></button>`;
                }
            },
            filterable: {
                cell: {
                    showOperators: false,
                    template: function (args) {
                        args.element.kendoDropDownList({
                            dataSource: [
                                { id: "enable", text: controlsKendo.grid.filter.value.enable },
                                { id: "disable", text: controlsKendo.grid.filter.value.disable }
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
                    let tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    let formData = this.dataItem(tr);
                    const replacer = (key, value) => String(value) === "null" || String(value) === "undefined" ? "" : value;
                    formData = JSON.parse(JSON.stringify(formData, replacer));
                    let data = { formData: formData };
                    let template = kendo.template($("#addnewTemplate").html());
                    let result = template(data);
                    $("#add-new-data-sidebar").html(result);
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
                        $.post(base_url + "settings/lcr/destroy", post, function (response, status) {
                            kendo.ui.progress(grid.element, false);
                            if (status === "success" && response.status) {
                                grid.dataSource.remove(formData)  //prepare a "destroy" request
                                grid.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                                //Bật thông báo
                                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                            } else {
                                //Bật thông báo
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