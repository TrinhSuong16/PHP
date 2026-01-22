$(window).on("load", function () {
    let curtime = new Date();
    var $primary = '#7367F0';
    var $success = '#28C76F';
    var $danger = '#EA5455';
    var $warning = '#FF9F43';
    var $label_color = '#1E1E1E';
    var grid_line_color = '#dae1e7';
    var scatter_grid_color = '#f3f3f3';
    var $scatter_point_light = '#D1D4DB';
    var $scatter_point_dark = '#5175E0';
    var $white = '#fff';
    var $black = '#000';
    const base_url = $('meta[name=base_url]').attr('content');

    var themeColors = [$primary, $success, $danger, $warning, $label_color];
    // ------------------------------------------
    //Get the context of the Chart canvas element we want to select
    if (typeof (EventSource) !== "undefined") {
        var path = base_url + "dashboard/sse";
        var es = new EventSource(path);  // gọi đến api sse 

        es.addEventListener("today_stats", (e) => {   // lắng nghe sự kiện từ sse
            var data = JSON.parse(e.data);     // parse data thành json vì data default nó là text
            if ($('#total_calls').length) {
                document.getElementById("total_calls").innerHTML = data['total_calls'];
                document.getElementById("missed_calls").innerHTML = data['missed_calls'];
                document.getElementById("call_per_hour").innerHTML = data['call_per_hour'];
                document.getElementById("avg_duration").innerHTML = data['avg_duration'];
                document.getElementById("user_online").innerHTML = data['user_online'];
                document.getElementById("avg_talked_time").innerHTML = data['avg_talked_time'];
            }
        });

        es.addEventListener("client_infomation", (e) => {
            var data = JSON.parse(e.data);     // parse data thành json vì data default nó là text
            if ($('#total_extension').length) {
                document.getElementById("total_extension").innerHTML = data['total_extension'];
                document.getElementById("used").innerHTML = data['used'];
                document.getElementById("online").innerHTML = data['online'];
                document.getElementById("total_voicemail").innerHTML = data['total_voicemail'];
                document.getElementById("last_payment_date").innerHTML = data['last_payment_date'];
                document.getElementById("voicemail_picked").innerHTML = data['voicemail_picked'];
            }
        });

        es.addEventListener("stats_inbound", (e) => {
            var data = JSON.parse(e.data);     // parse data thành json vì data default nó là text
            if ($('#acd_inbound').length) {
                document.getElementById("acd_inbound").innerHTML = data['acd'];
                document.getElementById("non_acd_inbound").innerHTML = data['non_acd'];
                document.getElementById("total_inbound").innerHTML = data['total'];
                document.getElementById("rate_change_inbound").innerHTML = data['rate_change'];
                if (data['tenden'] == "reduce") {
                    $("#tenden_stats_inbound").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#tenden_stats_inbound").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }
            }
        });

        es.addEventListener("stats_outbound", (e) => {
            var data = JSON.parse(e.data);     // parse data thành json vì data default nó là text
            if ($('#acd_outbound').length) {
                document.getElementById("acd_outbound").innerHTML = data['acd'];
                document.getElementById("non_acd_outbound").innerHTML = data['non_acd'];
                document.getElementById("total_outbound").innerHTML = data['total'];
                document.getElementById("rate_change_outbound").innerHTML = data['rate_change'];
                if (data['tenden'] == "reduce") {
                    $("#tenden_stats_outbound").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#tenden_stats_outbound").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }
            }
        });

        es.addEventListener("sla_outbound", (e) => {
            var data = JSON.parse(e.data);     // parse data thành json vì data default nó là text
            if ($('#value_sla_out').length) {
                // TOTAL CALLS
                document.getElementById("value_sla_out").innerHTML = data['total_calls']['value'];
                document.getElementById("rate_change_sla_out").innerHTML = data['total_calls']['rate_change'];
                if (data['total_calls']['tenden'] == "reduce") {
                    $("#tenden_total_sla_outbound").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#tenden_total_sla_outbound").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // ANSWERED CALLS
                document.getElementById("ans_val_sla_out").innerHTML = data['answered_calls']['value'];
                document.getElementById("rate_change_ans_sla_out").innerHTML = data['answered_calls']['rate_change'];

                if (data['answered_calls']['tenden'] == "reduce") {
                    $("#tenden_ans_sla_outbound").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#tenden_ans_sla_outbound").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // ANSWERED RATE
                document.getElementById("rate_val_sla_out").innerHTML = data['answered_rate']['value'];
                document.getElementById("rate_change_rate_sla_out").innerHTML = data['answered_rate']['rate_change'];

                if (data['answered_rate']['tenden'] == "reduce") {
                    $("#tenden_rate_sla_outbound").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#tenden_rate_sla_outbound").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // CALLER HUNG UP
                document.getElementById("caller_val_sla_out").innerHTML = data['caller_hungup']['value'];
                document.getElementById("rate_change_caller_sla_out").innerHTML = data['caller_hungup']['rate_change'];

                if (data['caller_hungup']['tenden'] == "reduce") {
                    $("#tenden_caller_sla_outbound").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#tenden_caller_sla_outbound").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }
            }
        });

        es.addEventListener("sla_inbound", (e) => {
            var data = JSON.parse(e.data);     // parse data thành json vì data default nó là text
            if ($('#value_sla_out').length) {
                // PICKED UP CALLS
                document.getElementById("pickedup_calls_value").innerHTML = data['pickedup_calls']['value'];
                document.getElementById("pickedup_calls_rate").innerHTML = data['pickedup_calls']['rate_change'];

                if (data['pickedup_calls']['tenden'] == "reduce") {
                    $("#pickedup_calls_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#pickedup_calls_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // PICKED UP RATE
                document.getElementById("pickedup_rate_value").innerHTML = data['pickedup_rate']['value'];
                document.getElementById("pickedup_rate_rate").innerHTML = data['pickedup_rate']['rate_change'];

                if (data['pickedup_rate']['tenden'] == "reduce") {
                    $("#pickedup_rate_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#pickedup_rate_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // MISSED CALLS
                document.getElementById("missed_calls_value").innerHTML = data['missed_calls']['value'];
                document.getElementById("missed_calls_rate").innerHTML = data['missed_calls']['rate_change'];

                if (data['missed_calls']['tenden'] == "reduce") {
                    $("#missed_calls_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#missed_calls_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // AVG WAIT TIME UNTIL MISS CALL
                document.getElementById("avg_waittime_until_misscall_value").innerHTML = data['avg_waittime_until_misscall']['value'];
                document.getElementById("avg_waittime_until_misscall_rate").innerHTML = data['avg_waittime_until_misscall']['rate_change'];

                if (data['avg_waittime_until_misscall']['tenden'] == "reduce") {
                    $("#avg_waittime_until_misscall_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#avg_waittime_until_misscall_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // ABANDONED CALLS
                document.getElementById("abandoned_calls_value").innerHTML = data['abandoned_calls']['value'];
                document.getElementById("abandoned_calls_rate").innerHTML = data['abandoned_calls']['rate_change'];

                if (data['abandoned_calls']['tenden'] == "reduce") {
                    $("#abandoned_calls_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#abandoned_calls_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // AVG WAIT TIME UNTIL ABANDON
                document.getElementById("avg_waittime_ultil_abandon_value").innerHTML = data['avg_waittime_ultil_abandon']['value'];
                document.getElementById("avg_waittime_ultil_abandon_rate").innerHTML = data['avg_waittime_ultil_abandon']['rate_change'];

                if (data['avg_waittime_ultil_abandon']['tenden'] == "reduce") {
                    $("#avg_waittime_ultil_abandon_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#avg_waittime_ultil_abandon_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // TALKED TIME
                document.getElementById("talkedtime_value").innerHTML = data['talkedtime']['value'];
                document.getElementById("talkedtime_rate").innerHTML = data['talkedtime']['rate_change'];

                if (data['talkedtime']['tenden'] == "reduce") {
                    $("#talkedtime_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#talkedtime_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }

                // AVG TALKED TIME
                document.getElementById("avg_talkedtime_value").innerHTML = data['avg_talkedtime']['value'];
                document.getElementById("avg_talkedtime_rate").innerHTML = data['avg_talkedtime']['rate_change'];

                if (data['avg_talkedtime']['tenden'] == "reduce") {
                    $("#avg_talkedtime_tenden").removeClass("icon-arrow-up text-success").addClass("icon-arrow-down text-danger");
                } else {
                    $("#avg_talkedtime_tenden").removeClass("icon-arrow-down text-danger").addClass("icon-arrow-up text-success");
                }
            }
        });

        /**------------------------------------------------------------------------------------------------------------------ */
        /** Chart Data Live Call */
        var linechartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom',
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                xAxes: [{
                        display: true,
                        gridLines: {
                            color: grid_line_color,
                        },
                        scaleLabel: {
                            display: true,
                        }
                    }],
                yAxes: [{
                        display: true,
                        gridLines: {
                            color: grid_line_color,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Calls'
                        },

                    }]
            }
        };
        /**------------------------------------------------------------------------------------------------------------------ */
    } else {
        // Sorry! No server-sent events support..
    }
});
