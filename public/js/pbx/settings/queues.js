/*=========================================================================================
    File Name: queues.js
    Description: Queues Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

// $("#export").click(function () {
//     $("#grid").data("kendoGrid").saveAsExcel();
// });

function changeDestination(type, dest = '') {
    if (type == "hangup") {
        $("#destination").html('<input type="hidden" name="destination" value="0" />');
        $("#destination").parent().hide();
    } else {
        $("#destination").parent().show();
        $.ajax({
            url: base_url + "settings/queues/destination/" + type,
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

    $('input[type=radio][name=answer]').on('change', function () {
        if ($(this).val() == "1") {
            $("#answeroption").show();
        } else {
            $("#answeroption").hide();
        }
    });
    var $strategy = $('#strategy'),
        $periodic_announce = $('#periodic_announce'),
        $destinatype = $("#destinatype");
    $strategy.select2({
        dropdownAutoWidth: true,
        width: '100%'
    });

    $periodic_announce.select2({
        allowClear: true,
        placeholder: "Select an attribute",
        dropdownAutoWidth: false,
        width: '100%',
        ajax: {
            url: base_url + 'settings/queues/audio',
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

    $destinatype.select2({
        dropdownAutoWidth: true,
        width: '100%'
    });

    $destinatype.on('select2:select', function (evt) {
        if (evt) {
            let val = evt.params.data.id;
            switch (val) {
                default: changeDestination(val);
            }
        }
    });
    if (formData != false) {
        $strategy.select2("trigger", "select", { data: { id: formData.strategy, text: formData.strategy[0].toUpperCase() + formData.strategy.slice(1) } });
        $periodic_announce.select2("trigger", "select", { data: { id: formData.periodic_announce, text: formData.periodic_announce } });
        // $destinatype.select2("trigger", "select", { data: { id: formData.destinatype, text: formData.destinatype } });
        $('.select2-search input, :focus,input').prop('focus', false).blur();
    }
    if (formData != false && formData.destinatype !== "off" && formData.destinatype !== "phone") {
        changeDestination(formData.destinatype, formData.destination);
    } else {
        changeDestination("hangup");
    }

    // $("#destinatype").on('change', function () {
    //     let val = $(this).val();
    //     switch (val) {
    //         default: changeDestination(val);
    //     }
    // });

    $('input[type="text"], input[type="number"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })

    $("#frmSubmit").on("click", function () {
        let btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_queue").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/queues/add" : "settings/queues/update");
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
    $("#add-queue").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });

    $("#sync_config").click(function () {
        $("#sync_config").attr({ "disabled": "disabled" }).html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>`);
        let csrf = $('meta[name=csrf]').attr('content').split(":"),
            post = { [csrf[0]]: csrf[1] };
        $.post(base_url + "settings/queues/sync_config", post, function (response, status) {
            if (status === "success" && response.status) {
                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
            } else {
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
            $("#sync_config").removeAttr("disabled").html(`<i class="feather icon-save"></i>`);
        });
    });
})();


function showDetails(e) {
    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    var windowMembers = $("#windowMembers").kendoWindow({
        title: '',
        visible: false, //the window will not appear before its .open method is called
        width: (window.innerWidth - 700) + "px",
        height: (window.outerHeight - 200) + "px",
        close: function (e) {
            $('#grid_agents').empty();
        }
    }).data("kendoWindow");

    var dropdownValues = [
        { text: "Active", value: "1" },
        { text: "Inactive", value: "0" },
        { text: "Processing", value: "2" }]

    var statusName = function (docId) {
        for (var i = 0; i < dropdownValues.length; i++) {
            if (dropdownValues[i].value == docId) {
                return dropdownValues[i].text;
            }
        }
    }

    var grid_agents = $("#grid_agents").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "settings/queues/members/" + dataItem.name,
                    contentType: "application/json",
                    type: "GET"
                },
                create: {
                    url: base_url + "settings/queues/add_members/" + dataItem.name,
                    type: "POST",
                    complete: function (e) {
                        if (e.responseJSON != null) {
                            if (e.responseJSON.status == 1) {
                                toastr.success(e.responseJSON.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                            } else {
                                toastr.error(e.responseJSON.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                            }
                        } else {
                            toastr.error(e.statusText, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                        }
                        $("#grid_agents").data("kendoGrid").dataSource.read();
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
                        name: { editable: false, defaultValue: dataItem.name },
                        agent: { editable: true },
                        customer_code: { defaultValue: dataItem.customer_code }
                    }
                }
            },
            page: 1,
            pageSize: 2000,
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
        height: window.outerHeight - 250,
        sortable: false,
        // pageable: {
        //     refresh: true,
        //     pageSizes: true,
        //     buttonCount: 5
        // },
        pageable: false,
        filterable: false,
        noRecords: true,
        scrollable: true,
        toolbar: ["create"],
        editable: "popup",
        edit: function (e) {
            var popupWindow = e.container.data("kendoWindow");
            popupWindow.setOptions({ width: "650px" });
            popupWindow.center();
            $(e.container).parent().css({ width: '650px', height: 'auto' });
            $(e.container).children().css({ width: '600px' });
            $('.k-edit-field .k-listbox').css({ width: '190px', height: '260px' });
            $('.k-listbox:first-of-type').css({ 'margin-right': '5px' });
        },
        columns: [
            { field: "name", title: controlsKendo.grid.column.title.queuename },
            {
                field: "agent",
                title: controlsKendo.grid.column.title.member,
                editor: function (container) {
                    // var input = $('<input name="agent" id="agent"/>');
                    // input.appendTo(container);
                    // input.kendoMultiSelect({
                    //     dataTextField: "extension",
                    //     dataValueField: "extension",
                    //     dataSource: {
                    //         serverFiltering: true,
                    //         transport: {
                    //             read: base_url + "settings/queues/agents/" + dataItem.name
                    //         },
                    //         schema: {
                    //             data: "data",
                    //             total: "total"
                    //         }
                    //     }
                    // }).appendTo(container);
                    let agents = [];
                    function onAdd(e) {
                        for (const [key, value] of Object.entries(e.dataItems)) {
                            agents.push({ "extension": value.extension });
                        }
                        grid_agents.editable.options.model.set('agent', agents);
                        $("#lbpager").data('kendoPager').refresh();
                    }

                    function onRemove(e) {
                        for (const [key, value] of Object.entries(e.dataItems)) {
                            agents = jQuery.grep(agents, function (valSub) {
                                return valSub.extension != value.extension;
                            });
                        }
                        grid_agents.editable.options.model.set('agent', agents);
                        $("#lbpager").data('kendoPager').refresh();
                    }

                    $('<input id="searchBox" class="k-textbox" placeholder="' + controlsKendo.window.popup.search + '" />').appendTo(container);
                    $('<select id="optional"/>').appendTo(container);
                    $('<select name="agent" id="agent"/>').appendTo(container);
                    $('<div id="lbpager">').appendTo(container);

                    let dataSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: base_url + "settings/queues/agents/" + dataItem.name,
                                contentType: "application/json",
                                type: "GET"
                            },
                            parameterMap: function (options, operation) {
                                if (operation == "read" && options) {
                                    if (agents.length && !options.filter) {
                                        options.filter = {
                                            filters: [
                                                { field: "extension", operator: "nin", value: agents.map(({ extension }) => extension) }
                                            ],
                                            logic: 'and'
                                        }
                                    }
                                }
                                return options;
                            }
                        },
                        schema: {
                            total: "total",
                            data: "data"
                        },
                        page: 1,
                        pageSize: 9,
                        serverPaging: true,
                        serverFiltering: true
                    });
                    $("#lbpager").kendoPager({
                        dataSource: dataSource
                    });

                    $("#optional").kendoListBox({
                        connectWith: "agent",
                        draggable: true,
                        dropSources: ["agent"],
                        toolbar: {
                            position: "right",
                            tools: ["moveUp", "moveDown", "transferTo", "transferFrom", "transferAllTo", "transferAllFrom", "remove"]
                        },
                        selectable: "multiple",
                        dataSource: dataSource,
                        dataTextField: "extension",
                        dataValueField: "extension"
                    });

                    $("#agent").kendoListBox({
                        connectWith: "optional",
                        draggable: {
                            placeholder: function (element) {
                                return element.clone().css({
                                    "opacity": 0.3,
                                    "border": "1px dashed #000000"
                                });
                            }
                        },
                        dropSources: ["optional"],
                        selectable: "multiple",
                        dataTextField: "extension",
                        dataValueField: "extension",
                        add: onAdd,
                        remove: onRemove
                    });

                    $("#searchBox").on("input", function (e) {
                        var listBox = $("#optional").getKendoListBox();
                        var sarchString = $(this).val();
                        if (sarchString) {
                            var filter = [{ field: "extension", operator: "contains", value: sarchString }];
                            if (agents.length) {
                                filter.push({ field: "extension", operator: "nin", value: agents.map(({ extension }) => extension) });
                            }
                            listBox.dataSource.filter(filter);
                        } else {
                            listBox.dataSource.filter({});
                        }
                    });
                }
            }, {
                command: [{
                    name: "delete-member",
                    //template: "<a href='javascript:void(0)' class='k-button k-primary k-grid-delete k-state-disabled'><span class='k-icon k-i-delete'></span>" + controlsKendo.grid.button.delete + "</a>",
                    template: kendo.template($("#gridActionDeleteMemberTemplate").html()),
                    click(event) {
                        event.preventDefault();
                        var windowConfirmTemplate = kendo.template($("#windowConfirm2Template").html());
                        var tr = $(event.target).closest("tr"); // get the current table row (tr)
                        // get the data bound to the current table row
                        let formData = this.dataItem(tr),
                            data = { formData: formData }
                        // console.log(formData);
                        var result = windowConfirmTemplate(data);
                        var windowConfirm2 = $("#windowConfirm").kendoWindow({
                            title: '',
                            visible: false, //the window will not appear before its .open method is called
                            width: "400px",
                            // height: "200px",
                        }).data("kendoWindow");
                        windowConfirm2.title($("#windowConfirm2Template").attr("title"));
                        windowConfirm2.content(result); //send the row data object to the template and render it
                        windowConfirm2.center().open();

                        //Xử lý button hủy bỏ xóa
                        $(".k-button-no").click(function () {
                            windowConfirm2.close();
                        })

                        //Xử lý button xác nhận xóa
                        $(".k-button-yes").click(function () {
                            windowConfirm2.close();
                            kendo.ui.progress(grid_agents.element, true);
                            let csrf = $('meta[name=csrf]').attr('content').split(":"),
                                post = { [csrf[0]]: csrf[1], id: formData.id, name: formData.name, agent: formData.agent, customer_code: formData.customer_code };
                            $.post(base_url + "settings/queues/destroy_members/" + dataItem.name, post, function (response, status) {
                                kendo.ui.progress(grid_agents.element, false);
                                if (status === "success" && response.status) {
                                    $("#grid_agents").data("kendoGrid").dataSource.read();
                                    $("#grid").data("kendoGrid").dataSource.read();
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
                width: 70
            }
        ]
    }).data("kendoGrid");

    grid_agents.table.kendoSortable({
        filter: ">tbody >tr",
        hint: function (element) { // Customize the hint.
            var table = $('<table style="width: 600px;" class="k-grid k-widget"></table>'), hint;

            table.append(element.clone()); // Append the dragged element.
            table.css("opacity", 0.7);

            return table; // Return the hint element.
        },
        cursor: "move",
        placeholder: function (element) {
            return $('<tr colspan="4" class="placeholder"></tr>');
        },
        change: function (e) {
            kendo.ui.progress(grid_agents.element, true);
            var skip = grid_agents.dataSource.skip(),
                oldIndex = e.oldIndex + skip,
                newIndex = e.newIndex + skip,
                data = grid_agents.dataSource.data(),
                dataItem = grid_agents.dataSource.getByUid(e.item.data("uid"));

            grid_agents.dataSource.remove(dataItem);
            grid_agents.dataSource.insert(newIndex, dataItem);

            let csrf = $('meta[name=csrf]').attr('content').split(":"),
                post = { [csrf[0]]: csrf[1], data: JSON.parse(JSON.stringify(data)) };

            $.ajax({
                url: base_url + "settings/queues/reoder_queuemembers/" + dataItem.name,
                type: "POST",
                data: post,
                dataType: 'json',
                success: function (response) {
                    kendo.ui.progress(grid_agents.element, false);
                    if (response.status == 1) {
                        toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                    } else {
                        toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    });

    windowMembers.title(`Queue members: ${dataItem.name}`);
    windowMembers.one("activate", function () {
        grid_agents.resize();
    });
    windowMembers.center().open();
}

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
                    url: base_url + "settings/queues/lists",
                    contentType: "application/json",
                    type: "GET"
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
            field: "number_of_members",
            title: controlsKendo.grid.column.title.total_members,
            width: 140,
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
            field: "members",
            title: controlsKendo.grid.column.title.detail_members,
            filterable: false,
            template: function (dataItem) {
                let html = '';
                if (dataItem.members) {
                    let members = dataItem.members;
                    members.split(",").forEach(function (item) {
                        html += `<div class="badge badge-primary mr-1 mb-1"><span>${item}</span></div>`;
                    });
                }
                return html;
            }
        }, {
            field: "context",
            title: controlsKendo.grid.column.title.context,
            width: 160,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "strategy",
            title: controlsKendo.grid.column.title.strategy,
            width: 100,
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
            field: "autopause",
            title: controlsKendo.grid.column.title.autopause,
            width: 100,
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
            field: "retry",
            title: controlsKendo.grid.column.title.retry,
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
            field: "record_calls",
            title: controlsKendo.grid.column.title.record_calls,
            width: 130,
            template: function (dataItem) {
                if (dataItem.record_calls != 0) {
                    return `<button class="btn-icon btn btn-primary btn-round btn-sm" type="button" data-toggle="tooltip" data-placement="top" data-original-title="In Use"><i class="feather icon-mic"></i></button>`;
                } else {
                    return `<button class="btn-icon btn rounded-circle btn-sm btn-outline-primary" type="button" data-toggle="tooltip" data-placement="top" data-original-title="Not in use"><i class="feather icon-mic-off"></i></button>`;
                }
            },
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
                name: "agents",
                template: kendo.template($("#gridActionMembersTemplate").html()),
                click: showDetails
            }, {
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "edit",
                //template: "<a href='javascript:void(0)' class='k-button k-grid-edit'><span class='k-icon k-i-edit'></span>" + controlsKendo.grid.button.edit + "</a>",
                template: kendo.template($("#gridActionEditTemplate").html()),
                click(e) {
                    e.preventDefault();
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    let formData = this.dataItem(tr),
                        periodic_announce = formData.periodic_announce.split("/");
                    periodic_announce = periodic_announce[periodic_announce.length - 1];
                    formData.periodic_announce = periodic_announce;
                    let data = { formData: formData };
                    var template = kendo.template($("#addnewTemplate").html());
                    var result = template(data);
                    $("#add-new-data-sidebar").html(result);
                    // $(this).removeClass("btn-secondary")
                    setTimeout(async function () {
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
                            post = { [csrf[0]]: csrf[1], id: formData.id, name: formData.name, customer_code: formData.customer_code };
                        $.post(base_url + "settings/queues/destroy", post, function (response, status) {
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