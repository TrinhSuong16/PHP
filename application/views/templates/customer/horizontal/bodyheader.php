<nav class="header-navbar navbar-expand-lg navbar navbar-with-menu navbar-fixed navbar-shadow navbar-brand-center">
    <div class="navbar-header d-xl-block d-none">
        <ul class="nav navbar-nav flex-row">
            <li class="nav-item">
            	<a class="navbar-brand" href="{base_url}">
                    <div class="brand-logo"></div>
                </a>
        	</li>
        </ul>
    </div>
    <div class="navbar-wrapper">
        <div class="navbar-container content">
            <div class="navbar-collapse" id="navbar-mobile">
                <div class="mr-auto float-left bookmark-wrapper d-flex align-items-center">
                    <ul class="nav navbar-nav">
                        <li class="nav-item mobile-menu d-xl-none mr-auto"><a class="nav-link nav-menu-main menu-toggle hidden-xs" href="#"><i class="ficon feather icon-menu"></i></a></li>
                    </ul>
                    <ul class="nav navbar-nav bookmark-icons">
                        <li class="dropdown dropdown-user nav-item">
                            <span class="user-name text-bold-600">{company_name}</span>
                        </li>
                    </ul>
                </div>
                <ul class="nav navbar-nav float-right">
                    <?php if(!empty($userdata['manager'])) { ?>
                    <li class="dropdown dropdown-user nav-item">
                        <a class="dropdown-toggle nav-link dropdown-user-link" href="#" data-toggle="dropdown">
                            <div class="user-nav d-sm-flex d-none">
                                <span class="user-name text-bold-600">{manage_login_with_user}{fullname}</span>
                                <div class="badge badge-pill badge-success">{userdata.sipcloud}</div>
                            </div>
                            <span><img class="round" src="{base_url}public/images/icons/icon-user.png" alt="avatar" height="40" width="40"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="javascript:void(0)" onclick="javascript:pbx.loginManage()"><i class="fa fa-key"></i> {l_header_horizontal.back_to_manage}</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="{base_url}account/profiles"><i class="feather icon-user"></i> {l_header_horizontal.profile}</a>
                            <div class="dropdown-divider"></div><a class="dropdown-item" href="javascript:void(0)" onclick="pbx.logout()"><i class="feather icon-power"></i> {l_header_horizontal.logout}</a>
                        </div>
                    </li>
                    <?php } else { ?>
                    <li class="nav-item d-none d-lg-block"><a class="nav-link nav-link-expand"><i class="ficon feather icon-maximize"></i></a></li>
                    <li class="dropdown dropdown-user nav-item">
                        <a class="dropdown-toggle nav-link dropdown-user-link" href="#" data-toggle="dropdown">
                            <div class="user-nav d-sm-flex d-none">
                                <span class="user-name text-bold-600">{fullname}</span>
                                <span class="user-status badge badge-pill badge-success">{user_type}</span>
                            </div>
                            <span><img class="round" src="{base_url}public/images/icons/icon-user.png" alt="avatar" height="40" width="40"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a class="dropdown-item" href="{base_url}account/profiles"><i class="feather icon-user"></i> {l_header_horizontal.profile}</a>
                            <div class="dropdown-divider"></div><a class="dropdown-item" href="javascript:void(0)" onclick="pbx.logout()"><i class="feather icon-power"></i> {l_header_horizontal.logout}</a>
                        </div>
                    </li>
                    <?php } ?>
                </ul>
            </div>
        </div>
    </div>
</nav>
