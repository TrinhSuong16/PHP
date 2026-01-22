/*=========================================================================================
    File Name: table-customers.js
    Description: Customers Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};

Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};

$(document).on("click", ".login_by_user", function () {
    // var row = $(this).closest("tr");
    var code = $(this).data('code');
    var username = $(this).data('username') || '';
    var csrf = $('meta[name=csrf]').attr('content').split(":");
    $.ajax({
        url: base_url + "manage/customers/login_by_user",
        type: "POST",
        data: { [csrf[0]]: csrf[1], 'code': code, 'username': username },
        dataType: 'json',
        success: function (response) {
            if (response.status == 1) {
                window.location.reload();
            } else if (response.status > 1) {
                var popup = $('#model-alert-login');
                popup.find('.modal-body').html(response.message);
                let html = '';
                response.users.forEach(function (data) {
                    html += '<button type="button" class="btn btn-primary login_by_user" data-code="' + data.customer_code + '" data-username="' + data.username + '">' + data.username + '</button>';
                });
                popup.find('.modal-footer').html(html);
                popup.modal('show');
            } else {
                alert("Login failed.");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
});

$('#model-form-customer').on('hidden.bs.modal', function (e) {
    $(this).find("input,textarea,select")
        .val('')
        .end()
        .find("input[type=checkbox], input[type=radio]")
        .prop("checked", "")
        .end();
    $("#status").select2("val", "0");
    $("#rotate_recording").val("365");
    $("#enable_crm_external").select2("val", "0");
    $("#enable_acs").select2("val", "0");
    $("#emergency").select2("val", "0");
    $("#computes").empty();
    $("#storage").empty();
    $("#listView_did_number").html('');
    $("div.form-group").removeClass("error");
    $("div.form-group").find(".help-block").remove();
    $('#model-form-customer .modal-title').text(controlsKendo.template.label.title.add);
    // $("#pager_did_number").html('');
    DIDNumbers = [];
})

function showModal(data) {
    // console.log(data)
    $('#model-form-customer .modal-title').text(controlsKendo.template.label.title.edit + data.customer_code);
    data.forEach(function (val, key) {
        if ($('#model-form-customer #' + key).length > 0) {
            if ($('#model-form-customer #' + key).is('input') || $('#model-form-customer #' + key).is('textarea')) {
                $('#model-form-customer #' + key).val(val);
            } else if ($('#model-form-customer #' + key).is('select')) {
                $('#model-form-customer #' + key).val(val).change();
            } else {
            }
        }
    });
    //Show DID in listView
    // showListDids(data.didnumber);
    let didnumbers = $('#didnumbers').val();
    if (didnumbers) {
        didnumbers.split(",").forEach(function (item, key) {
            let element = { "did_number": item, "type_add": "old" };
            DIDNumbers.pushIfNotExist(element, function (e) {
                return e.did_number === element.did_number;
            });
        });
        showListDids();
    }
    //Show info externalCRM
    if (data.enable_crm_external == "1") {
        $.get(base_url + 'manage/customers/externalcrm?code=' + data.customer_code, function (res) {
            if (res.total == 1) {
                $('#externalcrm_secret').val(res.data.secret).keydown(false);
                $('#externalcrm_protocol').val(res.data.method);
                $('#btnProtocol').text(res.data.method);
                $('#externalcrm_callbackurl').val(res.data.callback_url).attr('title', res.data.callback_url);
                $('#externalcrm_type').val(res.data.crm_type);
                $('#externalcrm_connectinfo').val(res.data.connect_info);
                $('#externalcrm_version').val(res.data.version);
            }
        })
    }
    if (data.enable_acs == "1") {
        $.get(base_url + 'manage/customers/acs?code=' + data.customer_code, function (res) {
            if (res.total == 1) {
                $('#enable_acs').val(res.data.acs).change();
                $('#acs_secret').val(res.data._id).keydown(false);
                $('#acs_max_channels').val(res.data.NumberOfCall);
                if (typeof res.data.postback != 'undefined') {
                    let matches = res.data.postback.url.match('^(http:\/\/|https:\/\/)?(.*)$');
                    if (typeof matches[1] != 'undefined') {
                        $('#btnACSProtocol').text(matches[1]);
                        $('#acs_protocol').val(matches[1]);
                    }
                    if (typeof matches[2] != 'undefined') $('#acs_postback_url').val(matches[2]);
                    $('#acs_postback_datatype').val(res.data.postback.type).change();
                    $('#acs_postback_authorization').val(res.data.postback.secret).change();
                }
            }
        })
    }

    //Handle Computes and Storage
    var $computes = $('#computes'), $storage = $('#storage');
    var pbx_server = $('#model-form-customer #pbx_server').val(),
        pbx_compute_id = $('#model-form-customer #pbx_compute_id').val(),
        configfilename = $('#model-form-customer #configfilename').val(),
        pbx_node = $('#model-form-customer #pbx_node').val(),
        path_recording = $('#model-form-customer #path_recording').val();
    // $computes
    select2Computes($computes);
    $computes.select2("trigger", "select", { data: { id: pbx_compute_id, ip: pbx_server, idnode: pbx_node, configfilename: configfilename } });
    // $storage
    select2Storage($storage, pbx_server);
    $.get(base_url + 'manage/customers/storage?ip=' + pbx_server + '&page=1', function (res) {
        res.data.find(function (post, index) {
            if (post.id == path_recording) {
                $storage.select2("trigger", "select", { data: post });
                $('.select2-search input, :focus,input').prop('focus', false).blur();
                return true;
            }
        });
    })
    $('.select2-search input, :focus,input').prop('focus', false).blur();
    //show modals
    $('#model-form-customer').modal('show');
}

function select2DID($did_items) {
    $did_items.select2({
        dropdownAutoWidth: false,
        width: '100%',
        // maximumSelectionLength: 5,
        // placeholder: controlsKendo.template.label.title.placeholder_options,
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
            url: base_url + 'manage/customers/did_numbers',
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

function showListDids(/*DIDNumbers = []*/) {
    $("#listView_did_number").html('');
    $("#pager_did_number").html('');
    if (DIDNumbers.length) {
        $('#view-did_number').show();
        var dataSourceDID = new kendo.data.DataSource({
            data: DIDNumbers,
            // pageSize: 20
        });

        // $("#pager_did_number").kendoPager({
        //     dataSource: dataSourceDID
        // });
        $("#listView_did_number").kendoListView({
            dataSource: dataSourceDID,
            template: kendo.template($("#templateDIDNumber").html())
        });
        $('#listView_did_number > .k-listview-content').addClass('row');
        $('#didnumbers').val(function () {
            var out = [];
            for (var i = 0; i < DIDNumbers.length; i++) {
                out.push(DIDNumbers[i]["did_number"]);
            }
            return out.join(",");
        });
    } else {
        $('#view-did_number').hide();
    }

}

