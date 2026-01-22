/*=========================================================================================
    File Name: pbx.js
    Description: pbx general scripts
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/
const base_url = $('meta[name=base_url]').attr('content');
const htmlEl = document.getElementsByTagName('body')[0];
var pbx = {
    init: function () {
        $.fn.serializeObject = function () {
            var csrf = $('meta[name=csrf]').attr('content').split(":"),
                o = { [csrf[0]]: csrf[1] },
                a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        (function () {
            $(document).ajaxSend(function (event, jqXHR, settings) { });
            $(document).ajaxSuccess(function (event, jqXHR, settings) {
                if (jqXHR.responseJSON != undefined) {
                    let token_name = jqXHR.responseJSON.csrf.name;
                    let token_value = jqXHR.responseJSON.csrf.value;
                    document.querySelector('meta[name="csrf"]').setAttribute("content", token_name + ":" + token_value);
                    $(document).find('input[type="hidden"]').filter('[name="' + token_name + '"]').val(token_value);
                }
            });
            $(document).ajaxComplete(function (event, jqXHR, settings) {
                if (jqXHR.responseJSON != undefined) {
                    let token_name = jqXHR.responseJSON.csrf.name;
                    let token_value = jqXHR.responseJSON.csrf.value;
                    document.querySelector('meta[name="csrf"]').setAttribute("content", token_name + ":" + token_value);
                    $(document).find('input[type="hidden"]').filter('[name="' + token_name + '"]').val(token_value);
                } else if(jqXHR.status == 403) {
                    alert('session has been redirected');
                    window.location.reload();
                }
            });
        })();
    },
    logout: function (params = false) {
        let csrf, data;
        if (!params) {
            csrf = $('meta[name=csrf]').attr('content').split(":");
            data = { [csrf[0]]: csrf[1] };
        } else {
            csrf = params.csrf;
            data = { [params.csrf.name]: params.csrf.value };
        }
        // console.log(data)
        $.ajax({
            url: base_url + "account/logout",
            type: "POST",
            data: data,
            dataType: 'json',
            success: function (response) {
                if (response.status !== 1) {
                    alert("Logout failed.");
                }
                window.location.reload();
            },
            error: function (err) {
            }
        });
    },
    loginManage: function () {
        var csrf = $('meta[name=csrf]').attr('content').split(":");
        $.ajax({
            url: base_url + "account/loginManage",
            type: "POST",
            data: { [csrf[0]]: csrf[1] },
            dataType: 'json',
            success: function (response) {
                if (response.status !== 1) {
                    alert(response.message);
                }
                window.location.reload();
            },
            error: function (err) {
            }
        });
    },
    copyContext: function () {
        document.execCommand('copy');
    },
    pasteContext: function () {
        let context = $('ul.contextmenu > li.contextmenu-copy > a').attr("context");
        document.execCommand('insertText', false, context);
    }
};
$(document).ready(function () {
    if (localStorage.getItem("theme")) {
        htmlEl.dataset.theme = localStorage.getItem("theme");
    }
});
$(window).on("load", function () {
    if (base_url.match(/(http(s)\:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\S*)?/)) {
        let copied = "", isRCInput = false
        window.addEventListener("click", e => {
            $("ul.contextmenu").hide();
        });
        // Listen for double click events
        document.addEventListener("dblclick", function () {
            if (window.getSelection) {
                copied = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                copied = document.selection.createRange().text;
            }
        }, true);
        // listen to release mouse button event
        document.addEventListener("mouseup", function (e) {
            if (window.getSelection) {
                copied = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                copied = document.selection.createRange().text;
            }
            if ($(e.target).is('input[type="text"],textarea')) {
                isRCInput = true;
            } else {
                isRCInput = false;
            }
        }, true);
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if ("" != copied || isRCInput) {
                if ("" != copied) $('ul.contextmenu > li.contextmenu-copy > a').attr("context", copied);
                if (isRCInput) {
                    $('ul.contextmenu > li.contextmenu-paste').show();
                } else {
                    $('ul.contextmenu > li.contextmenu-paste').hide();
                }
                //Get window size:
                var winWidth = $(document).width();
                var winHeight = $(document).height();
                //Get pointer position:
                var posX = e.pageX;
                var posY = e.pageY;
                //Get contextmenu size:
                var menuWidth = $("ul.contextmenu").width();
                var menuHeight = $("ul.contextmenu").height();
                //Security margin:
                var secMargin = 10;
                //Prevent page overflow:
                if (posX + menuWidth + secMargin >= winWidth
                    && posY + menuHeight + secMargin >= winHeight) {
                    //Case 1: right-bottom overflow:
                    posLeft = posX - menuWidth - secMargin + "px";
                    posTop = posY - menuHeight - secMargin + "px";
                }
                else if (posX + menuWidth + secMargin >= winWidth) {
                    //Case 2: right overflow:
                    posLeft = posX - menuWidth - secMargin + "px";
                    posTop = posY + secMargin + "px";
                }
                else if (posY + menuHeight + secMargin >= winHeight) {
                    //Case 3: bottom overflow:
                    posLeft = posX + secMargin + "px";
                    posTop = posY - menuHeight - secMargin + "px";
                }
                else {
                    //Case 4: default values:
                    posLeft = posX + secMargin + "px";
                    posTop = posY + secMargin + "px";
                };
                //Display contextmenu:
                $("ul.contextmenu").css({
                    "left": posLeft,
                    "top": posTop
                }).show();
                //Prevent browser default contextmenu.
            }
            return false;
        });
        document.onkeydown = function (e) {
            if (e.keyCode == 123) {
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
                return false;
            }
            if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
                return false;
            }
        }
    }
    pbx.init();
});


