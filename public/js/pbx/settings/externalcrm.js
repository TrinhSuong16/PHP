/*=========================================================================================
    File Name: externalcrm.js
    Description: External CRM Table
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

// function toggleAll(e) {
//     var view = $("#treelist").data("kendoTreeList").dataSource.view();
//     var checked = e.target.checked;
//     for (var i = 0; i < view.length; i++) {
//         view[i].set("checked", checked);
//     }
// }

function onChange(e) {
    var selectedRows = this.select();
    var selectedDataItems = [];
    for (var i = 0; i < selectedRows.length; i++) {
        var dataItem = this.dataItem(selectedRows[i]);
        selectedDataItems.push({ dest_id: dataItem.dest_id });
    }
    if (selectedDataItems.length) {
        // console.log("Selected data items' extension: " + selectedDataItems.map(e => e.extension).join(", "));
        // let ids = this.selectedKeyNames().join(","); // <- use models
        // let ids = selectedDataItems.map(e => e.id).join(",");
        let dest_lists = selectedDataItems.map(e => e.dest_id).join(",");
        $('#dest_lists').val(dest_lists);
    } else {
        $('#dest_lists').val('');
    }
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

    var $site = $('#site'), $dest_type = $('#dest_type'), $dest_id = $('#dest_id');
    $site.select2({
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
                                    <i class="fa fa-external-link"></i> ${repo.text}
                                </div>
                            </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            return `<i class="fa fa-external-link"></i> ${repo.text}`;
        },
        ajax: {
            url: base_url + 'settings/externalcrm/sites',
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

    $dest_type.select2({
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

    $dest_type.on('select2:select', function (e) {
        $('#dst').show();
        $('#dest_lists').val('');
        if (e.params.data.id == "") {
            $('#dst').hide();
            // $("#treelist").empty();
            $("#grid_multiple_crm").empty();
            return;
        }
        if (formData !== false) {
            // $('#dst #treelist').hide();
            $('#dst #grid_multiple_crm').hide();            
            $('#dst #dest_id').show();
            $dest_id.empty().select2({
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
                                            <i class="fa fa-user-secret"></i> ${repo.text}
                                        </div>
                                    </div>`);
                    return $container;
                },
                templateSelection: function (repo) {
                    return `<i class="fa fa-user-secret"></i> ${repo.text}`;
                },
                ajax: {
                    url: base_url + "settings/externalcrm/destination_details/select?type=" + e.params.data.id + '&curent=' + formData.dest_id,
                    dataType: 'json',
                    type: "GET",
                    delay: 300,
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
                        }
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
        } else {
            // $('#dst #treelist').show();
            $('#dst #grid_multiple_crm').show();
            $('#dst #dest_id').hide();
            /*
            $("#treelist").empty().kendoTreeList({
                dataSource: new kendo.data.TreeListDataSource({
                    transport: {
                        read: {
                            url: base_url + "settings/externalcrm/destination_details?type=" + e.params.data.id,
                            type: "GET"
                        }
                    },
                    schema: {
                        total: 'total',
                        data: 'data'
                    },
                    // page: 1,
                    // pageSize: 10,
                    // serverPaging: true
                }),
                // height: window.outerHeight - 520,
                pageable: {
                    pageSize: 5,
                    pageSizes: true
                },
                columns: [
                    {
                        headerTemplate: "<input type='checkbox' onclick='toggleAll(event)' />",
                        template: "<input type='checkbox' data-bind='checked: checked' />",
                        width: 70
                    },
                    {
                        field: "dest_id",
                        title: controlsKendo.grid.column.title.dest_id,
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center; font-size: 14px"
                        },
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    }
                ],
                dataBound: function () {
                    var dest_lists = [];
                    var view = this.dataSource.view();
                    this.items().each(function (index, row) {
                        kendo.bind(row, view[index]);
                        if (view[index].checked) {
                            dest_lists.push(view[index].dest_id)
                        }
                    });
                    $('#dest_lists').val(dest_lists.join(","));
                }
            }).data("kendoTreeList"); */

            $('#grid_multiple_crm').empty().kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: base_url + "settings/externalcrm/destination_details?type=" + e.params.data.id,
                            contentType: "application/json",
                            type: "GET"
                        },
                        parameterMap: function (options, operation) {
                            if (operation == "read" && options) {
                                if (options.filter) {
                                    $.each(options.filter.filters, function (key, value) {
                                        if(value.field == "dest_id") {
                                            if(e.params.data.id=="queue") {
                                                value.field = "name";
                                            } else {
                                                value.field = "extension";
                                            }                                            
                                            options.filter.filters[key] = value;
                                        }
                                    });
                                }
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
                    buttonCount: 5,
                    change: function(e){
                        $('#dest_lists').val('');
                    }
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
                    field: "dest_id",
                    title: controlsKendo.grid.column.title.dest_id,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center; font-size: 14px"
                    },
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                }]
            }).data("kendoGrid");
        }
    });
    if (formData !== false) {
        $site.select2("trigger", "select", { data: { id: formData.site_id, text: formData.callback_url } });
        $dest_type.select2("trigger", "select", { data: { id: formData.dest_type, text: formData.dest_type[0].toUpperCase() + formData.dest_type.slice(1) } });
        $dest_id.select2("trigger", "select", { data: { id: formData.dest_id, text: formData.dest_id } });
        $('.select2-search input, :focus,input').prop('focus', false).blur();
    }

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_externalcrm").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/externalcrm/add" : "settings/externalcrm/update");
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
                        let error_field = response.field,
                            error_message = '<div class="help-block"><ul role="alert"><li>' + response.message + '</li></ul></div>';
                        if (error_field) {
                            $("#" + ele).closest("div.form-group").addClass("error");
                            $("#" + ele).parent().after(error_message);
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
    $("#add-externalcrm").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });

    $("#sync_config").on("click", function () {
        $("#sync_config").attr({ "disabled": "disabled" }).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>`);
        let csrf = $('meta[name=csrf]').attr('content').split(":"),
            post = { [csrf[0]]: csrf[1] };
        $.post(base_url + "settings/externalcrm/sync_config", post, function (response, status) {
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
                    url: base_url + "settings/externalcrm/lists",
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
                    neq: controlsKendo.grid.filter.operators.neq// "Is not equal to"
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
            field: "name",
            title: controlsKendo.grid.column.title.name,
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
            field: "dest_id",
            title: controlsKendo.grid.column.title.dest_id,
            width: 180,
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
            title: controlsKendo.grid.column.title.callback_url,
            filterable: false,
            template: function (dataItem) {
                return dataItem.method + dataItem.callback_url;
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
            field: "dest_type",
            title: controlsKendo.grid.column.title.dest_type,
            width: 160,
            template: function (dataItem) {
                return `<div class="chip chip-primary">
                            <div class="chip-body">
                                <div class="avatar">
                                    <i class="fa ${dataItem.dest_type == "extension" ? 'fa-etsy' : 'fa-quora'}"></i>
                                </div>
                                <span class="chip-text" style="min-width:50px">${dataItem.dest_type[0].toUpperCase() + dataItem.dest_type.slice(1)}</span>
                            </div>
                        </div>`;
            },
            filterable: {
                cell: {
                    showOperators: false,
                    template: function (args) {
                        args.element.kendoDropDownList({
                            dataSource: [
                                { id: "extension", text: controlsKendo.grid.filter.value.dest_type_extension },
                                { id: "queue", text: controlsKendo.grid.filter.value.dest_type_queue }
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
                                post = { [csrf[0]]: csrf[1], id: data.id, dest_id: data.dest_id };
                            $.post(base_url + "settings/externalcrm/destroy", post, function (response, status) {
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