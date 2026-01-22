/*=========================================================================================
    File Name: billing.js
    Description: Billing Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

$(document).ready(function () {
    $("#from, #to").kendoDatePicker({ format: "yyyy-MM-dd" });

    $("#search").kendoButton({ icon: "filter" }).width("100%").css("border-radius", 0);
    $("#export").kendoButton({ icon: "excel" }).css("border-radius", 0);

    $("#expression,#reporttype").select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

    var gridElement = $("#grid");
    function resizeGrid() {
        var newGridHeight = $(window).height() - (gridElement.position().top + 180);
        gridElement.height(newGridHeight);
    }
    $(window).resize(function () {
        resizeGrid();
    });
    resizeGrid();

    var columns = [{
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
        field: "calldate",
        title: controlsKendo.grid.column.title.calldate,
        width: 180,
        headerAttributes: {
            "class": "table-header-cell",
            style: "text-align: center; font-size: 14px"
        },
        attributes: {
            "class": "table-cell",
            style: "text-align: center;"
        },
        template: "#= (typeof calldate == \"undefined\" || calldate == null  ||  typeof (calldate) == \"object\" || calldate == \"\") ? \"\" : kendo.toString((new Date((calldate)*1000)),\"dd\/MM\/yyyy HH:mm:ss\") #"
    }, {
        field: "src",
        title: controlsKendo.grid.column.title.src,
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
        field: "dst",
        title: controlsKendo.grid.column.title.dst,
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
        field: "billsec",
        title: controlsKendo.grid.column.title.billsec,
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
        field: "total_billing",
        title: controlsKendo.grid.column.title.amount,
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
        field: "resellername",
        title: controlsKendo.grid.column.title.direction,
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
        field: "src",
        title: controlsKendo.grid.column.title.src,
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
        field: "total",
        title: controlsKendo.grid.column.title.total,
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
        field: "totalBillsec",
        title: controlsKendo.grid.column.title.totalBillsec,
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
        field: "totalBilling",
        title: controlsKendo.grid.column.title.amount,
        width: 150,
        headerAttributes: {
            "class": "table-header-cell",
            style: "text-align: center; font-size: 14px"
        },
        attributes: {
            "class": "table-cell",
            style: "text-align: center;"
        }
    }
    ];

    $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "billing/lists",
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
        noRecords: true,
        scrollable: true,
        columns: columns
    });
    var grid = $('#grid').data('kendoGrid');
    grid.showColumn(grid.columns[0]);
    grid.showColumn(grid.columns[1]);
    grid.showColumn(grid.columns[2]);
    grid.showColumn(grid.columns[3]);
    grid.showColumn(grid.columns[4]);
    grid.showColumn(grid.columns[5]);
    grid.showColumn(grid.columns[6]);
    grid.hideColumn(grid.columns[7]);
    grid.hideColumn(grid.columns[8]);
    grid.hideColumn(grid.columns[9]);
    grid.hideColumn(grid.columns[10]);

    $("#expression").change(function () {
        if ($(this).val() == 0) {
            $('#choose_report_type').hide();
            grid.showColumn(grid.columns[0]);
            grid.showColumn(grid.columns[1]);
            grid.showColumn(grid.columns[2]);
            grid.showColumn(grid.columns[3]);
            grid.showColumn(grid.columns[4]);
            grid.showColumn(grid.columns[5]);
            grid.showColumn(grid.columns[6]);
            grid.hideColumn(grid.columns[7]);
            grid.hideColumn(grid.columns[8]);
            grid.hideColumn(grid.columns[9]);
            grid.hideColumn(grid.columns[10]);
        } else {
            $('#choose_report_type').show();
            $("#reporttype").change(function () {
                if ($(this).val() == 1) {
                    grid.hideColumn(grid.columns[0]);
                    grid.hideColumn(grid.columns[1]);
                    grid.hideColumn(grid.columns[2]);
                    grid.hideColumn(grid.columns[3]);
                    grid.hideColumn(grid.columns[4]);
                    grid.hideColumn(grid.columns[5]);
                    grid.hideColumn(grid.columns[6]);
                    grid.showColumn(grid.columns[7]);
                    grid.showColumn(grid.columns[8]);
                    grid.showColumn(grid.columns[9]);
                    grid.showColumn(grid.columns[10]);
                } else {
                    grid.showColumn(grid.columns[0]);
                    grid.showColumn(grid.columns[1]);
                    grid.showColumn(grid.columns[2]);
                    grid.showColumn(grid.columns[3]);
                    grid.showColumn(grid.columns[4]);
                    grid.showColumn(grid.columns[5]);
                    grid.showColumn(grid.columns[6]);
                    grid.hideColumn(grid.columns[7]);
                    grid.hideColumn(grid.columns[8]);
                    grid.hideColumn(grid.columns[9]);
                    grid.hideColumn(grid.columns[10]);
                }
            })
        }
    });

    $("#search").click(function () {
        var filters = [];
        let starttime = $('#from').val() ? new Date($('#from').val()) : new Date(),
            endtime = $('#to').val() ? new Date($('#to').val()) : new Date(),
            src = $('#src').val(),
            dst = $('#dst').val(),
            reporttype = $("#reporttype").val(), expression = $("#expression").val();
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
        if (expression != null && expression != "") {
            filters.push({ field: "expression", operator: "eq", value: expression });
        }
        if (reporttype != null && reporttype != "") {
            filters.push({ field: "reporttype", operator: "eq", value: reporttype });
        }

        grid.dataSource.filter({
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