/*=========================================================================================
    File Name: workingtime.js
    Description: Customers Table
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

// Basic Context Menu
pbx.init();

function activeSidebar(data = false) {
    $(".select2-theme").select2({
        dropdownAutoWidth: true,
        width: '100%',
        placeholder: "Classic Theme",
        theme: "classic"
    });

    $(".add-new-data").addClass("show");
    $(".overlay-bg").addClass("show");
    $(".cancel-data-btn, .overlay-bg").on("click", function () {
        $(".add-new-data").removeClass("show")
        $(".overlay-bg").removeClass("show")
        $("#add-new-data-sidebar").html("");
    });

    $('input[type="text"]').keypress(function (e) {
        $(this).closest("div.form-group").removeClass("error");
        $(this).parent().parent().find(".help-block").remove();
    })


    $("#monthpicker").kendoDatePicker({
        // defines the start view
        start: "year",

        // defines when the calendar should return date
        depth: "year",

        // display month and year in the input
        format: "MMMM yyyy",

        // specifies that DateInput is used for masking the input element
        dateInput: true
    });
    $("#tomonthpicker").kendoDatePicker({
        // defines the start view
        start: "year",

        // defines when the calendar should return date
        depth: "year",

        // display month and year in the input
        format: "MMMM yyyy",

        // specifies that DateInput is used for masking the input element
        dateInput: true
    });
    $("#datepicker").kendoDatePicker();
    $("#todatepicker").kendoDatePicker();
    $(".from_monday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".to_monday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".from_tuesday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".to_tuesday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".from_wednesday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".to_wednesday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".from_thursday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".to_thursday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".from_friday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".to_friday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".from_saturday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".to_saturday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".from_sunday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });
    $(".to_sunday").kendoTimePicker({
        format: "h:mm:ss tt",
        componentType: "modern"
    });

    var max_fields = 20; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap"); //Fields wrapper
    var add_button = $(".add_field_button"); //Add button ID

    var x = 1; //initlal text box count

    $(add_button).click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div class="monday_' + x + ' custom-control custom-switch mr-2 mb-1 col-9 col-offset-3"><input class="from_monday_' + x + '"  value="08:00 AM" title="timepicker" name="from_monday[]" /><input class="to_monday_' + x + '" value="06:00 PM" title="timepicker" name="to_monday[]" /><a href="#" class="remove_field"><i class="feather icon-trash-2"></i></a></div>'); //add input box
            $(".from_monday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
            $(".to_monday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
        }
    });

    $(wrapper).on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })

    $('.add_field_button_tuesday').click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $('.input_fields_wrap_tuesday').append('<div class="custom-control tuesday_' + x + ' custom-switch mr-2 mb-1 col-9 col-offset-3"><input class="from_tuesday_' + x + '"  value="08:00 AM" title="timepicker" name="from_tuesday[]" /><input class="to_tuesday_' + x + '" value="06:00 PM" title="timepicker" name="to_tuesday[]" /><a href="#" class="remove_field"><i class="feather icon-trash-2"></i></a></div>'); //add input box
            $(".from_tuesday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
            $(".to_tuesday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
        }
    });

    $(".input_fields_wrap_tuesday").on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })

    $('.add_field_button_wednesday').click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $('.input_fields_wrap_wednesday').append('<div class="custom-control wednesday_' + x + ' custom-switch mr-2 mb-1 col-9 col-offset-3"><input class="from_wednesday_' + x + '"  value="08:00 AM" title="timepicker" name="from_wednesday[]" /><input class="to_wednesday_' + x + '" value="06:00 PM" title="timepicker" name="to_wednesday[]" /><a href="#" class="remove_field"><i class="feather icon-trash-2"></i></a></div>'); //add input box
            $(".from_wednesday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
            $(".to_wednesday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
        }
    });

    $(".input_fields_wrap_wednesday").on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
    $('.add_field_button_thursday').click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $('.input_fields_wrap_thursday').append('<div class="custom-control thursday_' + x + ' custom-switch mr-2 mb-1 col-9 col-offset-3"><input class="from_thursday_' + x + '"  value="08:00 AM" title="timepicker" name="from_thursday[]" /><input class="to_thursday_' + x + '" value="06:00 PM" title="timepicker" name="to_thursday[]" /><a href="#" class="remove_field"><i class="feather icon-trash-2"></i></a></div>'); //add input box
            $(".from_thursday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
            $(".to_thursday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
        }
    });

    $(".input_fields_wrap_thursday").on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
    $('.add_field_button_friday').click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $('.input_fields_wrap_friday').append('<div class="custom-control friday_' + x + ' custom-switch mr-2 mb-1 col-9 col-offset-3"><input class="from_friday_' + x + '"  value="08:00 AM" title="timepicker" name="from_friday[]" /><input class="to_friday_' + x + '" value="06:00 PM" title="timepicker" name="to_friday[]" /><a href="#" class="remove_field"><i class="feather icon-trash-2"></i></a></div>'); //add input box
            $(".from_friday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
            $(".to_friday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
        }
    });

    $(".input_fields_wrap_friday").on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
    $('.add_field_button_saturday').click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $('.input_fields_wrap_saturday').append('<div class="custom-control saturday_' + x + ' custom-switch mr-2 mb-1 col-9 col-offset-3"><input class="from_saturday_' + x + '"  value="08:00 AM" title="timepicker" name="from_saturday[]" /><input class="to_saturday_' + x + '" value="06:00 PM" title="timepicker" name="to_saturday[]" /><a href="#" class="remove_field"><i class="feather icon-trash-2"></i></a></div>'); //add input box
            $(".from_saturday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
            $(".to_saturday_" + x).kendoTimePicker({
                format: "h:mm:ss tt",
                componentType: "modern"
            });
        }
    });

    $(".input_fields_wrap_saturday").on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
    $('.add_field_button_sunday').click(function (e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $('.input_fields_wrap_sunday').append('<div class="custom-control sunday_' + x + ' custom-switch mr-2 mb-1 col-9 col-offset-3"><input class="from_sunday_' + x + '"  value="08:00 AM" title="timepicker" name="from_sunday[]" /><input class="to_sunday_' + x + '" value="06:00 PM" title="timepicker" name="to_sunday[]" /><a href="#" class="remove_field"><i class="feather icon-trash-2"></i></a></div>'); //add input box
            $(".from_sunday_" + x).kendoTimePicker({
                value: new Date(),
                format: "h:mm:ss tt",
                componentType: "modern"
            });
            $(".to_sunday_" + x).kendoTimePicker({
                value: new Date(),
                format: "h:mm:ss tt",
                componentType: "modern"
            });
        }
    });

    $(".input_fields_wrap_sunday").on("click", ".remove_field", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove(); x--;
    });

    $("#frmSubmit").on("click", function () {
        var btself = this;
        $(btself).attr({ "disabled": "disabled" }).append(` <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
        let data = $("#frm_workingtime").serializeObject(),
            url = base_url + (typeof data.id === "undefined" ? "settings/workingtime/add" : "settings/workingtime/update");
        $.post(url, data, function (response, status) {
            $(btself).removeAttr("disabled"); $('.spinner-border').remove();
            if (status === "success") {
                switch (response.status) {
                    case 1:
                        // Tắt form 
                        $(".add-new-data").removeClass("show")
                        $(".overlay-bg").removeClass("show")
                        $("#add-new-data-sidebar").html("");
                        document.body.style.overflow = 'visible';
                        // Load lại data lên Grid
                        $("#grid").data("kendoGrid").dataSource.read();
                        //Bật thông báo
                        toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                        break;
                    case -1:
                        if (typeof response.field != 'undefined') {
                            let error_field = response.field,
                                error_message = '<div class="help-block"><ul role="alert"><li>' + response.message + '</li></ul></div>';
                            error_field.split(',').forEach(ele => {
                                let formGroup = $("#" + ele).closest("div.form-group");
                                if (!formGroup.hasClass('error')) {
                                    formGroup.addClass("error");
                                } else {
                                    $("#" + ele).parent().parent().find(".help-block").remove();
                                }
                                $("#" + ele).parent().after(error_message);
                            });
                        }
                    default:
                        toastr.warning(response.message, 'Warning!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                }
            } else {
                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
            }
        });
    });

    // Scrollbar
    if ($(".data-items").length > 0) {
        new PerfectScrollbar(".data-items", { wheelPropagation: false })
    }
}

//Open sidebar 
(function () {
    $("#add-workingtime").on("click", function () {
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
                    url: base_url + "settings/workingtime/lists",
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
        filterable: {
            extra: false,
            mode: "row",
            operators: {
                string: {
                    contains: controlsKendo.grid.filter.operators.contains,// "Starts with",                    
                    eq: controlsKendo.grid.filter.operators.eq,// "Is equal to",
                    neq: controlsKendo.grid.filter.operators.neq// "Is not equal to"
                }
            }
        },
        noRecords: true,
        scrollable: true,
        columns: [{
            field: "no",
            title: controlsKendo.grid.column.title.no,
            filterable: false,
            width: 70,
        }, {
            field: "name",
            title: controlsKendo.grid.column.title.name,
            width: 300,
            headerAttributes: {
                "class": "table-header-cell",
                style: "text-align: center; font-size: 14px"
            },
            attributes: {
                "class": "table-cell",
                style: "text-align: center;"
            }
        }, {
            field: "description",
            title: controlsKendo.grid.column.title.description,
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
            field: "create_date",
            title: controlsKendo.grid.column.title.create_date,
            filterable: false,
            width: 180,
        }, {
            attributes: {
                class: "table-cell",
                style: "text-align: center;"
            },
            command: [{
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "edit",
                //template: "<a href='javascript:void(0)' class='k-button k-grid-edit'><span class='k-icon k-i-edit'></span>" + controlsKendo.grid.button.edit + "</a>",
                template: kendo.template($("#gridActionEditTemplate").html()),
                click(e) {
                    e.preventDefault();
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    var formData = this.dataItem(tr),
                        data = { formData: formData };
                    var template = kendo.template($("#addnewTemplate").html());
                    var result = template(data);
                    $("#add-new-data-sidebar").html(result);
                    // $(this).removeClass("btn-secondary")
                    setTimeout(activeSidebar, 200);
                }
            }, {
                // for click to work when there is template, add class "k-grid-[command.name]" to some element, otherwise the click handler will not be triggered
                name: "delete",
                //template: "<a href='javascript:void(0)' class='k-button k-primary k-grid-delete k-state-disabled'><span class='k-icon k-i-delete'></span>" + controlsKendo.grid.button.delete + "</a>",
                template: kendo.template($("#gridActionDeleteTemplate").html()),
                click(e) {
                    e.preventDefault();
                    var windowConfirmTemplate = kendo.template($("#windowConfirmTemplate").html());
                    var tr = $(e.target).closest("tr"); // get the current table row (tr)
                    // get the data bound to the current table row
                    let formData = this.dataItem(tr),
                        data = { formData: formData }
                    var result = windowConfirmTemplate(data);
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
                        kendo.ui.progress(grid.element, true);
                        let csrf = $('meta[name=csrf]').attr('content').split(":"),
                            post = { [csrf[0]]: csrf[1], id: formData.id, extension: formData.extension, customer_code: formData.customer_code };
                        $.post(base_url + "settings/workingtime/destroy", post, function (response, status) {
                            kendo.ui.progress(grid.element, false);
                            if (status === "success" && response.status) {
                                grid.dataSource.remove(formData)  //prepare a "destroy" request
                                grid.dataSource.sync()  //actually send the request (might be ommited if the autoSync option is enabled in the dataSource)
                                //Bật thông báo
                                toastr.success(response.message, 'Success!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 2000 });
                            } else {
                                toastr.error(response.message, 'Error!', { positionClass: 'toast-top-left', containerId: 'toast-top-left', "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
                            }
                        });
                    });
                }
            }],
            title: "&nbsp;",
            width: 170
        }]
    }).data("kendoGrid");
});