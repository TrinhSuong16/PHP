
/*=========================================================================================
    File Name: outbound.js
    Description: Report Outbound Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

$(document).ready(function () {
    $("#from, #to").kendoDatePicker({ culture: $('html').attr('lang'), format: "yyyy-MM-dd" });

    $("#search").kendoButton({ icon: "filter" }).width("100%").css("border-radius", 0);
    $("#export").kendoButton({ icon: "excel" }).css("border-radius", 0);

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
            url: base_url + 'reports/outbound/did_numbers',
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

    var grid = $("#grid").kendoGrid({
        excel: {
            allPages: true
        },
        dataSource: {
            transport: {
                read: {
                    url: base_url + "reports/outbound/lists",
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
            field: "calldate",
            title: controlsKendo.grid.column.title.calldate,
            width: 200,
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
            width: 140,
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
            width: 140,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "disposition",
            title: controlsKendo.grid.column.title.disposition,
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
            width: 120,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "waitingtime",
            title: controlsKendo.grid.column.title.waitingtime,
            width: 120,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "duration",
            title: controlsKendo.grid.column.title.duration,
            width: 120,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "did_number",
            title: controlsKendo.grid.column.title.did_number,
            width: 150,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }]
    });

    $("#search").click(function () {
        var filters = [];
        let starttime = $('#from').val() ? new Date($('#from').val()) : new Date(),
            endtime = $('#to').val() ? new Date($('#to').val()) : new Date(),
            src = $('#src').val(), dst = $('#dst').val(),
            did_number = $("#did_number").val(), disposition = [], carrier = [];
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
        $('input[name="disposition[]"]:checkbox:checked').each(function (i) {
            disposition[i] = $(this).val();
        });
        $('input[name="carrier[]"]:checkbox:checked').each(function (i) {
            carrier[i] = $(this).val();
        });

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
        if (disposition.length > 0) {
            filters.push({ field: "disposition", operator: "in", value: disposition });
        }
        if (carrier.length > 0) {
            filters.push({ field: "carrier", operator: "in", value: carrier });
        }
        // console.log(filters)
        grid.data("kendoGrid").dataSource.filter({
            logic: "and",
            filters: filters
        });
    });

    $("#export").click(function () {
        $("#grid").data("kendoGrid").bind("excelExport", function (e) {
            let starttime = $('#from').val() ? new Date($('#from').val()) : new Date(),
                endtime = $('#to').val() ? new Date($('#to').val()) : new Date(),
                start = moment(starttime).format('YYYY-MM-DD'),
                end = moment(endtime).format('YYYY-MM-DD');
            e.workbook.fileName = `reports_outbound_${start}_${end}.xlsx`;
            e.workbook.allPages = true;
        });
        $("#grid").data("kendoGrid").saveAsExcel();
    });
});

