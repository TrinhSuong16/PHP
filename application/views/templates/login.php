<!DOCTYPE html>
<html class="loading" lang="{lang_code}" data-textdirection="ltr">
<!-- BEGIN: Head-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="base_url" content="{base_url}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
    <meta name="author" content="southtelecom.vn">
    <title>{title}</title>
    <link rel="shortcut icon" type="image/x-icon" href="{base_url}public/images/ico/favicon.ico">
    <!-- BEGIN: Vendor CSS-->
    <link rel="stylesheet" type="text/css" href="{base_url}public/vendors/css/vendors.min.css">
    <!-- END: Vendor CSS-->

    <!-- BEGIN: Theme CSS-->
    <link rel="stylesheet" type="text/css" href="{base_url}public/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="{base_url}public/css/bootstrap-extended.min.css">
    <link rel="stylesheet" type="text/css" href="{base_url}public/css/components.min.css">

    <!-- BEGIN: Custom CSS-->
	<link rel="stylesheet" type="text/css" href="{base_url}private/css/login.min.css">
    <!-- END: Custom CSS-->
</head>
<!-- END: Head-->

<!-- BEGIN: Body-->
<body class="bg-full-screen-image blank-page">
	<!-- BEGIN: Content-->
    <div id="space-js">
        <div class="app-content content">
            <div class="content-wrapper">
                <div class="content-body">
                    <section class="row flexbox-container">
                        <div class="col-xl-8 col-11 d-flex justify-content-center">
                            <div class="rounded-0 mb-0">
                                <div class="row m-0">
                                    <div class="col-lg-5 offset-1 d-lg-block d-none text-center align-self-center px-1 py-0" style="border-right: solid 1px #ffffff61;">
                                        <img class="cloud1" src="{base_url}public/images/pages/cloud1.png" alt="branding logo">
                                        <img class="img-pbx" alt="branding logo" style=";">
                                        <img class="cloud2" src="{base_url}public/images/pages/cloud2.png" alt="branding logo">
                                    </div>
                                    <div class="col-lg-6 col-12 p-0">
                                        <div class="card rounded-0 mb-0 px-2">
                                            <div class="card-header pb-2" style="border-bottom: none">
                                                <div class="card-title text-center">
                                                    <img src="{base_url}public/images/pages/worldfonepbx.png" alt="branding logo" style="max-width: 87%">
                                                </div>
                                            </div>
                                            <div class="card-content">
                                                <div class="card-body pt-1">
                                                    {form_open(, onsubmit="return false" id="frmLogin")}
                                                        <fieldset class="form-label-group form-group position-relative has-icon-left">
                                                            <input type="text" name="username" class="form-control" id="user-name" placeholder="{username}" >
                                                            <div class="form-control-position">
                                                                <i class="feather icon-user"></i>
                                                            </div>
                                                            <label for="user-name">{username}</label>
                                                        </fieldset>

                                                        <fieldset class="form-label-group position-relative has-icon-left">
                                                            <input type="password" name="password" class="form-control" id="user-password" placeholder="{password}" >
                                                            <div class="form-control-position">
                                                                <i class="feather icon-lock"></i>
                                                            </div>
                                                            <label for="user-password">{password}</label>
                                                        </fieldset>
                                                        <fieldset class="form-label-group position-relative has-icon-left">
															<input type="text" name="captcha" class="form-control" id="user-captcha" placeholder="{captcha}" >
                                                            <div class="form-control-position">
                                                                <i class="fa fa-refresh"></i>
                                                            </div>
                                                            <label for="user-captcha">{captcha}</label>
															<p class="ql-align-center text-center"><img id="captcha" src="{base_url}account/captcha?ver={time}" title="{click_to_change_captcha}" /></p>
                                                        </fieldset>
                                                        <!-- <a href="auth-register.html" class="btn btn-outline-primary float-left btn-inline">Register</a> -->
                                                        <div class="form-group d-flex justify-content-center align-items-center">
                                                            <button type="submit" name="btn_login" class="btn btn-login">{login}</button>
                                                        </div>
                                                    {form_close()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <footer class="footer">
                    <div class="row">
                        <div class="col-sm-12 col-md-4">
                            <span class="powered">
                                <a href="https://southtelecom.vn/" target="_blank"><img src="{base_url}public/images/logo/logo-Southtelecom-01.png"></a>
                                <span style="vertical-align: -webkit-baseline-middle;">| Powered by South Telecom JSC</span>
                            </span>
                        </div>
                        <div class="col-sm-12 col-md-4 text-center responsive-on-top">
                            <span class="lang">
                                <a href="javascript:void(0)" <?php if(empty($userdata["lang"]) || $userdata["lang"] == "vietnamese") { echo 'class="active"'; } else { echo "onclick='javascript:changeLanguage(\"vietnamese\")'"; } ?>>{vietnamese}</a> | <a href="javascript:void(0)" <?php if(!empty($userdata["lang"]) && $userdata["lang"] == "english") { echo 'class="active"'; } else { echo "onclick='javascript:changeLanguage(\"english\")'"; } ?>>{english}</a>
                            </span>
                        </div>
                        <div class="col-sm-12 col-md-4 d-none d-sm-block responsive-on-middle">
                            <ul class="theme-color">
                                <li class="item-color">
                                    <p class="text-center"><img src="{base_url}public/images/icons/icon-venus.png"> {theme.metal}</p>
                                    <span class="color-yellow">
                                        <button class="yellow" onclick="toggleTheme('yellow');"></button>
                                    </span>
                                    <span class="color-gray">
                                        <button class="gray" onclick="toggleTheme('gray');"></button>
                                    </span>
                                </li>
                                <li class="item-color">
                                    <p class="text-center"><img src="{base_url}public/images/icons/icon-jupiter.png"> {theme.wood}</p>
                                    <span class="color-green">
                                        <button class="green" onclick="toggleTheme('green');"></button>
                                    </span>
                                    <span class="color-mint">
                                        <button class="mint" onclick="toggleTheme('mint');"></button>
                                    </span>
                                </li>
                                <li class="item-color">
                                    <p class="text-center"><img src="{base_url}public/images/icons/icon-mercury.png"> {theme.warter}</p>
                                    <span class="color-sapphire">
                                        <button class="sapphire" onclick="toggleTheme('sapphire');"></button>
                                    </span>
                                    <span class="color-blue">
                                        <button class="blue" onclick="toggleTheme('blue');"></button>
                                    </span>
                                </li>
                                <li class="item-color">
                                    <p class="text-center"><img src="{base_url}public/images/icons/icon-mars.png"> {theme.fire}</p>
                                    <span class="color-red">
                                        <button class="red" onclick="toggleTheme('red');"></button>
                                    </span>
                                    <span class="color-pink">
                                        <button class="pink" onclick="toggleTheme('pink');"></button>
                                    </span>
                                </li>
                                <li class="item-color">
                                    <p class="text-center"><img src="{base_url}public/images/icons/icon-saturn.png"> {theme.earth}</p>
                                    <span class="color-orange">
                                        <button class="orange" onclick="toggleTheme('orange');"></button>
                                    </span>
                                    <span class="color-brown">
                                        <button class="brown" onclick="toggleTheme('brown');"></button>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade text-left" id="model-alert-login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel160" data-backdrop="false" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header d-flex justify-content-center">
                    <h5 class="modal-title" id="model-alert-login-title">{login_alert_title}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body text-center"></div>
                <div class="modal-footer d-flex justify-content-center">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">{login_alert_button_confirm}</button>
                </div>
            </div>
        </div>
    </div>
    <!-- END: Content-->
    <!-- BEGIN: Vendor JS-->
    <script src="{base_url}public/vendors/js/jquery-3.6.0.min.js"></script>
    <script src="{base_url}public/js/core/libraries/bootstrap.min.js"></script>
    <!-- BEGIN Vendor JS-->
    <!-- BEGIN: Page Vendor JS-->
    <!-- END: Page Vendor JS-->
    <!-- BEGIN: Theme JS-->
    <script src="{base_url}public/js/scripts/particles.min.js"></script>
    <script src="{base_url}public/js/pbx/login.min.js"></script>
    <!-- END: Theme JS-->
    <!-- BEGIN: Page JS-->
    <!-- END: Page JS-->
</body>
<!-- END: Body-->
</html>