<div class="app-content content">
        <div class="content-overlay"></div>
        <div class="content-wrapper">
            <div class="content-header row">
            </div>
            <div class="content-body">
                <!-- Dashboard Analytics Start -->
                <section id="dashboard-analytics">
                    <div class="row">
                        <div class="col-md-9 col-12">
                            <div class="row">
                                <div class="col-md-6"> 
                                    <div class="card">
                                        <div class="card-content">
                                            <div class="card-header d-flex justify-content-center">
                                                <h3 class="card-title text-center">TODAY'S STATS</h3>
                                            </div>
                                            <div class="card-body">
                                                <div class="row pb-50">
                                                    <div class="col-lg-6 col-12 d-flex justify-content-between flex-column text-right order-lg-2 order-1">
                                                    </div>
                                                </div>
                                                <div class="row avg-sessions">
                                                    <div class="col-4">
                                                        <strong id="total_calls">0</strong>
                                                        <p>Total calls</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="missed_calls">0</strong>
                                                        <img src="{base_url}public/images/dashboard/sad.png">
                                                        <p>Missed calls</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="call_per_hour">0</strong>
                                                        <p>Call per hour</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="avg_duration">0:00</strong>
                                                        <p>Avg duration</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="user_online">0%</strong>
                                                        <img src="{base_url}public/images/dashboard/smile.png">
                                                        <p>User online</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="avg_talked_time">0:00</strong>
                                                        <p>Avg talked time</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-content">
                                            <div class="card-header justify-content-center">
                                                <h3 class="card-title text-center">CLIENT INFORMATION</h3>
                                            </div>
                                            <div class="card-body">
                                                <div class="row pb-50">
                                                    <div class="col-lg-6 col-12 d-flex justify-content-between flex-column text-right order-lg-2 order-1">
                                                    </div>
                                                </div>
                                                <div class="row avg-sessions">
                                                    <div class="col-4">
                                                        <strong id="total_extension">0</strong>
                                                        <p style="white-space: nowrap;">Total extensions</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="used">0</strong>
                                                        <p>Used</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="online">0</strong>
                                                        <p>Online</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="total_voicemail">0</strong>
                                                        <p style="white-space: nowrap;">Total voicemail</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="last_payment_date">01/01/1970</strong>
                                                        <p style="white-space: nowrap;">Last payment date</p>
                                                    </div>
                                                    <div class="col-4">
                                                        <strong id="voicemail_picked">0</strong>
                                                        <p style="white-space: nowrap;">Voicemail picked</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Row 2 -->
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="card">
                                        <div class="card-content">
                                            <div class="card-header d-flex justify-content-center">
                                                <h3 class="card-title text-center">INBOUND</h3>
                                            </div>
                                            <div class="card-body">
                                                <div class="row pb-50">
                                                    <div class="col-lg-6 col-12 d-flex justify-content-between flex-column text-right order-lg-2 order-1">
                                                    </div>
                                                </div>
                                                <div class="row avg-sessions">
                                                    <div class="col-6 text-right">
                                                        <strong>ACD</strong>
                                                    </div>
                                                    <div class="col-6">
                                                        <p id="acd_inbound">0</p>
                                                    </div> 
                                                    <div class="col-6 text-right">
                                                         <strong style="white-space: nowrap;">Non-ACD</strong>
                                                    </div> 
                                                    <div class="col-6">
                                                        <p id="non_acd_inbound">0</p>
                                                    </div>
                                                    <div class="col-6 text-right">
                                                        <strong id="total_inbound">0</strong>
                                                    </div>
                                                    <div class="col-6" style="white-space: nowrap;">
                                                        <i id="tenden_stats_inbound" class="feather icon-arrow-up text-success"></i>
                                                        <span id="rate_change_inbound">+0%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card">
                                        <div class="card-content">
                                            <div class="card-header d-flex justify-content-center">
                                                <h3 class="card-title text-center">OUTBOUND</h3>
                                            </div>
                                            <div class="card-body">
                                                <div class="row pb-50">
                                                    <div class="col-lg-6 col-12 d-flex justify-content-between flex-column text-right order-lg-2 order-1">
                                                    </div>
                                                </div>
                                                <div class="row avg-sessions">
                                                    <div class="col-6 text-right">
                                                        <strong>ACD</strong>
                                                    </div>
                                                    <div class="col-6">
                                                        <p id="acd_outbound">0</p>
                                                    </div> 
                                                    <div class="col-6 text-right">
                                                         <strong style="white-space: nowrap;">Non-ACD</strong>
                                                    </div> 
                                                    <div class="col-6">
                                                        <p id="non_acd_outbound">0</p>
                                                    </div>
                                                    <div class="col-6 text-right">
                                                        <strong id="total_outbound">0</strong>
                                                    </div>
                                                    <div class="col-6">
                                                        <i id="tenden_stats_outbound" class="feather icon-arrow-up text-success"></i>
                                                        <span id="rate_change_outbound">+0%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card" style="background-color: #2196f345">
                                        <div class="card-header d-flex justify-content-center">
                                            <h4 class="card-title text-center">SLA OUTBOUND</h4>
                                        </div>
                                        <div class="card-content collapse show">                                            
                                            <div class="card-body">
                                                <div class="row pb-50">
                                                    <div class="col-lg-6 col-12 d-flex justify-content-between flex-column text-right order-lg-2 order-1"></div>
                                                </div>
                                                <div class="row avg-sessions">
                                                    <div class="col-6">
                                                        <div class="card text-center">
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">TOTAL CALLS</h6>
                                                                    <span class="text-bold-600 mx-50" id="value_sla_out">0</span>
                                                                    <i id="tenden_total_sla_outbound" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="rate_change_sla_out">0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="card text-center " >
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">ANSWERED CALLS</h6>
                                                                    <span class="text-bold-600 mx-50" id="ans_val_sla_out">0</span>
                                                                    <i id="tenden_ans_sla_outbound" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="rate_change_ans_sla_out">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                   <div class="col-6">
                                                        <div class="card text-center">
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">ANSWERED RATE</h6>
                                                                    <span class="text-bold-600 mx-50" id="rate_val_sla_out">0</span>
                                                                    <i id="tenden_rate_sla_outbound" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="rate_change_rate_sla_out">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <div class="card text-center " >
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">CALLER HUNG UP</h6>
                                                                    <span class="text-bold-600 mx-50" id="caller_val_sla_out">0</span>
                                                                    <i id="tenden_caller_sla_outbound" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="rate_change_caller_sla_out">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End Row 2 -->
                             <!-- Row 3 -->
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="card" style="background-color: #2196f345">
                                        <div class="card-header d-flex justify-content-center">
                                            <h4 class="card-title text-center">SLA INBOUND</h4>
                                        </div>
                                        <div class="card-content collapse show">                                          
                                            <div class="card-body">
                                                <div class="row pb-50">
                                                    <div class="col-lg-6 col-12 d-flex justify-content-between flex-column text-right order-lg-2 order-1">
                                                    </div>
                                                </div>
                                                <div class="row avg-sessions">
                                                    <div class="col-3">
                                                        <div class="card-mini text-center">
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">PICKED UP CALLS</h6>
                                                                    <span class="text-bold-600 mx-50" id="pickedup_calls_value">0</span>
                                                                    <i id="pickedup_calls_tenden" class="feather icon-arrow-up text-success"></i> 
                                                                    <span id="pickedup_calls_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="card-mini text-center " >
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">PICKED UP RATE</h6>
                                                                    <span class="text-bold-600 mx-50" id="pickedup_rate_value">0</span>
                                                                    <i id="pickedup_rate_tenden" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="pickedup_rate_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                   <div class="col-3">
                                                        <div class="card-mini text-center">
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">MISSED CALLS</h6>
                                                                    <span class="text-bold-600 mx-50" id="missed_calls_value">0</span>
                                                                    <i id="missed_calls_tenden" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="missed_calls_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="card-mini text-center " >
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">AVG WAITTIME UNTIL MISSCALL</h6>
                                                                    <span class="text-bold-600 mx-50" id="avg_waittime_until_misscall_value">0</span>
                                                                    <i id="avg_waittime_until_misscall_tenden" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="avg_waittime_until_misscall_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                   <div class="col-3">
                                                        <div class="card-mini text-center">
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">ABANDONED CALLS</h6>
                                                                    <span class="text-bold-600 mx-50" id="abandoned_calls_value">0</span>
                                                                    <i id="abandoned_calls_tenden" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="abandoned_calls_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="card-mini text-center " >
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">AVG WAITTIME UNTIL ABANDON</h6>
                                                                    <span class="text-bold-600 mx-50" id="avg_waittime_ultil_abandon_value">0</span>
                                                                    <i id="avg_waittime_ultil_abandon_tenden" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="avg_waittime_ultil_abandon_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                   <div class="col-3">
                                                        <div class="card-mini text-center">
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400" >TALKED TIME</h6>
                                                                    <span class="text-bold-600 mx-50" id="talkedtime_value">0</span>
                                                                    <i id="talkedtime_tenden" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="talkedtime_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="card-mini text-center " >
                                                            <div class="card-content">
                                                                <div class="card-body">
                                                                    <h6 class="text-bold-400">AVG TALKED TIME</h6>
                                                                    <span class="text-bold-600 mx-50" id="avg_talkedtime_value">0</span>
                                                                    <i id="avg_talkedtime_tenden" class="feather icon-arrow-up text-success"></i>
                                                                    <span id="avg_talkedtime_rate">+0%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End Row 3 -->

                            <!-- row 4 -->
                            <div id="box_live_call" class="row">
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-header justify-content-center">
                                            <h4 class="card-title">LIVE CALL</h4>
                                        </div>
                                        <div class="card-content collapse show">
                                            <div class="card-body pl-0">
                                                <div class="height-300">
                                                    <canvas id="live-call" class="chartjs-render-monitor"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="acs_control_panel" class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="card">
                                        <div class="card-header justify-content-center">
                                            <h4 class="card-title">ACS CONTROL PANEL</h4>
                                        </div>
                                        <div class="card-content collapse show">
                                            <ul id="acs_control_panel_content" class="list-group list-group-flush"></ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End row 4 -->
                            <!-- row 5 -->
                            <div class="row">
                                <div class="col-5">
                                    <div class="card">
                                        <div class="card-header justify-content-center">
                                            <h4 class="card-title">PEAK TIME</h4>
                                        </div>
                                        <div class="card-content collapse show">
                                            <div class="card-body">
                                                <div id="peak-time"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-7">
                                    <div class="card">
                                        <div class="card-header justify-content-center">
                                            <h4 class="card-title">QUEUE PERFORMANCE</h4>
                                        </div>
                                        <div class="card-content collapse show">
                                            <div class="card-body">
                                                <div id="queue-performance"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End row 5 -->
                        </div>
                        <!-- sidebar -->
                        <div class="col-lg-3 col-md-6 col-12">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-header d-flex justify-content-center align-items-center border-bottom pb-1">
                                            <div class="col-3 text-left"><i class="fa fa-calendar" style="font-size: 25px;"></i></div>
                                            <div class="col-md-6 text-center">
                                                <h3 class="card-title">Recent Calls</h3>
                                            </div>
                                            <div class="col-md-3 text-right"><i class="fa fa-cog" style="font-size: 25px;"></i></div>
                                        </div>
                                        <ul class="list-group list-group-flush" id="list_recent_calls"></ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-header d-flex justify-content-center align-items-center border-bottom pb-1">
                                            <div class="col-3 text-left"><i class="fa fa-phone" style="font-size: 25px;"></i></div>
                                            <div class="col-md-6 text-center">
                                                <h3 class="card-title ">DID</h3>
                                            </div>
                                            <div class="col-md-3 text-right"><i class="fa fa-cog" style="font-size: 25px;"></i></div>
                                        </div>
                                        <ul id="list_didnumbers" class="list-group list-group-flush"></ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end sidebar -->
                    </div>

                </section>
                <!-- Dashboard Analytics end -->
            </div>
        </div>
    </div>


