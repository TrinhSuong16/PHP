/*=========================================================================================
    File Name: outboundgroup.js
    Description: Outbound Group Table
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

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_outboundgroup").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/outboundgroup/add" : "settings/outboundgroup/update");
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
    $("#add-outboundgroup").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });
})();


function showDetails(e) {
    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    var windowOutbountPrefix = $("#windowOutboundPrefix").kendoWindow({
        title: '',
        visible: false, //the window will not appear before its .open method is called
        width: (window.innerWidth - 50) + "px",
        height: (window.outerHeight - 260) + "px",
        close: function (e) {
            $('#grid_prefixs').empty();
        }
    }).data("kendoWindow");

    var grid_prefixs = $("#grid_prefixs").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "settings/outboundprefix/lists?group=" + dataItem.id,
                    contentType: "application/json",
                    type: "GET"
                },
                create: {
                    url: base_url + "settings/outboundprefix/add/" + dataItem.id,
                    type: "POST",
                    complete: function (e) {
                        let response = e.responseJSON;
                        if (response.status == 1) {
                            toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                        } else {
                            toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        }
                        $("#grid_prefixs").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: base_url + "settings/outboundprefix/update/" + dataItem.id,
                    type: "POST",
                    complete: function (e) {
                        let response = e.responseJSON;
                        if (response.status == 1) {
                            toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                        } else {
                            toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        }
                        $("#grid_prefixs").data("kendoGrid").dataSource.read();
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
                        prefix: { editable: true, defaultValue: "", nullable: true, type: "number", validation: { required: true } },
                        name: { editable: true, defaultValue: "", validation: { required: true } },
                        status: { editable: true, defaultValue: "allow", validation: { required: true } },
                        date: { editable: false, nullable: true }
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
                field: "prefix",
                format: "{0:0}",
                title: controlsKendo.grid.column.title.outboundprefix_prefix,
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
                field: "name",
                title: controlsKendo.grid.column.title.outboundprefix_name,
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
                title: controlsKendo.grid.column.title.outboundprefix_status,
                width: 180,
                editor: function (container) {
                    var input = $('<input name="status" id="status"/>');
                    input.appendTo(container);
                    input.kendoDropDownList({
                        dataTextField: "name",
                        dataValueField: "id",
                        dataSource: [
                            { id: "allow", name: "Allow" },
                            { id: "denied", name: "Denied" }
                        ],
                    }).appendTo(container);
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
                field: "date",
                title: controlsKendo.grid.column.title.create_time,
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
                    name: "delete-prefix",
                    template: kendo.template($("#gridActionDeletePrefixTemplate").html()),
                    click(event) {
                        event.preventDefault();
                        var windowConfirmTemplate = kendo.template($("#windowConfirmPrefixTemplate").html());
                        var tr = $(event.target).closest("tr"); // get the current table row (tr)
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
                        windowConfirm.title($("#windowConfirmPrefixTemplate").attr("title"));
                        windowConfirm.content(result); //send the row data object to the template and render it
                        windowConfirm.center().open();

                        //Xử lý button hủy bỏ xóa
                        $(".k-button-no").click(function () {
                            windowConfirm.close();
                        })

                        //Xử lý button xác nhận xóa
                        $(".k-button-yes").click(function () {
                            windowConfirm.close();
                            kendo.ui.progress($("#grid_prefixs").data("kendoGrid").element, true);
                            let csrf = $('meta[name=csrf]').attr('content').split(":"),
                                post = { [csrf[0]]: csrf[1], id: formData.id, name: formData.name, prefix: formData.prefix, customer_code: formData.customer_code };
                            $.post(base_url + "settings/outboundprefix/destroy/" + dataItem.id, post, function (response, status) {
                                kendo.ui.progress($("#grid_prefixs").data("kendoGrid").element, false);
                                if (status === "success" && response.status == 1) {
                                    $("#grid_prefixs").data("kendoGrid").dataSource.read();
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
                width: 120
            }
        ]
    }).data("kendoGrid");

    windowOutbountPrefix.title(`Outbound prefix: ${dataItem.name}`);
    windowOutbountPrefix.one("activate", function () {
        grid_prefixs.resize();
    });
    windowOutbountPrefix.center().open();
}

$(document).ready(function () {
    var grid = $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "settings/outboundgroup/lists",
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
            title: controlsKendo.grid.column.title.outboundgroup_name,
            width: 250,
            headerAttributes: {
                "class": "table-header-cell",
                style: "font-size: 14px"
            },
            attributes: {
                "class": "table-cell"
            }
        }, {
            field: "description",
            title: controlsKendo.grid.column.title.outboundgroup_description
        }, {
            field: "create_time",
            title: controlsKendo.grid.column.title.create_time,
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
                name: "agents",
                template: kendo.template($("#gridActionPrefixTemplate").html()),
                click: showDetails
            }, {
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
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    let formData = this.dataItem(tr),
                        data = { formData: formData }
                    if (formData.creby === "system") {
                        //Bật thông báo
                        toastr.error(controlsKendo.grid.alert.before_delete, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 4000 });
                    } else {
                        var windowConfirmTemplate = kendo.template($("#windowConfirmTemplate").html());
                        var result = windowConfirmTemplate(data);
                        var windowConfirm = $("#windowConfirm").kendoWindow({
                            title: '',
                            visible: false, //the window will not appear before its .open method is called
                            width: "400px",
                            // height: "200px",
                        }).data("kendoWindow");
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
                            $.post(base_url + "settings/outboundgroup/destroy", post, function (response, status) {
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
                }
            }],
            title: "&nbsp;",
            width: 160
        }]
    }).data("kendoGrid");
});