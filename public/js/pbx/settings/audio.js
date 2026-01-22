/*=========================================================================================
    File Name: audio.js
    Description: Queues Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

function activeSidebar(data = false) {
    $(".add-new-data").addClass("show");
    $(".overlay-bg").addClass("show");
    $(".cancel-data-btn, .overlay-bg").on("click", function () {
        $(".add-new-data").removeClass("show")
        $(".overlay-bg").removeClass("show")
        $("#add-new-data-sidebar").html("");
    });

    $('input[type="text"], input[type="number"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })

    Dropzone.autoDiscover = false;
    $("#myDropzone").dropzone({
        url: base_url + "settings/audio/upload",
        acceptedFiles: '.wav, .mp3',
        maxFileSize: 5,
        maxFiles: 10,
        autoDiscover: false,
        autoProcessQueue: false,
        parallelUploads: 100, // use it with uploadMultiple
        uploadMultiple: true, // uplaod files in a single request
        addRemoveLinks: true,
        paramName: "audio",
        init: function () {
            var submitButton = document.querySelector("#dropzoneSubmit")
            myDropzone = this;
            submitButton.addEventListener("click", function (e) {
                if (myDropzone.getQueuedFiles().length === 0) {
                    toastr.error(controlsKendo.valiation.audio_is_required, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2500 });
                } else {
                    myDropzone.processQueue();
                    $("#dropzoneSubmit").attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
                }
            });
            this.on("sendingmultiple", function (file, xhr, formData) {
                let csrf = $('meta[name=csrf]').attr('content').split(":");
                formData.append([csrf[0]], csrf[1]);
            });
            this.on("successmultiple", function (file, response) {
                $("#dropzoneSubmit").removeAttr("disabled"); $('.spinner-border').remove();
                // Reset token CSRF
                let token_name = response.csrf.name;
                let token_value = response.csrf.value;
                document.querySelector('meta[name="csrf"]').setAttribute("content", token_name + ":" + token_value);
                $(document).find('input[type="hidden"]').filter('[name="' + token_name + '"]').val(token_value);
                // Tắt form 
                $(".add-new-data").removeClass("show")
                $(".overlay-bg").removeClass("show")
                $("#add-new-data-sidebar").html("");
                document.body.style.overflow = 'visible';
                // Load lại data lên Grid
                $("#grid").data("kendoGrid").dataSource.read();
                //Bật Swal thông báo
                Swal.fire({
                    title: "OK!",
                    html: response.message,
                    type: "success",
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false
                });
            });
            // this.on("success", function(file, responseText) {
            //     console.log(responseText);
            // });
            this.on("error", function (file, message) {
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2500 });
            });
        },
    });

    // Scrollbar
    if ($(".data-items").length > 0) {
        new PerfectScrollbar(".data-items", { wheelPropagation: false })
    }
}

//Open sidebar 
(function () {
    $("#add-audio").on("click", function () {
        var template = kendo.template($("#addnewTemplate").html());
        $("#add-new-data-sidebar").html(template);
        setTimeout(activeSidebar, 200);
    });
})();

$(document).ready(function () {
    var windowConfirm = $("#windowConfirm").kendoWindow({
        title: '',
        visible: false, //the window will not appear before its .open method is called
        width: "400px",
        // height: "200px",
    }).data("kendoWindow");

    var grid = $("#grid").kendoGrid({
        dataSource: {
            transport: {
                read: {
                    url: base_url + "settings/audio/lists",
                    contentType: "application/json",
                    type: "GET",
                }
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
        filterable: false,
        sortable: false,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
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
            field: "filename",
            title: controlsKendo.grid.column.title.filename
        }, {
            field: "filetype",
            title: controlsKendo.grid.column.title.filetype,
            width: 120,
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
            width: 170,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
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
                    //window.top.location = base_url + 'record/outbound/play?uniqueid=' + formData.uniqueid + '&customer_code=' + formData.customer_code;
                    let windowPlayRecord = $("#play_record_audio").kendoWindow({
                        title: formData.filename,
                        visible: false, //the window will not appear before its .open method is called
                        resizable: false,
                        width: "500px",
                        // height: "200px",
                        close: function () {
                            $(this.element).empty();
                        }
                    }).data("kendoWindow");
                    let windowPlayRecordTemplate = kendo.template($("#play-audio").html());
                    let result = windowPlayRecordTemplate({ data: formData });
                    windowPlayRecord.content(result); //send the row data object to the template and render it
                    windowPlayRecord.center().open();
                }
            }, {
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "download",
                //template: "<a href='javascript:void(0)' class='k-button k-grid-edit'><span class='k-icon k-i-edit'></span>" + controlsKendo.grid.button.edit + "</a>",
                template: kendo.template($("#gridActionDownloadTemplate").html()),
                click(e) {
                    e.preventDefault();
                    let tr = $(e.target).closest("tr");
                    let formData = this.dataItem(tr);
                    window.top.location = `${base_url}settings/audio/download?id=${formData.id}&customer_code=${formData.customer_code}&file=${formData.filepath}/${formData.filename}.${formData.filetype}`;
                }
            }, {
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "delete",
                //template: "<a href='javascript:void(0)' class='k-button k-primary k-grid-delete k-state-disabled'><span class='k-icon k-i-delete'></span>" + controlsKendo.grid.button.delete + "</a>",
                template: kendo.template($("#gridActionDeleteTemplate").html()),
                click(e) {
                    e.preventDefault();
                    let windowConfirmTemplate = kendo.template($("#windowConfirmTemplate").html());
                    let tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    let formData = this.dataItem(tr), data = { formData: formData };
                    let result = windowConfirmTemplate(data);
                    windowConfirm.title($("#windowConfirmTemplate").attr("title"));
                    windowConfirm.content(result); //send the row data object to the template and render it
                    windowConfirm.center().open();

                    //Xử lý button hủy bỏ xóa
                    $(".k-button-no").click(function () {
                        windowConfirm.close();
                    })

                    //Xử lý button xác nhận xóa
                    $(".k-button-yes").click(function () {
                        windowConfirm.close();
                        let csrf = $('meta[name=csrf]').attr('content').split(":"),
                            post = { [csrf[0]]: csrf[1], id: formData.id, filename: formData.filename, customer_code: formData.customer_code };
                        $.post(base_url + "settings/audio/destroy", post, function (response, status) {
                            if (status === "success" && response.status) {
                                grid.dataSource.remove(formData)  //prepare a "destroy" request
                                grid.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                                //Bật thông báo
                                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 1500 });
                            } else {
                                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                            }
                        });
                    });
                }
            }],
            title: "&nbsp;",
            width: 150
        }],
    }).data("kendoGrid");
});