/*=========================================================================================
    File Name: queue_status.js
    Description: Monitor board
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/
pbx.init();

$(document).ready(function () {
    $("#grid").kendoGrid({
        dataSource: [],
        sortable: false,
        pageable: false,
        filterable: false,
        noRecords: true,
        scrollable: true,
        columns: [{
            field: "status",
            title: controlsKendo.grid.column.title.status,
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
            field: "data",
            title: controlsKendo.grid.column.title.data,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            }
        }, {
            field: "agentname",
            title: controlsKendo.grid.column.title.agentname,
            width: 180,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            }
        }],
        rowTemplate: function (dataItem) {
            let html = `<tr data-uid="${dataItem.uid}"><td colspan="3">${dataItem.data}</td></tr>`;
            if (dataItem.members) {
                dataItem.members.forEach(el => {
                    let bgcolor = '#fff';
                    switch (el.agent_status) {
                        case 'Invalid':
                        case 'Unavailable':
                            bgcolor = "gray";
                            break;
                        case 'In use':
                            bgcolor = "red";
                            break;
                        case 'Not in use':
                            bgcolor = "green";
                            if (el.ispaused == 1) {
                                bgcolor = '#cccc00';
                            }
                    }
                    html += `<tr>
                                <td class="table-cell"><div style='width: 15px;background-color: ${bgcolor};height: 15px; margin: 0 auto;'></div></td>
                                <td class="table-cell">${el.data}</td>
                                <td class="table-cell" style="text-align: center;">${el.callername}</td>
                            </tr>`;
                });
            }
            return html;
        }
    });
});

if (typeof (EventSource) !== "undefined") {
    var path = base_url + "monitor/queue_status/sse";

    var es = new EventSource(path);  // gọi đến api sse 
    es.addEventListener("total_in_use", (e) => {
        $("span#overview_inuse").text(e.data);
    });
    es.addEventListener("total_invalid", (e) => {
        $("span#overview_invalid").text(e.data);
    });
    es.addEventListener("total_unavailable", (e) => {
        $("span#overview_unavailable").text(e.data);
    });

    es.addEventListener("details", (e) => { // lắng nghe sự kiện từ sse
        let dataSource = new kendo.data.DataSource({
            data: JSON.parse(e.data)
        });
        $("#grid").data("kendoGrid").setDataSource(dataSource);
    });
} else {
    // Sorry! No server-sent events support..
    alert("Sorry! No server-sent events support..");
    window.location = base_url;
}