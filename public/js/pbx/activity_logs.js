/*=========================================================================================
    File Name: history.js
    Description: History Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

$(document).ready(function () {
    $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: base_url + "activity_logs/lists",
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
        filterable: false,
        noRecords: true,
        scrollable: true,
        columns: [{
            field: "no",
            title: controlsKendo.grid.column.title.no,
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
            field: "created_date",
            title: controlsKendo.grid.column.title.created_date,
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
            title: controlsKendo.grid.column.title.content,
            template: function (dataItem) {
                let description = `<span style='text-decoration: underline;'>${dataItem.description}</span>`,
                    action = (dataItem.action in controlsKendo.logs_action) ? controlsKendo.logs_action[dataItem.action].replace("%s", description) : '',
                    table = (["insert","update","delete"].includes(dataItem.action) && dataItem.table in controlsKendo.logs_tables) ? controlsKendo.logs_tables[dataItem.table] : '';
                if(typeof dataItem.behind == 'undefined') {
                    return `<span style='font-weight: bold;'>${dataItem.creby}</span> ${action} ${table}`;
                }
                return `<span style='font-weight: bold;'>${dataItem.creby}-(${dataItem.behind})</span> ${action} ${table}`;
            }
        }]
    });
});