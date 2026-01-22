/*=========================================================================================
    File Name: active_calls.js
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
            field: "no",
            title: controlsKendo.grid.column.title.no,
            width: 50,
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
            field: "dstchan",
            title: controlsKendo.grid.column.title.dstchannel,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "starttime",
            title: controlsKendo.grid.column.title.starttime,
            width: 160,
            template: function (dataItem) {
                if (typeof dataItem.starttime == "undefined" || dataItem.starttime == null) return "";
                if (typeof dataItem.starttime === "object" ) return kendo.toString((new Date(dataItem.starttime.$date)), "yyyy-MM-dd HH:mm:ss");
                if (isNaN(dataItem.starttime)) return dataItem.starttime;
                return kendo.toString((new Date((dataItem.starttime) * 1000)), "yyyy-MM-dd HH:mm:ss");
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
            field: "answertime",
            title: controlsKendo.grid.column.title.answertime,
            width: 160,
            template: function (dataItem) {
                if (typeof dataItem.answertime == "undefined" || dataItem.answertime == null) return "";
                if (typeof dataItem.answertime === "object" ) return kendo.toString((new Date(dataItem.answertime.$date)), "yyyy-MM-dd HH:mm:ss");
                if (isNaN(dataItem.answertime)) return dataItem.answertime;
                return kendo.toString((new Date((dataItem.answertime) * 1000)), "yyyy-MM-dd HH:mm:ss");
            },
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
        }, {
            field: "disposition",
            title: controlsKendo.grid.column.title.disposition,
            width: 150,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
        }]
    });
});

if (typeof (EventSource) !== "undefined") {
    var path = base_url + "monitor/active_calls/sse";

    var es = new EventSource(path);  // gọi đến api sse 
    es.addEventListener("total", (e) => {
        $("span#overview_total").text(e.data);
    });
    es.addEventListener("totallink", (e) => {
        $("span#overview_link").text(e.data);
    });
    es.addEventListener("totalring", (e) => {
        $("span#overview_ring").text(e.data);
    });
    es.addEventListener("totaldial", (e) => {
        $("span#overview_dial").text(e.data);
    });
    es.addEventListener("totalringing", (e) => {
        $("span#overview_ringing").text(e.data);
    });

    es.addEventListener("activecalls", (e) => { // lắng nghe sự kiện từ sse
        let dataSource = new kendo.data.DataSource({
            data: JSON.parse(e.data),
            change: function (e) {
                idx = 1;
                $.each(this.data(), (k, output) => {
                    output.no = idx;
                    idx++;
                })
            }
        });
        $("#grid").data("kendoGrid").setDataSource(dataSource);
    });
} else {
    // Sorry! No server-sent events support..
    alert("Sorry! No server-sent events support..");
    window.location = base_url;
}