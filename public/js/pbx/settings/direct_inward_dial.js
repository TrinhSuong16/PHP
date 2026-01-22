/*=========================================================================================
    File Name: table-direct_inward_dial.js
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


function changeDestination(type, dest = '') {
    $("#default_destination_detail").closest("div.form-group").removeClass("error");
    $("#default_destination_detail").parent().parent().find(".help-block").remove();
    $("#default_destination_detail").parent().show();
    $.ajax({
        url: base_url + "settings/direct_inward_dial/destination/" + type,
        type: "GET",
        dataType: 'json',
        success: function (response) {
            if (response.status == 1) {
                let html = "<select class='select2-theme form-control' name='default_destination_detail'>";
                response.data.forEach(function (item) {
                    if (dest !== item.id)
                        html += "<option value='" + item.id + "'>" + item.name + "</option>";
                    else
                        html += "<option value='" + item.id + "' selected>" + item.name + "</option>";
                });
                html += "</select>";
                $("#default_destination_detail").empty().html(html);
                $('select[name="default_destination_detail"]').select2({
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

    $('input[type=checkbox][name=lastcall]').on('change', function () {
        if ($(this).is(':checked')) {
            $(".extend-lastcall").show();
        } else {
            $(".extend-lastcall").hide();
        }
    });

    var $did_number = $('#did_number'),
        $default_destination = $("#default_destination");

    $did_number.select2({
        allowClear: true,
        placeholder: "Select an attribute",
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
                                        <i class="fa fa-fax"></i> ${repo.text}
                                    </div>
                                </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            return `<i class="fa fa-fax"></i>  ${repo.text}`;
        },
        ajax: {
            url: base_url + 'settings/direct_inward_dial/did_numbers',
            dataType: 'json',
            type: "GET",
            delay: 500,
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

    $default_destination.select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    $default_destination.on('select2:select', function (evt) {
        let val = evt.params.data.id;
        console.log(val)
        switch (val) {
            default: changeDestination(val);
        }
    });

    if (formData != false && formData.default_destination !== "off" && formData.default_destination !== "phone") {
        changeDestination(formData.default_destination, formData.default_destination_detail);
    } else {
        changeDestination("internal");
    }

    if (formData != false) {
        $did_number.select2("trigger", "select", { data: { id: formData.did_number, text: formData.did_number } });
        $('.select2-search input, :focus,input').prop('focus', false).blur();
    }

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_did").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/direct_inward_dial/add" : "settings/direct_inward_dial/update");
        // console.log(url);return;
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
                        if (response.field) {
                            $("#" + response.field).closest("div.form-group").addClass("error");
                            $("#" + response.field).focus();
                        }
                        //Bật thông báo
                        toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                        break;
                    default:
                        //Bật thông báo
                        toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                }
            } else {
                //Bật thông báo
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 4000 });
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
    $("#add-direct_inward_dial").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        var result = template(controlsKendo);
        $("#add-new-data-sidebar").html(result);
        setTimeout(activeSidebar, 200);
    });

    $("#sync_config").on("click", function () {
        $("#sync_config").attr({ "disabled": "disabled" }).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>`);
        let csrf = $('meta[name=csrf]').attr('content').split(":"),
            post = { [csrf[0]]: csrf[1] };
        $.post(base_url + "settings/direct_inward_dial/sync_config", post, function (response, status) {
            if (status === "success" && response.status) {
                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
            } else {
                //Bật thông báo
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
                    url: base_url + "settings/direct_inward_dial/lists",
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
            field: "did_number",
            title: controlsKendo.grid.column.title.did_number,
            width: 250
        }, {
            field: "description",
            title: controlsKendo.grid.column.title.description,
            filterable: false
        }, {
            template: function (dataItem) {
                return `${dataItem.destinatype_name}: ${dataItem.destination_name}`;
            },
            title: controlsKendo.grid.column.title.destination,
            width: 250
        }, {
            template: function (dataItem) {
                if (dataItem.record_calls == 1) {
                    return `<button class="btn-icon btn btn-primary btn-round btn-sm" type="button" data-toggle="tooltip" data-placement="top" data-original-title="In Use"><i class="feather icon-mic"></i></button>`;
                } else {
                    return `<button class="btn-icon btn rounded-circle btn-sm btn-outline-primary" type="button" data-toggle="tooltip" data-placement="top" data-original-title="Not in use"><i class="feather icon-mic-off"></i></button>`;
                }
            },
            title: controlsKendo.grid.column.title.cdr_records,
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
            command: [
                {
                    // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                    name: "edit",
                    template: kendo.template($("#gridActionEditTemplate").html()),
                    click(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var tr = $(e.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        var data = this.dataItem(tr);
                        var template = kendo.template($("#addnewTemplate").html());
                        var result = template({ formData: data });
                        $("#add-new-data-sidebar").html(result);
                        // $(this).removeClass("btn-secondary")
                        setTimeout(function () {
                            activeSidebar(data);
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
                        var data = this.dataItem(tr);
                        var result = windowConfirmTemplate({ formData: data });
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
                                post = { [csrf[0]]: csrf[1], id: data.id, did_number: data.did_number, customer_code: data.customer_code };
                            $.post(base_url + "settings/direct_inward_dial/destroy", post, function (response, status) {
                                kendo.ui.progress(grid.element, false);
                                if (status === "success" && response.status) {
                                    grid.dataSource.remove(data)  //prepare a "destroy" request
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
            ],
            title: "&nbsp;",
            width: 170,
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }]
    }).data("kendoGrid");
});