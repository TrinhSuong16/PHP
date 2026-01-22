
/*=========================================================================================
    File Name: voicemail.js
    Description: Record Voicemail Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

$(document).ready(function () {
    $("#from, #to").kendoDatePicker({ culture: $('html').attr('lang'), format: "yyyy-MM-dd" });

    $("#search").kendoButton({ icon: "filter" }).width("100%").css("border-radius", 0);

    var grid = $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "record/voicemail/lists",
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
            field: "mailbox",
            title: controlsKendo.grid.column.title.mailbox,
            headerAttributes: {
                class: "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            }
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
            field: "vm_time",
            title: controlsKendo.grid.column.title.created_date,
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
                    //window.top.location = base_url + 'record/voicemail/play?uniqueid=' + formData.uniqueid + '&customer_code=' + formData.customer_code;
                    let windowPlayRecord = $("#play_record_audio").kendoWindow({
                        title: formData.src,
                        visible: false, //the window will not appear before its .open method is called
                        resizable: false,
                        width: "500px",
                        // height: "200px",
                        close: function () {
                            $(this.element).empty();
                        }
                    }).data("kendoWindow");
                    let windowPlayRecordTemplate = kendo.template($("#play-audio").html());
                    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
                    formData.file = random(1, 99);
                    formData.randomFirst = random(1000, 9999);
                    formData.randomLast = random(1000, 9999);
                    formData.randomCus = random(1000, 9999);
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
                    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
                    window.top.location = base_url + 'record/voicemail/download?u=' + random(1000, 9999) + formData.id + random(1000, 9999) + '&s=' + random(1000, 9999) + formData.customer_id;
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
            src = $('#src').val(), mailbox = $('#mailbox').val();
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

        filters.push({ field: "vm_time", operator: "gte", value: moment(starttime).format('YYYY-MM-DD') });
        filters.push({ field: "vm_time", operator: "lt", value: moment(endtime).format('YYYY-MM-DD') });

        if (mailbox != "") {
            filters.push({ field: "mailbox", operator: "eq", value: mailbox });
        }
        if (src != "") {
            filters.push({ field: "src", operator: "eq", value: src });
        }
        grid.data("kendoGrid").dataSource.filter({
            logic: "and",
            filters: filters
        });
    });
});