function deleteItemDIDNumber(e, type) {
    var listView = $("#listView_did_number").getKendoListView();
    var didnumberContainer = $(e.target).closest(".didnumber-view");
    var didnumber = listView.dataItem(didnumberContainer);
    if ($("#id").val() != "" && $("#customer_code").val() != "" && type == "old") {
        /*
        var confirmTemplate = kendo.template($("#confirmDIDNumberTemplate").html());
        var confirmPopup = $("#confirmDIDNumber").kendoWindow({
            title: '',
            visible: false, //the window will not appear before its .open method is called
            width: "400px"
        }).data("kendoWindow");
        // console.log(confirmPopup)
        confirmPopup.title($("#confirmDIDNumberTemplate").attr("title"));
        confirmPopup.content(confirmTemplate(didnumber)); //send the row data object to the template and render it
        confirmPopup.center().open();
        confirmPopup.close();
        */
        var csrf = $('meta[name=csrf]').attr('content').split(":"),
            customer_id = $("#id").val(),
            customer_code = $("#customer_code").val();
        // console.log(didnumber);return;
        $.ajax({
            url: base_url + "manage/customers/remove_didnumber",
            type: "POST",
            data: { [csrf[0]]: csrf[1], 'id': customer_id, 'code': customer_code, 'did_number': didnumber.did_number },
            dataType: 'json',
            success: function (response) {
                if (response.status == 1) {
                    $('#didnumbers').val(function () {
                        let out = [], index = -1;
                        for (let i = 0; i < DIDNumbers.length; i++) {
                            if (DIDNumbers[i]["did_number"] !== didnumber.did_number) {
                                out.push(DIDNumbers[i]["did_number"]);
                            } else {
                                index = i;
                            }
                        }
                        if (index > -1) DIDNumbers.splice(index, 1);
                        return out.join(",");
                    });
                    listView.dataSource.remove(didnumber)  //prepare a "destroy" request
                    listView.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                } else {
                    Swal.fire({
                        title: "Warning!",
                        text: response.message,
                        type: "error",
                        confirmButtonClass: 'btn btn-danger',
                        buttonsStyling: false
                    });
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    } else {
        $('#didnumbers').val(function () {
            let out = [], index = -1;
            for (let i = 0; i < DIDNumbers.length; i++) {
                if (DIDNumbers[i]["did_number"] !== didnumber.did_number) {
                    out.push(DIDNumbers[i]["did_number"]);
                } else {
                    index = i;
                }
            }
            if (index > -1) DIDNumbers.splice(index, 1);
            return out.join(",");
        });
        listView.dataSource.remove(didnumber)  //prepare a "destroy" request
        listView.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
    }
}

function select2Computes($computes) {
    $computes.select2({
        dropdownAutoWidth: false,
        width: '100%',
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (repo) {
            if (repo.loading) {
                return repo.ip;
            }
            let $container = $(`<div class='select2-result-repository clearfix'>
                                    <div class='select2-result-repository__title'>
                                        <i class="fa fa-server"></i> [${repo.idnode}] ${repo.ip}(${repo.configfilename}) 
                                    </div>
                                </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            if (repo.text != undefined && repo.text != "") {
                return `<i class="fa fa-server"></i> ${repo.text}`;
            }
            return `<i class="fa fa-server"></i> [${repo.idnode}] ${repo.ip}(${repo.configfilename})`;
        },
        ajax: {
            url: base_url + 'manage/customers/computes',
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

function select2Storage($storage, pbx_server = '127.0.0.1') {
    // $storage.html = '';
    $storage.select2({
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
                                        <i class="fa fa-folder-open"></i> ${repo.text}
                                    </div>
                                </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            return `<i class="fa fa-folder-open"></i> ${repo.text}`;
        },
        ajax: {
            url: base_url + 'manage/customers/storage?ip=' + pbx_server,
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

function filterStatusCustomer(status) {
    let filters = [];
    if (status === "demo") {
        filters.push({ field: "company_name", operator: "contains", value: "demo" });
    } else {
        filters.push({ field: "status", operator: "eq", value: status });
    }
    $("#grid").data("kendoGrid").dataSource.filter({
        logic: "and",
        filters: filters
    });
}

var DIDNumbers = [];
$(document).ready(function () {
    //Open sidebar 
    var $did_items = $('#did_items'),
        $computes = $('#computes'),
        $storage = $('#storage');
    // showListDids();
    select2DID($did_items);
    $('#add-did').on('click', function () {
        let did_items = $did_items.val();
        if (did_items) {
            let element = { "did_number": did_items, "type_add": "new" };
            DIDNumbers.pushIfNotExist(element, function (e) {
                return e.did_number === element.did_number;
            });
        }
        showListDids();
        $did_items.val(null).trigger('change');
    });

    $('#status,#enable_crm_external,#enable_acs,#acs_postback_datatype').select2({
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
    $('#externalcrm_secret').keydown(false);
    $('#acs_secret').keydown(false);

    var eSecretText = $("#externalcrm_secret"),
        acsSecretText = $("#acs_secret"),
        eSecretbtnCopy = $("#button-copy-secret > button"),
        acsSecretbtnCopy = $("#button-copy-acs-secret > button");
    // copy text on click
    eSecretbtnCopy.on("click", function () {
        eSecretText.select();
        document.execCommand("copy");
    });
    acsSecretbtnCopy.on("click", function () {
        acsSecretText.select();
        document.execCommand("copy");
    })

    select2Computes($computes);
    $computes.on('select2:select', function (evt) {
        if (evt) {
            $('#pbx_compute_id').val(evt.params.data.id);
            $('#pbx_server').val(evt.params.data.ip);
            $('#configfilename').val(evt.params.data.configfilename);
            $('#pbx_node').val(evt.params.data.idnode);

            $(this).closest("div.form-group").removeClass("error");
            $(this).parent().parent().find(".help-block").remove();

            select2Storage($storage, evt.params.data.ip);
            $('#path_recording').val("");
            $storage.empty().on('select2:select', function (evt2) {
                if (evt2) {
                    $('#path_recording').val(evt2.params.data.id);
                    $(this).closest("div.form-group").removeClass("error");
                    $(this).parent().parent().find(".help-block").remove();
                }
            });
        }
    });

    $("#expired, #nextday").kendoDatePicker({ culture: $('html').attr('lang'), format: "yyyy-MM-dd" });

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
                    url: base_url + "manage/customers/lists",
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
            serverSorting: true
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
            template: function (dataItem) {
                var data = { formData: dataItem }
                var template = kendo.template($('#actionTemplate').html());
                return template(data);
            },
            width: 60
        }, {
            field: "customer_code",
            title: controlsKendo.grid.column.title.customer_code,
            width: 150,
            template: function (dataItem) {
                let icon = 'good.svg',
                    status_detail = controlsKendo.grid.column.status_1;
                switch (dataItem.status) {
                    case '0':
                        icon = 'unknown.svg';
                        status_detail = controlsKendo.grid.column.status_0;
                        break;
                    case '2':
                        icon = 'bad.svg';
                        status_detail = controlsKendo.grid.column.status_2;
                        break;
                    case '3':
                        icon = 'bad.svg';
                        status_detail = controlsKendo.grid.column.status_3;
                        break;
                }
                return `<strong>${dataItem.customer_code}</strong> 
                        <span data-toggle="tooltip" data-placement="top" title="${status_detail}" style="vertical-align: middle">
                            <img width="20" height="20" src="${base_url}public/images/icons/${icon}" style="margin-left: 5px;">
                        </span>`;
            },
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "company_name",
            title: controlsKendo.grid.column.title.company_name
        }, {
            field: "extension",
            title: controlsKendo.grid.column.title.extension,
            width: 120,
            filterable: false,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "chanels",
            title: controlsKendo.grid.column.title.channels,
            width: 120,
            filterable: false,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "sipcloud",
            title: controlsKendo.grid.column.title.sipcloud,
            width: 100,
            filterable: false,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "pbx_server",
            title: controlsKendo.grid.column.title.pbx_server,
            width: 180,
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
                    var formData = this.dataItem(tr);
                    showModal(formData);
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
                            post = { [csrf[0]]: csrf[1], id: formData.id, customer_code: formData.customer_code, pbx_server: formData.pbx_server };
                        $.post(base_url + "manage/customers/destroy", post, function (response, status) {
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
            }],
            title: "&nbsp;",
            width: 170
        }]
    }).data("kendoGrid");

    $('input[type="text"], input[type="number"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })
});

$("#frmSubmit").on("click", function () {
    let btself = this;
    $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
    let data = $("#frm_customers").serializeObject(),
        url = base_url + (typeof data.id === "undefined" || data.id == "" ? "manage/customers/add" : "manage/customers/update");
    $.post(url, data, function (response, status) {
        $(btself).removeAttr("disabled"); $('.spinner-border').remove();
        if (status === "success") {
            if (response.status == 1) {
                // Tắt form
                $('#model-form-customer').modal('hide');
                // Load lại data lên Grid
                $("#grid").data("kendoGrid").dataSource.read();
                //Bật thông báo
                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
            } else if (response.status == -1) {
                if (typeof response.field != 'undefined') {
                    let error_field = response.field,
                        error_message = '<div class="help-block"><ul role="alert"><li>' + response.message + '</li></ul></div>';
                    let formGroup = $("#" + error_field).closest("div.form-group");
                    if (!formGroup.hasClass('error')) {
                        formGroup.addClass("error");
                    } else {
                        $("#" + error_field).closest("div.form-group").find(".help-block").remove();
                    }
                    $("#" + error_field).parent().after(error_message);
                    $("#" + error_field).focus();
                }
                toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
            } else {
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
        } else {
            toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 4000 });
        }
    });
});