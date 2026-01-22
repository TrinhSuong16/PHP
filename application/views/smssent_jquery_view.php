<div class="app-content content">
    <div class="content-overlay"></div>
    <div class="content-wrapper">
        <div class="content-header row">
        </div>
        <div class="content-body">
            <div id="grid"></div>
            <script>
                jQuery(function () {
                    jQuery("#grid").kendoGrid({
                        "columns": [{
                                "field": "receivedTimestamp",
                                "width": 120,
                                "template": "#:kendo.toString(new Date(receivedTimestamp*1000),\"dd\/MM\/yy HH:mm:ss\")#",
                                "filterable": false,
                                "title": "Received"
                            }, {
                                "field": "sentTimestamp",
                                "width": 120,
                                "template": "#:kendo.toString(new Date(sentTimestamp*1000),\"dd\/MM\/yy HH:mm:ss\")#",
                                "filterable": false,
                                "title": "Sent"
                            }, {
                                "field": "user",
                                "width": 120,
                                "filterable": {
                                    "ui": userFilter
                                },
                                "title": "User"
                            }, {
                                "field": "from",
                                "width": 120,
                                "title": "From",
                                "filterable": {
                                    "ui": fromFilter
                                }
                            }, {
                                "field": "to",
                                "width": 120,
                                "title": "To"
                            }, {
                                "field": "text",
                                "filterable": true,
                                "sortable": false,
                                "title": "Text"
                            }],
                        "dataSource": {
                            "transport": {
                                "read": {
                                    "url": "smssent_jquery_view\/readdb",
                                    "contentType": "application\/json",
                                    "type": "POST"
                                },
                                "parameterMap": function (data) {
                                    return kendo.stringify(data);
                                }
                            },
                            "pageSize": 7,
                            "serverPaging": true,
                            "serverSorting": true,
                            "serverFiltering": true,
                            "sort": [{
                                    "field": "receivedTimestamp",
                                    "dir": "desc"
                                }],
                            "schema": {
                                "data": "data",
                                "total": "total"
                            }
                        },
                        "scrollable": false,
                        "sortable": {
                            "mode": "multiple",
                            "allowUnsort": true
                        },
                        "filterable": {
                            "extra": false,
                            "operators": {
                                "string": {
                                    "eq": "Is equal to",
                                    "contains": "Contains"
                                }
                            }
                        },
                        "pageable": true
                    });
                });
            </script>
        </div>
    </div>
</div>

<script>
    function userFilter(element) {
        element.kendoDropDownList({
            dataSource: {
                transport: {
                    read: {
                        url: "smssent_jquery_view/readfilter?details=user",
                        type: "POST"
                    }
                },
                schema: {
                    data: "data"
                }
            },
            dataTextField: "user",
            dataValueField: "user",
            optionLabel: "--Select Value--"
        });
    }

    function fromFilter(element) {
        element.kendoDropDownList({
            dataSource: {
                transport: {
                    read: {
                        url: "smssent_jquery_view/readfilter?details=from",
                        type: "POST"
                    }
                },
                schema: {
                    data: "data"
                }
            },
            dataTextField: "from",
            dataValueField: "from",
            optionLabel: "--Select Value--"
        });
    }
</script>
