
/*=========================================================================================
    File Name: user_call.js
    Description: Report user_call Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

$(document).ready(function () {
    $("#from, #to").kendoDatePicker({ culture: $('html').attr('lang'), format: "yyyy-MM-dd" });

    $("#search").kendoButton({ icon: "filter" }).width("100%").css("border-radius", 0);
    $("#export").kendoButton({ icon: "excel" }).css("border-radius", 0);

    $('#usergroup').select2({
        dropdownAutoWidth: false,
        width: '100%',
        allowClear: true,
        placeholder: controlsKendo.select.title.usergroup,
        escapeMarkup: function (markup) {
            return markup;
        },
        templateResult: function (repo) {
            if (repo.loading) {
                return repo.text;
            }
            let $container = $(`<div class='select2-result-repository clearfix'>
                                    <div class='select2-result-repository__title'>
                                        <i class="fa fa-object-group"></i> ${repo.text}
                                    </div>
                                </div>`);
            return $container;
        },
        templateSelection: function (repo) {
            return `<i class="fa fa-object-group"></i> ${repo.text}`;
        },
        ajax: {
            url: base_url + 'reports/user_call/usergroups',
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
                    url: base_url + "reports/user_call/lists",
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
            width: 120,
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
            field: "accountcode",
            title: controlsKendo.grid.column.title.accountcode,
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
            field: "total_calls",
            title: controlsKendo.grid.column.title.total_calls,
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
            field: "total_duration",
            title: controlsKendo.grid.column.title.total_duration,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "avg_duration",
            title: controlsKendo.grid.column.title.avg_duration,
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
            field: "outbound_calls",
            title: controlsKendo.grid.column.title.outbound_calls,
            width: 160,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "outbound_duration",
            title: controlsKendo.grid.column.title.outbound_duration,
            width: 160,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "avg_outbound_duration",
            title: controlsKendo.grid.column.title.avg_outbound_duration,
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
            field: "inbound_calls",
            title: controlsKendo.grid.column.title.inbound_calls,
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
            field: "inbound_duration",
            title: controlsKendo.grid.column.title.inbound_duration,
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
            field: "avg_inbound_duration",
            title: controlsKendo.grid.column.title.avg_inbound_duration,
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
            field: "no_answer_calls",
            title: controlsKendo.grid.column.title.no_answer_calls,
            width: 150,
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
            usergroup = $("#usergroup").val(), disposition = [], carrier = [];
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


        if (usergroup != null && usergroup != "") {
            filters.push({ field: "usergroup", operator: "eq", value: usergroup });
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
            e.workbook.fileName = `reports_user_call_${start}_${end}.xlsx`;
            e.workbook.allPages = true;
        });
        $("#grid").data("kendoGrid").saveAsExcel();
    });
});

