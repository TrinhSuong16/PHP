
/*=========================================================================================
    File Name: Distribution_queue_performance_model.js
    Description: Report Distribution_queue_performance_model Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

$(document).ready(function () {
    $("#from, #to").kendoDatePicker({ culture: $('html').attr('lang'), format: "yyyy-MM-dd" });

    $("#search").kendoButton({ icon: "filter" }).width("100%").css("border-radius", 0);
    $("#export").kendoButton({ icon: "excel" }).css("border-radius", 0);

    $("#direction").select2({
        dropdownAutoWidth: true,
        width: '100%',
        minimumResultsForSearch: Infinity
    });

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
            url: base_url + 'reports/distribution_queue_performance/usergroups',
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
                    url: base_url + "reports/distribution_queue_performance/lists",
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
            group: {
                field: "calldate"
            },
            // page: 1,
            // pageSize: 20,
            // serverPaging: false,
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
        pageable: false,
        filterable: false,
        noRecords: true,
        columns: [{
            hidden: true,
            field: "calldate",
            groupHeaderTemplate: controlsKendo.grid.column.title.calldate + ": #= value #",
        }, {
            field: "phase",
            title: controlsKendo.grid.column.title.time,
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
            field: "total_answer",
            title: controlsKendo.grid.column.title.total_answer,
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
            field: "avgtalk",
            title: controlsKendo.grid.column.title.avgtalk,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "total_second_answer",
            title: controlsKendo.grid.column.title.total_second_answer,
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
            field: "avgacw",
            title: controlsKendo.grid.column.title.avgacw,
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
            field: "total_avgacw",
            title: controlsKendo.grid.column.title.total_avgacw,
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
            field: "total_abandon",
            title: controlsKendo.grid.column.title.total_abandon,
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
            field: "avgaban",
            title: controlsKendo.grid.column.title.avgaban,
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
            field: "percentaband",
            title: controlsKendo.grid.column.title.percentaband,
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
            field: "max_wait_ans",
            title: controlsKendo.grid.column.title.max_wait_ans,
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
            field: "avgspeedans",
            title: controlsKendo.grid.column.title.avgspeedans,
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
            usergroup = $("#usergroup").val();
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


        if (usergroup != null && usergroup != "") {
            filters.push({ field: "usergroup", operator: "eq", value: usergroup });
        }
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
            e.workbook.fileName = `reports_queue_period_${start}_${end}.xlsx`;
            e.workbook.allPages = true;
        });
        $("#grid").data("kendoGrid").saveAsExcel();
    });
});

