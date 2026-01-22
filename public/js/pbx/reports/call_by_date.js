
/*=========================================================================================
    File Name: call_by_date.js
    Description: Report call_by_date Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

$(document).ready(function () {
    $("#from, #to").kendoDatePicker({ culture: $('html').attr('lang'), format: "yyyy-MM-dd" });

    $("#direction").select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    $("#search").kendoButton({ icon: "filter" }).width("100%").css("border-radius", 0);
    $("#export").kendoButton({ icon: "excel" }).css("border-radius", 0);

    var grid = $("#grid").kendoGrid({
        excel: {
            allPages: true
        },
        dataSource: {
            transport: {
                read: {
                    url: base_url + "reports/call_by_date/lists",
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
            template: "#= (typeof calldate == \"undefined\" || calldate == null  ||  typeof (calldate) == \"object\" || calldate == \"\") ? \"\" : kendo.toString((new Date((calldate)*1000)),\"dd\/MM\/yyyy\") #"
        }, {
            field: "total_calls",
            title: controlsKendo.grid.column.title.total_calls,
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
            field: "answer_call",
            title: controlsKendo.grid.column.title.answer_call,
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
            field: "no_answer_calls",
            title: controlsKendo.grid.column.title.no_answer_calls,
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
            field: "busy_call",
            title: controlsKendo.grid.column.title.busy_call,
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
            field: "failed_call",
            title: controlsKendo.grid.column.title.failed_call,
            width: 220,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }
        ]
    });

    $("#search").click(function () {
        var filters = [];
        let starttime = $('#from').val() ? new Date($('#from').val()) : new Date(),
            endtime = $('#to').val() ? new Date($('#to').val()) : new Date(),
            direction = $("#direction").val();
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


        if (direction != null && direction != "") {
            filters.push({ field: "direction", operator: "eq", value: direction });
        }

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
            e.workbook.fileName = `reports_call_by_date_${start}_${end}.xlsx`;
            e.workbook.allPages = true;
        });
        $("#grid").data("kendoGrid").saveAsExcel();
    });
});

