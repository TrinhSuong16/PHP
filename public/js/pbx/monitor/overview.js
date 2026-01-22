/*=========================================================================================
    File Name: monitor.js
    Description: Monitor board
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/

if (typeof (EventSource) !== "undefined") {
    var path = base_url + "monitor/overview/sse";

    var es = new EventSource(path);  // gọi đến api sse 

    es.addEventListener("groups", (e) => {   // lắng nghe sự kiện từ sse
        var data = JSON.parse(e.data);     // parse data thành json vì data default nó là text
        var html = '';
        data.forEach(ele => {
            html += `<div class="row">
                        <div class="col-sm-12">
                            <div class="card">
                                <div class="card-content">
                                    <div class="card-body row">
                                        <div class="col-3">
                                            <h6 >Groups</h6>
                                            <h4 class="text-uppercase">`+ ele.groupname + `</h4>
                                        </div>
                                        <div class="col-9 row text-center">
                                            <div class="col-12 col-md-2 offset-md-2">
                                                <h6 >Total Agents</h6>
                                                <h5>`+ ele.total_agents + `</h5>
                                            </div>
                                            <div class="col-12 col-md-2">
                                                <h6 >Total Registered</h6>
                                                <h5>`+ ele.total_registered + `</h5>
                                            </div>
                                            <div class="col-12 col-md-2">
                                                <h6 >Total Unregistered</h6>
                                                <h5>`+ ele.total_unregistered + `</h5>
                                            </div>
                                            <div class="col-12 col-md-2">
                                                <h6>Total Unknown</h6>
                                                <h5>`+ ele.total_unknown + `</h5>
                                            </div>
                                            <div class="col-12 col-md-2">
                                                <h6>Active Calls</h6>
                                                <h5>`+ ele.oncalls + `</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            html += '<div class="row">';
            for (const [key, value] of Object.entries(ele.extensions)) {
                html += `<div class="col-xl-2 col-md-4 col-sm-6">
                                    <div class="card text-center">
                                        <div class="card-content">
                                            <div class="card-body">
                                                `+ ((["registered", "reachable"].includes(value.status)) ?
                        `<div class="avatar ` + (value.oncall != undefined ? 'bg-rgba-primary phone-ringing' : 'bg-rgba-success') + ` p-50 m-0 mb-1 ">
                                                                                                                <div class="avatar-content" data-extension="`+ key + `">
                                                                                                                    <i class="feather `+ (value.dnd == 1 ? 'icon-user-minus text-warning' : ((value.oncall == undefined ? 'text-success icon-user-check' : ('text-primary call-ring ' + (value.oncall.direction == 'out' ? 'icon-phone-outgoing' : 'icon-phone-incoming'))))) + ` font-medium-5"></i>
                                                                                                                </div>
                                                                                                            </div>`
                        :
                        ` <div class="avatar bg-rgba-dark p-50 m-0 mb-1">
                                                                                        <div class="avatar-content" data-extension="`+ key + `">
                                                                                            <i class="feather `+ (value.dnd == 1 ? 'icon-user-minus text-warning' : 'icon-user-x text-dark') + ` font-medium-5"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                                        
                                                                                ` ) + `
                                                <h3 class="text-bold-700">`+ key + `</h3>
                                                <p class="mb-0 line-ellipsis">`+ value.callername + `</p>
                                                `+ (value.oncall !== undefined ? '<p class="mb-0 line-ellipsis">Call ' + value.oncall.direction + '(' + value.oncall.target + ')</p>' : '<p class="mb-0 line-ellipsis">&nbsp;</p>') + `
                                                `+ (value.peering != undefined ? (["registered", "reachable"].includes(value.status) && value.peering != '' ? '<p class="mb-0 line-ellipsis">Peering: ' + value.peering + '</p><p class="mb-0 line-ellipsis">IP: ' + value.ipaddress + '</p>' : '<p class="mb-0 line-ellipsis">&nbsp;</p><p class="mb-0 line-ellipsis">&nbsp;</p>') : '') + `
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            }
            html += '</div>';
        });
        $("#statistics-card").html(html);
    });
} else {
    // Sorry! No server-sent events support..
    alert("Sorry! No server-sent events support..");
    window.location = base_url;
}