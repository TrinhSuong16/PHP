<?php 
$module = $this->uri->segment(1, "dashboard");
$action = $this->uri->segment(2, "");
$uri = $this->uri->uri_string();
$menus = PBX_Menu_Permissions();
?>
<div class="horizontal-menu-wrapper">
    <div class="header-navbar navbar-expand-sm navbar navbar-horizontal floating-nav navbar-light navbar-without-dd-arrow navbar-shadow menu-border" role="navigation" data-menu="menu-wrapper">
        <div class="navbar-header">
            <ul class="nav navbar-nav flex-row">
                <li class="nav-item mr-auto"><a class="navbar-brand" href="{base_url}/manage/customers">
                        <div class="brand-logo"></div>
                        <h2 class="brand-text mb-0"></h2>
                    </a></li>
                <li class="nav-item nav-toggle"><a class="nav-link modern-nav-toggle pr-0" data-toggle="collapse"><i class="feather icon-x d-block d-xl-none font-medium-4 primary toggle-icon"></i><i class="toggle-icon feather icon-disc font-medium-4 d-none d-xl-block collapse-toggle-icon primary" data-ticon="icon-disc"></i></a></li>
            </ul>
        </div>
        <!-- Horizontal menu content-->
        <div class="navbar-container main-menu-content" data-menu="menu-container">
            <ul class="nav navbar-nav" id="main-menu-navigation" data-menu="menu-navigation">
                <li class="nav-item<?=($module=="dashboard")?" active":""?>">
                    <a class="nav-link" href="{base_url}">
                        <i class="feather icon-home" style="margin-right:0"></i>
                        <!-- <span data-pbx="{l_menu.dashboard}">{l_menu.dashboard}</span> -->
                    </a>
                </li>
                <?php if(isset($menus["reports"])) { ?>
                <li class="dropdown nav-item<?=($module=="reports") ? " sidebar-group-active active open":""?>" data-menu="dropdown">
                    <a class="dropdown-toggle nav-link" href="#" data-toggle="dropdown"><i class="fa fa-file-excel-o"></i><span data-pbx="{l_menu.reports.primary}">{l_menu.reports.primary}</span></a>
                    <ul class="dropdown-menu">
                        <li<?=!in_array('report_one', $menus["reports"]) ? ' class="disabled"' : (($module=="reports" && $action=="report_one") ? " class='active'":"")?>><a class="dropdown-item" href="{base_url}reports/report_one" data-toggle="dropdown" data-pbx="{l_menu.reports.report_one}"><i class="feather icon-list"></i>{l_menu.reports.report_one}</a></li>
                        <li<?=!in_array('report_two', $menus["reports"]) ? ' class="disabled"' : (($module=="reports" && $action=="report_two") ? " class='active'":"")?>><a class="dropdown-item" href="{base_url}reports/report_two" data-toggle="dropdown" data-pbx="{l_menu.reports.report_two}"><i class="feather icon-list"></i>{l_menu.reports.report_two}</a></li>
                        <li<?=!in_array('report_three', $menus["reports"]) ? ' class="disabled"' : (($module=="reports" && $action=="report_three") ? " class='active'":"")?>><a class="dropdown-item" href="{base_url}reports/report_three" data-toggle="dropdown" data-pbx="{l_menu.reports.report_three}"><i class="feather icon-list"></i>{l_menu.reports.report_three}</a></li>

                    </ul>
                </li>
                
                <?php }  ?>
                
                <?php if(isset($menus["smssent"])) { ?>
                <li class="nav-item<?=($module=="smssent")?" active":""?>">
                    <a class="nav-link" href="{base_url}index.php/smssent">
                        <i class="feather icon-credit-card"></i>
                        <span data-pbx="{l_menu.smssent}">{l_menu.smssent}</span>
                    </a>
                </li> <?php }  ?>
                
                <?php if(isset($menus["smssent_jquery_view"])) { ?>
                <li class="nav-item<?=($module=="smssent_jquery_view")?" active":""?>">
                    <a class="nav-link" href="{base_url}index.php/smssent_jquery_view">
                        <i class="feather icon-credit-card"></i>
                        <span data-pbx="{l_menu.smssent_jquery_view}">{l_menu.smssent_jquery_view}</span>
                    </a>
                </li> <?php }  ?>
                <li class="nav-item<?=($module=="home")?" active":""?>">
                    <a class="nav-link" href="{base_url}index.php/home">
                        <i class="feather icon-file-text"></i>
                        <span data-pbx="{l_menu.register_rec_doccument}">{l_menu.register_rec_doccument}</span>
                    </a>
                </li>
                <li class="nav-item<?=($module=="admin")?" active":""?>">
                    <a class="nav-link" href="{base_url}index.php/admin">
                        <i class="feather icon-file-text"></i>
                        <span data-pbx="{l_menu.view_registration_list}">{l_menu.view_registration_list}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>