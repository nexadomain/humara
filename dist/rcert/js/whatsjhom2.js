/**
* Template Name: Personal - v3.0.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function ($) {
  "use strict";

  // Nav Menu
  $(document).on('click', '.nav-menu a, .mobile-nav a', function (e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var target = $(hash);
      if (target.length) {
        e.preventDefault();

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if (hash == '#header') {
          $('#header').removeClass('header-top');
          $("section").removeClass('section-show');
          if ($('body').hasClass('mobile-nav-active')) {
            $('body').removeClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
            $('.mobile-nav-overly').fadeOut();
          }
          return;
        }

        if (!$('#header').hasClass('header-top')) {
          $('#header').addClass('header-top');
          setTimeout(function () {
            $("section").removeClass('section-show');
            $(hash).addClass('section-show');

          }, 350);
        } else {
          $("section").removeClass('section-show');
          $(hash).addClass('section-show');
        }

        $('html, body').animate({
          scrollTop: 0
        }, 350);

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }

        return false;

      }
    }
  });

  // Activate/show sections on load with hash links
  if (window.location.hash) {
    var initial_nav = window.location.hash;
    if ($(initial_nav).length) {
      $('#header').addClass('header-top');
      $('.nav-menu .active, .mobile-nav .active').removeClass('active');
      $('.nav-menu, .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
      setTimeout(function () {
        $("section").removeClass('section-show');
        $(initial_nav).addClass('section-show');
      }, 350);
    }
  }

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function (e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

})(jQuery);

// Set Cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Get Cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Check Cookie
function checkCookie() {
  let code = getCookie("countryCode");
  let flag = getCookie("countryFlag");
  if (code != "" && flag != "") {
    $('#selectedFlag').html(`<span class="flag-icon flag-icon-${flag} flag-icon-squared"></span>`);
    $('#country-code').val(code);
  } else {
    code = '91';
    flag = 'in';
    if (code != "" && code != null && flag != "" && flag != null) {
      setCookie("countryCode", code, 365);
      setCookie("countryFlag", flag, 365);
    }
  }
}

// Check Cookie Accepted or Nor
function checkAcceptCookie() {
  let accept = getCookie("cookie-accepted");
  typeof accept === 'undefined' || !(accept == "no" || accept == "yes") ? $(".cookie-consent").show() : '';

  if (accept == "yes") serviceWorkerAct();
}

// Enable Service Worker
function serviceWorkerAct() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
}

// Uninstall Service Worker
function serviceWorkerDeact() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
}

// Accept Cookie Policy
$(".cookie-consent .allow").on("click", function () {
  setCookie("cookie-accepted", "yes", 365);
  serviceWorkerAct();
  $(".cookie-consent").hide();
});

// Reject Cookie Policy
$(".cookie-consent .reject").on("click", function () {
  setCookie("cookie-accepted", "no", 1);
  $(".cookie-consent").hide();
});

// Change Country Code
function changeCountryCode(flag, phone) {
  $('#selectedFlag').html(`<span class="flag-icon flag-icon-${flag} flag-icon-squared"></span>`);
  $('#country-code').val(phone);

  setCookie('countryFlag', flag, 365);
  setCookie('countryCode', phone, 365);
}

// Whatsapp Form Submission
$('form.whatsapp-form').submit((e) => {
  e.preventDefault();

  let myCountryCode, myPhoneNumber;

  myCountryCode = $('#country-code').val();
  myPhoneNumber = $('#phone-number').val();

  window.open(`https://api.whatsapp.com/send?phone=${myCountryCode}${myPhoneNumber}`, '_blank');
});

// Contact Form Submission
$('form.php-email-form').submit((e) => {
  e.preventDefault();

  let name, email, subject, message;
  let ourmail = 'nexadomain@gmail.com';

  name = $('.php-email-form #name').val();
  email = $('.php-email-form #email').val();
  subject = 'Jhom Contact - ' + $('.php-email-form #subject').val();
  message = $(".php-email-form #message").val();
  newMessage = message + '\n\nName: ' + name + '\nEmail: ' + email;

  window.open(`mailto:${encodeURI(ourmail)}?subject=${encodeURI(subject)}&body=${encodeURI(newMessage)}`, '_blank');
});

// Advertisement Form Submission
$('form.php-advertisement-form').submit((e) => {
  e.preventDefault();

  let subject, message;
  let ourmail = 'nexadomain@gmail.com';

  subject = 'Jhom Advertisment - ' + $('.php-advertisement-form #subject-advertisement').val();
  message = $(".php-advertisement-form #message-advertisement").val();

  window.open(`mailto:${encodeURI(ourmail)}?subject=${encodeURI(subject)}&body=${encodeURI(message)}`, '_blank');
  $('#bookModal').modal('hide');
});

// Open Book Modal Show and Fetch Plan Detail
$('#bookModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget); // Button that triggered the modal
  let plan = button.attr('data-bs-plan'); // Extract info from data-* attributes 
  $(this).find('.modal-title').text(`Advertisement - ${plan}`);
  $(this).find('.modal-body input').val(plan);
});

// Pricing Toggle Button for Daily and Weekly
$(".onoffswitch-label").click(function () {
  $(".monthly, .yearly").toggle();
});

// Generate Random Number having fixed value with digits
function random_seed(seed, digit = 1) {
  let x = Math.abs(Math.round(Math.sin(seed++) * 10 * digit));
  return x;
}

// Update Current Users Online and Weekly chats Counts
function latest_count_update() {
  let d = new Date();
  let m = d.getFullYear() + d.getMonth() + d.getDate();
  let n = d.getFullYear() + d.getHours() + d.getMinutes();

  m = random_seed(m, 1000) < 1000 ? 1000 + random_seed(m, 1000) : random_seed(m, 1000);
  n = random_seed(n, 10) < 10 ? 10 + random_seed(n, 10) : random_seed(n, 10);

  $('.weekly_count').html(m.toLocaleString());
  $('.online_count').html(n.toLocaleString());
}

$(document).ready(() => {
  checkCookie();

  // Get All ISD Codes
  $.getJSON("https://cdn.jsdelivr.net/gh/nexadomain/humara@0.0.11/dist/jhom/data/countryPhone.min.json", (data) => {
    let items = [];
    $.each(data, (_index, key) => {
      let { name, dialCode, isoCode } = key;
      let codeFlag = isoCode.toLowerCase();
      let phoneCode = dialCode.replace(/^\++/, "");

      items.push(`<li><a class="dropdown-item" href="#" onClick="changeCountryCode('${codeFlag}', '${phoneCode}');"><span class="flag-icon flag-icon-${codeFlag} flag-icon-squared"></span> ${name} (${dialCode})</a></li>`);
    });

    $('#otherCountries').html(items);
  });

  latest_count_update();
  checkAcceptCookie();
});