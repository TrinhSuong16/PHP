$(document).ready(function () {
    $("#spreadsheet").kendoSpreadsheet({
            excel: {                
                // Required to enable saving files in older browsers
                proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
            },
            pdf: {                
                proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
            },
            sheets: [
                {
                    rows: [
                       
                        {
                            height: 25,
                            cells: [
                                {
                                    value: "Extension", 
                                    background: "rgb(167,214,255)", 
                                    textAlign: "center", 
                                    color: "rgb(0,62,117)"
                                },
                                {
                                    value: "Tên người gọi", 
                                    background: "rgb(167,214,255)", 
                                    textAlign: "center", 
                                    color: "rgb(0,62,117)"
                                },
                                {
                                    value: "Ghi âm cuộc gọi", 
                                    background: "rgb(167,214,255)", 
                                    textAlign: "center", 
                                    color: "rgb(0,62,117)"
                                },     
                            ]
                        },{
                            height: 25,
                            cells: [
                                {
                                    value: "1111", 
                                    textAlign: "center", 
                                    color: "rgb(0,62,117)"
                                },
                                {
                                    value: "Nguyen Van A", 
                                    textAlign: "center", 
                                    color: "rgb(0,62,117)"
                                },
                                {
                                    value: "1", 
                                    textAlign: "center", 
                                    color: "rgb(0,62,117)"
                                },     
                            ]
                        },
                    ],
                    columns: [
                        {
                            width: 115
                        },
                        {
                            width: 215
                        },
                        {
                            width: 115
                        },
                        
                    ]
                }
            ]
        });
    var base_url=$('meta[name=base_url]').attr('content');
    var csrf=$('meta[name=csrf]').attr('content').split(":");
    var grid_audio = $("#grid_audio").kendoGrid( {
          dataSource: {
              type: "json",
              transport: {
                  read: {
                      url: base_url + "v3/setting/audio/listAudio",
                      contentType: "application/json",
                      type: "GET", 
                  }
              },
              pageSize: 20,
              schema: {
                  data: function (response) {
                     return response.data;
                  },
                  total: "total"
              },
              change: function() {
                idx = this.skip() + 1;
                $.each(this.data(), (k, output) => {
                  output.no = idx;
                  idx++;
                })
              }
          },
          height: 550,
          sortable: true,
          pageable: {
              refresh: true,
              pageSizes: true,
              buttonCount: 5
          },
          columns: [ {
              title: "STT",
              field: "no",
              width:"50px",
          },{
              field: "name",
              title: "Name"
          },{
              field: "type",
              title: "Type"
          },{
              field: "date_create",
              title: "Create date",
              template: "#= (typeof date_create == \"undefined\" || date_create == null  ||  typeof (date_create) == \"object\" || date_create == \"\") ? \"\" : kendo.toString((new Date((date_create)*1000)),\"dd\/MM\/yyyy \") #"
          },{
            field: "Audio",
            template: kendo.template($("#play-audio").html())
          }],
    });
        
        

});