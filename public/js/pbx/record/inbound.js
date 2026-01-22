
/*=========================================================================================
    File Name: inbound.js
    Description: Record Inbound Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

$(document).ready(function () {
    $("#from, #to").kendoDatePicker({ culture: $('html').attr('lang'), format: "yyyy-MM-dd" });

    $("#search").kendoButton({ icon: "filter" }).width("100%").css("border-radius", 0);

    $('#did_number').select2({
        dropdownAutoWidth: false,
        width: '100%',
        allowClear: true,
        placeholder: controlsKendo.select.title.did_number,
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
            return `<i class="fa fa-fax"></i> ${repo.text}`;
        },
        ajax: {
            url: base_url + 'reports/inbound/did_numbers',
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

    $('#queue').select2({
        dropdownAutoWidth: false,
        width: '100%',
        allowClear: true,
        placeholder: controlsKendo.select.title.queue,
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (repo) {
            if (repo.loading) {
                return repo.text;
            }
            let $container = $(`<div class='select2-result-repository clearfix'>
                                    <div class='select2-result-repository__title'>
                                        <i class="fa fa-quora"></i> ${repo.text}
                                    </div>
                                </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            return `<i class="fa fa-quora"></i> ${repo.text}`;
        },
        ajax: {
            url: base_url + 'record/inbound/queues',
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

    $('#sort').select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity,
        templateResult: function iconFormat(icon) {
            if (!icon.id) { return icon.text; }
            return "<i class='" + $(icon.element).data('icon') + "'></i>" + icon.text;
        },
        templateSelection: function iconFormat(icon) {
            if (!icon.id) { return icon.text; }
            return "<i class='" + $(icon.element).data('icon') + "'></i>" + icon.text;
        },
        escapeMarkup: function (es) { return es; }
    });

    var grid = $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "record/inbound/lists",
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
        height: 550,
        sortable: false,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        filterable: false,
        noRecords: true,
        columns: [{
            field: "no",
            title: controlsKendo.grid.column.title.no,
            width: 100,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "calldate",
            title: controlsKendo.grid.column.title.calldate,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
            template: "#= (typeof calldate == \"undefined\" || calldate == null  ||  typeof (calldate) == \"object\" || calldate == \"\") ? \"\" : kendo.toString((new Date((calldate)*1000)),\"dd\/MM\/yyyy HH:mm:ss\") #"
        }, {
            field: "src",
            title: controlsKendo.grid.column.title.src,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "dst",
            title: controlsKendo.grid.column.title.dst,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "billsec",
            title: controlsKendo.grid.column.title.billsec,
            width: 150,
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
                name: "media",
                //template: "<a href='javascript:void(0)' class='k-button k-grid-edit'><span class='k-icon k-i-edit'></span>" + controlsKendo.grid.button.edit + "</a>",
                template: kendo.template($("#gridActionPlayRecordTemplate").html()),
                click(e) {
                    e.preventDefault();
                    let tr = $(e.target).closest("tr");
                    let formData = this.dataItem(tr);
                    //window.top.location = base_url + 'record/inbound/play?uniqueid=' + formData.uniqueid + '&customer_code=' + formData.customer_code;
                    let windowPlayRecord = $("#play_record_audio").kendoWindow({
                        title: formData.src + "-" + formData.dst + "-" + formData.uniqueid,
                        visible: false, //the window will not appear before its .open method is called
                        resizable: false,
                        width: "500px",
                        // height: "200px",
                        close: function () {
                            $(this.element).empty();
                        }
                    }).data("kendoWindow");
                    let windowPlayRecordTemplate = kendo.template($("#play-audio").html());
                    // const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
                    // formData.file = random(1, 99);
                    // formData.randomFirst = random(1000, 9999);
                    // formData.randomLast = random(1000, 9999);
                    let result = windowPlayRecordTemplate({ data: formData });
                    windowPlayRecord.content(result); //send the row data object to the template and render it
                    windowPlayRecord.center().open();
                }
            }, {
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "download",
                //template: "<a href='javascript:void(0)' class='k-button k-grid-edit'><span class='k-icon k-i-edit'></span>" + controlsKendo.grid.button.edit + "</a>",
                template: kendo.template($("#gridActionDownloadRecordTemplate").html()),
                click(e) {
                    e.preventDefault();
                    let tr = $(e.target).closest("tr");
                    let formData = this.dataItem(tr);
                    window.top.location = base_url + 'record/inbound/download?u=' + formData.uniqueid + '&c=' + formData.customer_code;
                }
            }],
            title: "&nbsp;",
            width: 150
        }]
    });

    $("#search").click(function () {
        var filters = [];
        let starttime = $('#from').val() ? new Date($('#from').val()) : new Date(),
            endtime = $('#to').val() ? new Date($('#to').val()) : new Date(),
            src = $('#src').val(), dst = $('#dst').val(),
            did_number = $("#did_number").val(), queue = $("#queue").val();
        if ((starttime.getFullYear() + "" + starttime.getMonth()) != (endtime.getFullYear() + "" + endtime.getMonth())) {
            Swal.fire({
                title: "Error!",
                text: controlsKendo.alert.date_range_in_month,
                type: "error",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false
            });
            return;
        } else {
            if (starttime.getTime() > endtime.getTime()) {
                Swal.fire({
                    title: "Error!",
                    text: controlsKendo.alert.date_range_invalid,
                    type: "error",
                    confirmButtonClass: 'btn btn-primary',
                    buttonsStyling: false
                });
                return;
            }
        }

        filters.push({ field: "calldate", operator: "gte", value: moment(starttime).format('YYYY-MM-DD') });
        filters.push({ field: "calldate", operator: "lt", value: moment(endtime).format('YYYY-MM-DD') });

        if (src != "") {
            filters.push({ field: "src", operator: "eq", value: src });
        }
        if (dst != "") {
            filters.push({ field: "dst", operator: "eq", value: dst });
        }
        if (did_number != null && did_number != "") {
            filters.push({ field: "did_number", operator: "eq", value: did_number });
        }
        if (queue != null && queue != "") {
            filters.push({ field: "queue", operator: "eq", value: queue });
        }
        grid.data("kendoGrid").dataSource.filter({
            logic: "and",
            filters: filters
        });
    });

    $("#sort").on('select2:select', function (e) {
        grid.data("kendoGrid").dataSource.sort({ field: "calldate", dir: e.params.data.id });
    });
});

