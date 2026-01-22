if (typeof (EventSource) !== "undefined") {
    var base_url = $('meta[name=base_url]').attr('content');
    var path = base_url + "ping/sse";

    var es = new EventSource(path);  // gọi đến api sse 
    
    es.addEventListener("today_stats", (e) => {   // lắng nghe sự kiện từ sse
      var total = JSON.parse(e.data);     // parse data thành json vì data default nó là text

      if ($('#total_calls').length) {
        document.getElementById("total_calls").innerHTML = total['total_calls'];
        document.getElementById("missed_calls").innerHTML = total['missed_calls'];
        document.getElementById("call_per_hour").innerHTML = total['call_per_hour'];
        document.getElementById("avg_duration").innerHTML = total['avg_duration'];
        document.getElementById("user_online").innerHTML = total['user_online'];
        document.getElementById("avg_talked_time").innerHTML = total['avg_talked_time'];
      }
      
    }); 

   es.addEventListener("client_infomation", (e) => {
      var total = JSON.parse(e.data);     // parse data thành json vì data default nó là text
      if ($('#total_extension').length) {
        document.getElementById("total_extension").innerHTML = total['total_extension'];
        document.getElementById("used").innerHTML = total['used'];
        document.getElementById("online").innerHTML = total['online'];
        document.getElementById("total_voicemail").innerHTML = total['total_voicemail'];
        document.getElementById("last_payment_date").innerHTML = total['last_payment_date'];
        document.getElementById("voicemail_picked").innerHTML = total['voicemail_picked'];
      }
    });

    es.addEventListener("inbound", (e) => {
      var total = JSON.parse(e.data);     // parse data thành json vì data default nó là text
      if ($('#acd').length) {
        document.getElementById("acd").innerHTML = total['acd'];
        document.getElementById("non_acd").innerHTML = total['non_acd'];
        document.getElementById("rate_change").innerHTML = total['rate_change'];
        if(total['tenden'] == "rise"){
          document.getElementById("tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }
      }
      
    });

    es.addEventListener("outbound", (e) => {
      var total = JSON.parse(e.data);     // parse data thành json vì data default nó là text
      if ($('#acd_out').length) {
        document.getElementById("acd_out").innerHTML = total['acd'];
        document.getElementById("non_acd_out").innerHTML = total['non_acd'];
        document.getElementById("rate_change_out").innerHTML = total['rate_change'];
        if(total['tenden'] == "rise"){
          document.getElementById("tenden_out").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("tenden_out").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }
      }
    });

    es.addEventListener("sla_outbound", (e) => {
      var total = JSON.parse(e.data);     // parse data thành json vì data default nó là text
      if ($('#value_sla_out').length) {
        // TOTAL CALLS
        document.getElementById("value_sla_out").innerHTML = total['total_calls']['value'];
        document.getElementById("rate_change_sla_out").innerHTML = total['total_calls']['rate_change'];
       
        if(total['total_calls']['tenden'] == "rise"){
          document.getElementById("tenden_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("tenden_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // ANSWERED CALLS
        document.getElementById("ans_val_sla_out").innerHTML = total['answered_calls']['value'];
        document.getElementById("rate_change_ans_sla_out").innerHTML = total['answered_calls']['rate_change'];
       
        if(total['answered_calls']['tenden'] == "rise"){
          document.getElementById("tenden_ans_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("tenden_ans_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // ANSWERED RATE
        document.getElementById("rate_val_sla_out").innerHTML = total['answered_rate']['value'];
        document.getElementById("rate_change_rate_sla_out").innerHTML = total['answered_rate']['rate_change'];
       
        if(total['answered_rate']['tenden'] == "rise"){
          document.getElementById("tenden_rate_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("tenden_rate_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // CALLER HUNG UP
        document.getElementById("caller_val_sla_out").innerHTML = total['caller_hungup']['value'];
        document.getElementById("rate_change_caller_sla_out").innerHTML = total['caller_hungup']['rate_change'];
       
        if(total['caller_hungup']['tenden'] == "rise"){
          document.getElementById("tenden_caller_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("tenden_caller_sla_out").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }
      }
    });

    es.addEventListener("sla_inbound", (e) => {
      var total = JSON.parse(e.data);     // parse data thành json vì data default nó là text
      if ($('#value_sla_out').length) {
          // PICKED UP CALLS
        document.getElementById("pickedup_calls_value").innerHTML = total['pickedup_calls']['value'];
        document.getElementById("pickedup_calls_rate").innerHTML = total['pickedup_calls']['rate_change'];
       
        if(total['pickedup_calls']['tenden'] == "rise"){
          document.getElementById("pickedup_calls_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("pickedup_calls_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // PICKED UP RATE
        document.getElementById("pickedup_rate_value").innerHTML = total['pickedup_rate']['value'];
        document.getElementById("pickedup_rate_rate").innerHTML = total['pickedup_rate']['rate_change'];
       
        if(total['pickedup_rate']['tenden'] == "rise"){
          document.getElementById("pickedup_rate_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("pickedup_rate_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // MISSED CALLS
        document.getElementById("missed_calls_value").innerHTML = total['missed_calls']['value'];
        document.getElementById("missed_calls_rate").innerHTML = total['missed_calls']['rate_change'];
       
        if(total['missed_calls']['tenden'] == "rise"){
          document.getElementById("missed_calls_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("missed_calls_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // AVG WAIT TIME UNTIL MISS CALL
        document.getElementById("avg_waittime_until_misscall_value").innerHTML = total['avg_waittime_until_misscall']['value'];
        document.getElementById("avg_waittime_until_misscall_rate").innerHTML = total['avg_waittime_until_misscall']['rate_change'];
       
        if(total['avg_waittime_until_misscall']['tenden'] == "rise"){
          document.getElementById("avg_waittime_until_misscall_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("avg_waittime_until_misscall_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // ABANDONED CALLS
        document.getElementById("abandoned_calls_value").innerHTML = total['abandoned_calls']['value'];
        document.getElementById("abandoned_calls_rate").innerHTML = total['abandoned_calls']['rate_change'];
       
        if(total['abandoned_calls']['tenden'] == "rise"){
          document.getElementById("abandoned_calls_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("abandoned_calls_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // AVG WAIT TIME UNTIL ABANDON
        document.getElementById("avg_waittime_ultil_abandon_value").innerHTML = total['avg_waittime_ultil_abandon']['value'];
        document.getElementById("avg_waittime_ultil_abandon_rate").innerHTML = total['avg_waittime_ultil_abandon']['rate_change'];
       
        if(total['avg_waittime_ultil_abandon']['tenden'] == "rise"){
          document.getElementById("avg_waittime_ultil_abandon_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("avg_waittime_ultil_abandon_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // TALKED TIME
        document.getElementById("talkedtime_value").innerHTML = total['talkedtime']['value'];
        document.getElementById("talkedtime_rate").innerHTML = total['talkedtime']['rate_change'];
       
        if(total['talkedtime']['tenden'] == "rise"){
          document.getElementById("talkedtime_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("talkedtime_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }

        // AVG TALKED TIME
        document.getElementById("avg_talkedtime_value").innerHTML = total['avg_talkedtime']['value'];
        document.getElementById("avg_talkedtime_rate").innerHTML = total['avg_talkedtime']['rate_change'];
       
        if(total['avg_talkedtime']['tenden'] == "rise"){
          document.getElementById("avg_talkedtime_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-up text-success"></i>';
        }else{
          document.getElementById("avg_talkedtime_tenden").innerHTML = '<i id="tenden" class="feather icon-arrow-down text-danger"></i>';
        }
      
      }
      
    });
    
    // Recent Calls
     es.addEventListener("recent_calls", (e) => {
      var total = JSON.parse(e.data);     // parse data thành json vì data default nó là text
      var content ='';
      var callin ='';
      var bullet ='';
      $.each( total, function( key, value ) {
        if(value.disposition == "Answered"){
          callin = '<img src="'+ base_url +'public/images/dashboard/call-in-success.svg">';
          bullet = '<span class="bullet bullet-success bullet-xs"></span>';
        }else{
          callin = '<img src="'+ base_url +'public/images/dashboard/call-out-fail.svg">';
          bullet = '<span class="bullet bullet-light bullet-xs"></span>'; 
        }

        content +='<li class="list-group-item">'
          +'<div class="row">'
          +'<div class="col-5" id="dst">'+ value.dst +'</div>'
          +'<div class="col-5" id="src">'+ value.src +'</div>'
          +'<div class="col-2"><small  id="duration">'+ value.duration +'</small></div>'
          +'</div>'
          +'<div class="row">'
          +'<div class="col-1">'+ bullet +'</div>'
          +'<div class="col-9">'
          +'<span class="chip-text font-small-1" id="calldate">'+ value.calldate +'</span>'
          +'</div>'
          +'<div class="col-2">'+ callin +'</div>'
          +'</div>'
          +'</li>';
      });
      $("#list_recent_calls").html(
          content
      ); 
    
    });
    // Some code.....
  } else { 
    // Sorry! No server-sent events support..
  }