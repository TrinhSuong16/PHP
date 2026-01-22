/*=========================================================================================
    File Name: shortkey.js
    Description: Shortkey Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

function changeDestination(type, dest = '') {
    if (["pickup", "listen", "whisper", "barge", "DND"].includes(type)) {
        $("#details").html('<input type="hidden" name="details" value="" />');
        $("#details").parent().parent().hide();
    } else {
        $("#details").closest("div.form-group").removeClass("error");
        $("#details").parent().parent().find(".help-block").remove();
        $("#details").parent().parent().show();
        $.ajax({
            url: base_url + "settings/shortkey/destination/" + type,
            type: "GET",
            dataType: 'json',
            success: function (response) {
                if (response.status == 1) {
                    let html = "<select class='form-control' name='details'>";
                    response.data.forEach(function (item) {
                        if (dest !== item.id)
                            html += "<option value='" + item.id + "'>" + item.name + "</option>";
                        else
                            html += "<option value='" + item.id + "' selected>" + item.name + "</option>";
                    });
                    html += "</select>";
                    $("#details").html(html);
                    $('#details>select').select2({
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

function activeSidebar(data = false) {
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

    $('#destination').select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    if (data != false && data.formData.destination !== "off" && data.formData.details !== "phone") {
        changeDestination(data.formData.destination, data.formData.details);
    } else {
        changeDestination("internal");
    }

    $("#destination").on('change', function () {
        let val = $(this).val();
        switch (val) {
            default: changeDestination(val);
        }
    });

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_shortkey").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/shortkey/add" : "settings/shortkey/update");
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
    $("#add-shortkey").on("click", function () {
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
                    url: base_url + "settings/shortkey/lists",
                    contentType: "application/json",
                    type: "GET"
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
            field: "short_key",
            title: controlsKendo.grid.column.title.short_key,
            width: 170,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "destinatype_name",
            title: controlsKendo.grid.column.title.destinatype,
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
            field: "destination_name",
            title: controlsKendo.grid.column.title.destination,
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
            field: "created_date",
            title: controlsKendo.grid.column.title.created_date,
            width: 170,
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
                    setTimeout(async function () {
                        activeSidebar(data);
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
                            post = { [csrf[0]]: csrf[1], id: formData.id, short_key: formData.short_key, customer_code: formData.customer_code };
                        $.post(base_url + "settings/shortkey/destroy", post, function (response, status) {
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
            width: 160
        }]
    }).data("kendoGrid");
});