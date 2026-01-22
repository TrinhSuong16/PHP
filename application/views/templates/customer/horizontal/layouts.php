
<!DOCTYPE html>
<html class="loading" lang="{lang_code}" data-textdirection="ltr">
<!-- BEGIN: Head-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
    <meta name="author" content="southtelecom.vn">
    <meta name="base_url" content="{base_url}">
    <meta name="csrf" content="{token_name}:{token_value}" />
    <title>{title}</title>
    <link rel="apple-touch-icon" href="{base_url}public/images/ico/apple-icon-120.png">
    <link rel="shortcut icon" type="image/x-icon" href="{base_url}public/images/ico/favicon.ico">
    <!-- <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600" rel="stylesheet"> -->
    
   <?php
        echo dequeue_styles('employee');
        echo dequeue_scripts('employee');
    ?>
    
    
</head>
<!-- END: Head-->

<!-- BEGIN: Body-->

<body class="horizontal-layout horizontal-menu 2-columns navbar-floating footer-static menu-expanded pace-done" data-open="hover" data-menu="horizontal-menu" data-col="2-columns" data-shepherd-step="step-1">
    <!-- BEGIN: Custom menucontext-->
    <div class="menu-right-click">
		<ul class="contextmenu">
			<li class="contextmenu-copy"><a href="javascript:void(0)" onclick="pbx.copyContext(this);"><i class="fa fa-copy"></i> Copy</a></li>
			<li class="contextmenu-paste" style="display:none"><a href="javascript:void(0)" onclick="pbx.pasteContext();"><i class="fa fa-file-text-o"></i> Paste</a></li>
		</ul>
	</div>
    <!-- END: Custom menucontext-->
    <!-- BEGIN: Header-->
    <?php $this->load->view('templates/customer/horizontal/bodyheader'); ?>
    <!-- END: Header-->

    <!-- BEGIN: Main Menu-->
    <?php $this->load->view('templates/customer/horizontal/mainmenu'); ?>
    <!-- END: Main Menu-->
    
    
    <!-- BEGIN: Content-->
    
    
    <?php 
        isset($contents) ? $this->load->view($contents) : null; 
    ?>
    <!-- END: Content-->

    <div class="sidenav-overlay"></div>
    <div class="drag-target"></div>

    <!-- BEGIN: Footer-->
    <footer class="footer footer-static footer-light navbar-shadow">
        <div class="row clearfix blue-grey lighten-2 mb-0">
            <div class="col-12 float-md-left d-block d-md-inline-block mt-50">
                <span class="powered">
                    <a href="https://southtelecom.vn/" target="_blank"><img src="{base_url}public/images/logo/logo.svg"  style="width: 200px"></a>
                   <span style="vertical-align: -webkit-baseline-middle;">| Powered by South Telecom JSC</span>
                </span>
            </div>
        </div>
    </footer>
    <!-- END: Footer-->
    
    <?php
        echo dequeue_styles_footer('employee');
        echo dequeue_scripts_footer('employee');
    ?>
   
</body>
<!-- END: Body-->

</html>