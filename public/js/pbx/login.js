/*=========================================================================================
    File Name: login.min.js
    Description: pbx general scripts
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Lê Chí Đại
    Author Email: dai.le@southtelecom.vn
==========================================================================================*/
const htmlEl = document.getElementsByTagName('body')[0];
const base_url = $('meta[name=base_url]').attr('content');
const toggleTheme = (theme) => {
    localStorage.setItem("theme", theme);
    htmlEl.dataset.theme = theme;

    var selector = $('.item-color span');
    $(selector).removeClass('circle');
    $('.color-' + theme).addClass('circle');
}
const changeLanguage = (code) => {
    $.get(`${base_url}language/change`, { lang: code }, function (res) {
        if (res.status == 1) {
            window.location.reload();
        }
    });
};

$(document).ready(function () {
    if (localStorage.getItem("theme")) {
        let theme = localStorage.getItem("theme");
        htmlEl.dataset.theme = theme;
        $('.theme-color .color-' + theme).addClass('circle');
        $('.theme-color button.' + theme).addClass('active');
    } else {
        localStorage.setItem("theme", "red");
        htmlEl.dataset.theme = "red";
        $('.theme-color .color-red').addClass('circle');
        $('.theme-color button.red').addClass('active');
    }
});

$(window).on("load", function () {
    if (base_url.match(/(http(s)\:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\S*)?/)) {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
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
    // Space BG - particlesJS
    var bgndSpace = $('#space-js');
    if (bgndSpace.length) {
        particlesJS('space-js', {
            "particles": {
                "number": {
                    "value": 160,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "images/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 1,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 4,
                        "size_min": 0.3,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 600
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 250,
                        "size": 0,
                        "duration": 2,
                        "opacity": 0,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 400,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    };
});

$(document).on("click", "#captcha", function (event) {
    // $.get(`${base_url}account/captcha`, function (res) {
    //     document.getElementById("captcha").src = `${base_url}captcha/${res.image}`;
    // });
    document.getElementById("captcha").src = `${base_url}account/captcha/?ver=${Math.floor(Date.now() / 1000)}`
});

$(document).on("submit", "form", function (event) {
    event.preventDefault();
    $.ajax({
        url: $(this).attr("action"),
        type: $(this).attr("method"),
        dataType: "JSON",
        data: new FormData(this),
        processData: false,
        contentType: false,
        success: function (data, status) {
            if (status === "success" && data.status == 1) {
                window.location.href = "/";
            } else {
                document.getElementById("captcha").src = `${base_url}account/captcha?ver=${Math.floor(Date.now() / 1000)}`
                $('input[name="' + data.csrf.name + '"]').val(data.csrf.value);
                var model = $('#model-alert-login');
                model.find('.modal-body').html(data.message);
                model.modal('show');
            }
        },
        error: function (xhr, desc, err) {
            // console.log(xhr);
            // console.log(desc);
            // console.log(err);
            if(xhr.status == 403) {
                window.location.reload();
            }
        }
    });
});