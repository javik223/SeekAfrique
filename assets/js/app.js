$(document).ready(function load() {
  var t = new TimelineMax({
    pause: true,
    yoyo: true
  });

  // Animate map
  t.set(".map", {
    autoAlpha: 1
  });
  t.staggerFrom(".map path", 2, {
    drawSVG: 0,
  }, 0.1);

  // Animate SeekAfrique logo
  t.fromTo(".logo", 1, {
    // autoAlpha: 0/
    yPercent: 100,
  }, {
    autoAlpha: 1,
    yPercent: 0,
  }, +0.3)

  t.set("h1", {
    autoAlpha: 1,
  }, "-=3");


  var wordsplits = new SplitText("h1", {
    type: "words",
    "wordsClass": "words",
  })

  var charSplits = new SplitText(".words", {
    type: "chars",
    charsClass: "characters"
  })

  t.staggerFromTo(".characters", 0.3, {
    autoAlpha: 0,
  }, {
    autoAlpha: 1,
  }, 0.03, "-=1")

  t.fromTo(".subtext", 1, {
    yPercent: 50,
  }, {
    autoAlpha: 1,
    yPercent: 0,
  })


  t.set('.flags', {
    autoAlpha: 1
  });


  t.staggerFromTo(".flags img", 1, {
    autoAlpha: 0,
    yPercent: 100,
    // xPercent: -100,
    scale: 0,
    // position: 'relative',
  }, {
    autoAlpha: 1,
    yPercent: 0,
    // xPercent: 0,
    scale: 1,
  }, 0.1)

  t.fromTo(".form", 1, {
    yPercent: 50,
  }, {
    autoAlpha: 1,
    yPercent: 0,
  })

  t.fromTo(".small", 1, {
    yPercent: 50,
  }, {
    autoAlpha: 1,
    yPercent: 0,
  })

  t.fromTo(".links", 1, {
    yPercent: 50,
  }, {
    autoAlpha: 1,
    yPercent: 0,
  })

  t.to(".map path", 2, {
    drawSVG: 0,
    fill: 'inherit',
    opacity: 0.5
  })



  t.play();

  $('.js-countries').selectize();
  $('.js-language').selectize({
    onChange: function (value) {
      // console.log(value);
      location.href = value;
    },
    options: [{
      "image": "united-kingdom",
      "title": "English"
    }, {
      "image": "france",
      "title": "Francais"
    }, ],
    create: false,
    render: {
      option: function (item, escape) {
        return `<div class="language-dropdown">
          <span><img src="/assets/img/flags/${item.image}.svg" width="16"></span>
          <span>${item.title}</span>
        </div>`
      }
    }
  });



  // $(".js-form").on('submit', function (e) {

  //   e.preventDefault();
  // })
  const $jsForm = $(".js-form").parsley();

  $jsForm.on('form:validate', function (formInstance) {
    if (formInstance.isValid()) {
      $.ajax({
          url: "/process",
          method: 'POST',
          headers: {
            'CSRF-Token': $('.csrftoken').val()
          },
          data: {
            name: $('.form-name').val(),
            email: $('.form-email').val(),
            nationality: $('.form-nationality').val()
          }
        })
        .done(data => {
          if (!data.success) {
            $('.form__message').addClass('error');
          } else {
            $('.form__message').removeClass('error');
          }
          $(".form__message__content").html(data.message)
          messageBox.show()
          setTimeout(() => {
            messageBox.hide()
          }, 5000);
        })
    }

    return false;
  })

  Parsley.on('form:submit', function () {
    return false;
  })

  /**
   * // Messagebox displays the success or error message box
   * The content of the box is replaced by the attendant action.
   * This only controls the visibility of the box
   // through animation
   *
   * @param {*} elem is a string of the dom node or class
   */

  const messageBox = new ToggledElem(".form__message")

  $('.js-close-form').on('click', function () {
    messageBox.hide()
  });

});

function ToggledElem(elem) {
  const timeline = new TimelineMax({
    yoyo: true,
    paused: true
  })
  timeline.fromTo(elem, 0.6, {
    autoAlpha: 0,
    yPercent: 20,
    ease: Back.easeOut
  }, {
    autoAlpha: 1,
    yPercent: 0,
    ease: Back.easeOut
  })

  function show() {
    timeline.timeScale(1).play();
  }

  function hide() {
    timeline.timeScale(2).reverse()
  }

  return {
    show,
    hide
  }

}