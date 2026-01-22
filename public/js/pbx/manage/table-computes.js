/*=========================================================================================
    File Name: table-computes.js
    Description: Nodes Table
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
    $(".add-new-data").addClass("show");
    $(".overlay-bg").addClass("show");
    $(".cancel-data-btn, .overlay-bg").on("click", function () {
        $(".add-new-data").removeClass("show")
        $(".overlay-bg").removeClass("show")
        $("#add-new-data-sidebar").html("");
    });
    var $idnode = $('#idnode'),
        $type = $('#type');
    $idnode.select2({
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
                                        <i class="fa fa-linode"></i> [${repo.id}] ${repo.text}
                                    </div>
                                </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            return `<i class="fa fa-linode"></i> [${repo.id}] ${repo.text}`;
        },
        ajax: {
            url: base_url + 'manage/computes/nodes',
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

    $type.select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity,
        templateResult: function iconFormat(icon) {
            // var originalOption = icon.element;
            if (!icon.id) { return icon.text; }
            return "<i class='" + $(icon.element).data('icon') + "'></i>" + icon.text;
        },
        templateSelection: function iconFormat(icon) {
            // var originalOption = icon.element;
            if (!icon.id) { return icon.text; }
            return "<i class='" + $(icon.element).data('icon') + "'></i>" + icon.text;
        },
        escapeMarkup: function (es) { return es; }
    });

    $type.on('select2:select', function (evt) {
        if (evt) {
            switch (evt.params.data.id) {
                case "SIP":
                    $('#frm_compute .data-field-col.group-sip').show();
                    $('#frm_compute .data-field-col.group-db').not('.group-sip').hide();
                    break;
                case "AGI":
                    $('#frm_compute .data-field-col.group-sip').hide();
                    $('#frm_compute .data-field-col.group-db').hide();
                    break;
                case "DB":
                case "BILL":
                    $('#frm_compute .data-field-col.group-db').show();
                    $('#frm_compute .data-field-col.group-sip').not('.group-db').hide();
                    break;
            }
        }
    });

    if (formData !== false) {
        $idnode.select2("trigger", "select", { data: { id: formData.idnode, text: formData.namenode } });
        $type.select2("trigger", "select", { data: { id: formData.type, text: formData.type } });
    } else {
        $type.select2("trigger", "select", { data: { id: "SIP", text: "SIP" } });
    }
    $('.select2-search input, :focus,input').prop('focus', false).blur();

    $('input[type="text"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_compute").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "manage/computes/add" : "manage/computes/update");
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
                            let formGroup = $("#" + error_field).closest("div.form-group");
                            if (!formGroup.hasClass('error')) {
                                formGroup.addClass("error");
                            } else {
                                $("#" + error_field).parent().parent().find(".help-block").remove();
                            }
                            $("#" + error_field).parent().after(error_message);
                            $("#" + error_field).focus();
                        }
                    default:
                        toastr.warning(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
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
    $("#add-compute").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });
})();

$(document).ready(function () {
    var windowConfirm = $("#windowConfirm").kendoWindow({
        title: '',
        visible: false, //the window will not appear before its .open method is called
        width: "400px"
    }).data("kendoWindow");

    var grid = $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "manage/computes/lists",
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
            change: function (e) {
                idx = this.skip() + 1;
                $.each(this.data(), (k, output) => {
                    output.no = idx;
                    idx++;
                })
            }
        },
        dataBound: function (e) {
            // console.log("dataBound");
        },
        dataBinding: function (e) {
        },
        sortable: false,
        pageable: {
            refresh: true,
            numeric: true,
            pageSizes: [5, 10, 20, 50],
            buttonCount: 5
        },
        filterable: false,
        noRecords: true,
        scrollable: true,
        columns: [{
            field: "no",
            title: controlsKendo.grid.column.title.no,
            width: 70,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "namenode",
            title: controlsKendo.grid.column.title.namenode
        }, {
            field: "type",
            title: controlsKendo.grid.column.title.type,
            width: 200,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "ip",
            title: controlsKendo.grid.column.title.ip,
            width: 250,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "description",
            title: controlsKendo.grid.column.title.description,
            width: 300,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
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
                            post = { [csrf[0]]: csrf[1], id: formData.id, type: formData.type, filename: formData.configfilename };
                        $.post(base_url + "manage/computes/destroy", post, function (response, status) {
                            kendo.ui.progress(grid.element, false);
                            if (status === "success") {
                                if (response.status == 1) {
                                    grid.dataSource.remove(formData)  //prepare a "destroy" request
                                    grid.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                                    //Bật thông báo
                                    toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                                } else if (response.status == -1) {
                                    toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                                }
                            } else {
                                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 4000 });
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