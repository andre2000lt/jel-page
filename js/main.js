'use strict';

(function () {
  var buttons = document.querySelectorAll('.js-accordion-button');
  if (buttons) {
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var nextElement = button.nextElementSibling;
        var buttonClass = button.className.split(' ')[0];
        var nextElementClass = nextElement.className.split(' ')[0];
        var activeClass = buttonClass + '--active';
        var visibleClass = nextElementClass + '--visible';

        button.classList.toggle(activeClass);
        nextElement.classList.toggle(visibleClass);
      });
    });
  }

})();

'use strict';

(function () {
  var body = document.querySelector('body');
  var burger = document.querySelector('.burger');
  var headerNav = document.querySelector('.header__nav');
  var logo = document.querySelector('.header__logo');
  var cart = document.querySelector('.header__cart');
  var headerTop = document.querySelector('.header__top');

  if (burger && headerNav) {
    headerNav.classList.add('header__nav--hidden');
    headerNav.classList.add('header__nav--fullscreen');

    burger.addEventListener('click', function () {
      headerNav.classList.toggle('header__nav--hidden');
      burger.classList.toggle('burger--white');

      if (logo) {
        logo.classList.toggle('header__logo--white');
      }

      if (cart) {
        cart.classList.toggle('header__cart--white');
      }

      if (headerTop) {
        headerTop.classList.toggle('header__top--brown');
      }

      body.classList.toggle('modal-opened');
    });
  }
})();

// Валидация формы
'use strict';

(function () {

  // pattern - 'lengthReq, bigLettersReq, digitsReq, specialsReq'
  var countPasswordSymbols = function (password, lang, pattern) {
    var validSymbols = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM123456789!@#$%^&*()_-+=\|/.,:;[]{}';
    // var smallLetters = 'qwertyuiopasdfghjklzxcvbnm'; // Буквы в нижнем регистре
    var bigLetters = 'QWERTYUIOPLKJHGFDSAZXCVBNM'; // Буквы в верхнем регистре
    var digits = '0123456789'; // Цифр
    var specials = '!@#$%^&*()_-+=\|/.,:;[]{}';

    var lengthReq = 7;
    var bigLettersReq = 2;
    var digitsReq = 1;
    var specialsReq = 1;

    if (pattern) {
      pattern = pattern.replace(/\s+/g, '');
      var patternArr = pattern.split(',');

      lengthReq = patternArr[0];
      bigLettersReq = patternArr[1];
      digitsReq = patternArr[2];
      specialsReq = patternArr[3];
    }

    var check = {
      illegalMessage: {
        'ru': ['Только латинские буквы, цифры и спецсимволы: !@#$%^&*()_-+=\|/.,:;[]{}'],
        'en': ['Only Latin letters, numbers and special characters:! @ # $% ^ & * () _- + = \ | /.,:; [] {}']
      },
      tooShortMessage: {
        'ru': ['Не меньше ' + lengthReq + ' символов'],
        'en': ['At least ' + lengthReq + ' characters']
      },
      minBigLettersMessage: {
        'ru': ['Не меньше 1 заглавной буквы', 'Не меньше ' + bigLettersReq + ' заглавных букв'],
        'en': ['At least 1 capital letter', 'At least ' + bigLettersReq + ' capital letters']
      },
      minDigitsMessage: {
        'ru': ['Не меньше 1 цифры', 'Не меньше ' + digitsReq + ' цифр'],
        'en': ['At least 1 digit', 'At least ' + digitsReq + ' digits']
      },
      minSpecialsMessage: {
        'ru': ['Не меньше 1 спецсимвола', 'Не меньше ' + specialsReq + ' спецсимволов'],
        'en': ['At least 1 special character', 'At least ' + specialsReq + ' special character']
      }
    };

    var symbolsCount = 0;
    var bigLettersCount = 0;
    var digitsCount = 0;
    var specialsCount = 0;

    for (var i = 0; i < password.length; i++) {
      var symbol = password[i];

      if (!(validSymbols.indexOf(symbol) + 1)) {
        return check.illegalMessage[lang][0];
      }

      if (bigLetters.indexOf(symbol) + 1) {
        bigLettersCount++;
      } else if (digits.indexOf(symbol) + 1) {
        digitsCount++;
      } else if (specials.indexOf(symbol) + 1) {
        specialsCount++;
      }

      symbolsCount++;
    }

    if (symbolsCount < lengthReq) {
      return check.tooShortMessage[lang][0];
    }

    if (bigLettersCount < bigLettersReq) {
      if (bigLettersReq === 1) {
        return check.minBigLettersMessage[lang][0];
      } else {
        return check.minBigLettersMessage[lang][1];
      }
    }

    if (digitsCount < digitsReq) {
      if (digitsReq === 1) {
        return check.minDigitsMessage[lang][0];
      } else {
        return check.minDigitsMessage[lang][1];
      }
    }

    if (specialsCount < specialsReq) {
      if (specialsReq === 1) {
        return check.minSpecialsMessage[lang][0];
      } else {
        return check.minSpecialsMessage[lang][1];
      }
    }

    return false;
  };

  window.form = {
    checkPasssword: function (field, lang) {
      var pass = field.value;
      var pattern = (field.hasAttribute('data-pass-pattern')) ? field.dataset.passPattern : '';
      var messageLang = (lang) ? lang : 'en';

      var message = countPasswordSymbols(pass, messageLang, pattern);
      if (message) {
        field.setCustomValidity(message);
      } else {
        field.setCustomValidity('');
      }
    }
  };

  var fields = document.querySelectorAll('[required]');

  fields.forEach(function (field) {
    // Проверяем поля паролей c атрибутом 'data-pass-pattern'
    if (field.hasAttribute('data-pass-pattern')) {
      field.addEventListener('input', function () {
        window.form.checkPasssword(field, 'ru');
      });
    }

    field.addEventListener('blur', function () {
      if ((field.value.length !== 0) && (!field.checkValidity())) {
        field.classList.add('invalid-field');
      } else {
        field.classList.remove('invalid-field');
      }
    });

    field.addEventListener('focus', function () {
      field.classList.remove('invalid-field');
    });
  });
})();

// LOCALE STORAGE
'use strict';

(function () {
  window.storage = {
    getValue: function (field, itemName) {
      var isStorageSupport = true;
      var storageItem = '';

      try {
        storageItem = localStorage.getItem(itemName);
      } catch (err) {
        isStorageSupport = false;
      }

      if (isStorageSupport) {
        field.value = storageItem;
      }
    },

    saveValue: function (field, itemName) {
      localStorage.setItem(itemName, field.value);
    }
  };

  var forms = document.querySelectorAll('form');

  forms.forEach(function (form) {
    var fields = form.querySelectorAll('[data-local-stor]');

    if (fields) {
      fields.forEach(function (field) {
        var itemName = field.dataset.localStor;
        window.storage.getValue(field, itemName);
      });

      form.addEventListener('submit', function () {
        fields.forEach(function (field) {
          var itemName = field.dataset.localStor;
          window.storage.saveValue(field, itemName);
        });
      });
    }
  });
})();

'use strict';

(function () {
  var faqQuestions = document.querySelectorAll('.faq__question');
  if (faqQuestions) {
    faqQuestions.forEach(function (question, i) {
      var closedAreas = [1, 2, 3];
      if (closedAreas.indexOf(i) !== -1) {
        question.classList.remove('faq__question--active');
        question.nextElementSibling.classList.remove('faq__answer--visible');
      }
    });
  }

  var filterCategoryNames = document.querySelectorAll('.filter__category-name');
  if (filterCategoryNames) {
    filterCategoryNames.forEach(function (name, i) {
      var closedAreas = [1, 2];
      if (closedAreas.indexOf(i) !== -1) {
        name.classList.remove('filter__category-name--active');
        name.nextElementSibling.classList.remove('filter__category-content--visible');
      }
    });
  }
})();

'use strict';

(function () {
  var openWindowButtons = document.querySelectorAll('[data-modal-id]');
  var body = document.querySelector('body');
  var html = document.querySelector('html');
  var onModalPressTab;
  var onModalPressEsc;

  function showModal(modal) {
    modal.classList.add('modal--active');
    lockBodyOnModalOpen();

    closeFocusOnModal(modal);

    closeWindowByClick(modal);
  }

  function hideModal(modal) {
    modal.classList.remove('modal--active');
    unlockBodyOnModalClose();
    document.removeEventListener('keydown', onModalPressTab);
    document.removeEventListener('keydown', onModalPressEsc);
  }

  // Закрывает активное окно при клике на кнопки с классом js-close-window и ESC
  function closeWindowByClick(modal) {
    if (modal) {
      var onModalClick = function (evt) {
        var element = evt.target;

        if (element.classList.contains('js-close-window')) {
          hideModal(modal);
          modal.removeEventListener('click', onModalClick);
        }
      };

      onModalPressEsc = function (evt) {
        if (evt.key === 'Escape') {
          evt.preventDefault();
          hideModal(modal);
        }
      };

      modal.addEventListener('click', onModalClick);
      document.addEventListener('keydown', onModalPressEsc);
    }
  }


  // Запераем фокус в модальном окне
  function closeFocusOnModal(modal) {
    var focusSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ];

    var focusElements = modal.querySelectorAll(focusSelectors);
    // console.log(focusElements[0]);
    if (focusElements) {
      var focusedIndex = 0;
      var lastIndex = focusElements.length - 1;
      focusElements[0].focus();

      onModalPressTab = function (evt) {
        if (evt.keyCode === 9) {
          evt.preventDefault();
          // Shift + TAB
          if (evt.shiftKey) {
            if (focusedIndex > 0) {
              focusedIndex--;
            } else {
              focusedIndex = lastIndex;
            }
          } else { // TAB
            if (focusedIndex < lastIndex) {
              focusedIndex++;
            } else {
              focusedIndex = 0;
            }
          }

          focusElements[focusedIndex].focus();
        }
      };

      document.addEventListener('keydown', onModalPressTab);
    }
  } // End Of Function


  // Фиксируем страницу при открытии окна
  var lockBodyOnModalOpen = function () {
    var marginSize = window.innerWidth - html.clientWidth;
    body.classList.add('modal-opened');

    // ширина скроллбара равна разнице ширины окна и ширины документа (селектора html)
    if (marginSize) {
      html.style.marginRight = marginSize + 'px';
    }
  };

  // Снимаем фиксацию страницы при закрыкрытии окна
  var unlockBodyOnModalClose = function () {
    body.classList.remove('modal-opened');
    html.style.marginRight = '';
  };


  // При клике на любую кнопку с атрибутом data-modal-id -
  //  открываем окно с id указанным в data атрибуте кнопки
  openWindowButtons.forEach(function (elem) {
    elem.addEventListener('click', function (evt) {
      evt.preventDefault();

      var modalId = '#' + elem.dataset.modalId;
      var modal = document.querySelector(modalId);


      if (modal) {
        showModal(modal);
      }
    });
  });


})();

'use strict';

(function () {
  var swiper1 = new Swiper('.product-slider__container', {
    // Включение(необязательно) / выключение слайдера
    init: true,

    navigation: {
      nextEl: '.product-slider__button--next',
      prevEl: '.product-slider__button--prev',
    },

    // Отступ между слайдами
    spaceBetween: 30,
    // Задержка при переходе слайда
    speed: 300,

    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
    },

    breakpoints: {
      // when window width is >= 768px
      320: {
        slidesPerView: 2,
        slidesPerGroup: 2,

        pagination: {
          el: '.product-slider__pagination',
          type: 'fraction',
          renderFraction: function (currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span>' + ' of &nbsp' +
              '<span class="' + totalClass + '"></span>';
          }
        },


      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,

        pagination: {
          el: '.product-slider__pagination',
          type: 'bullets',
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          },

        },
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,

        pagination: {
          el: '.product-slider__pagination',
          type: 'bullets',
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          },

        },
      }
    }
  });
})();


(function () {

  /* Swiper
**************************************************************/
  var init = false;
  var swiper2 = Swiper;

  /* Which media query
  **************************************************************/
  function swiperMode() {
    var mobile = window.matchMedia('(min-width: 0px) and (max-width: 767px)');
    var tablet = window.matchMedia('(min-width: 768px)');

    var swiperContainer = document.querySelector('.product-card__image-wrapper');
    var swiperWrapper = document.querySelector('.product-card__image-list');
    var swiperSlides = document.querySelectorAll('.product-card__image');

    function toggleSwiperClasses() {
      if (swiperContainer) {
        swiperContainer.classList.toggle('swiper-container');
      } else {
        return false;
      }

      if (swiperWrapper) {
        swiperWrapper.classList.toggle('swiper-wrapper');
      } else {
        return false;
      }

      if (swiperSlides) {
        swiperSlides.forEach(function (slide) {
          slide.classList.toggle('swiper-slide');
        });
      } else {
        return false;
      }

      return true;
    }

    // Enable (for mobile)
    if ((mobile.matches) && (!init)) {
      if (toggleSwiperClasses()) {
        init = true;

        swiper2 = new Swiper('.product-card__image-wrapper', {
          // Включение(необязательно) / выключение слайдера
          speed: 300,

          slidesPerView: 1,
          slidesPerGroup: 1,

          pagination: {
            el: '.product-card__pagination',
            type: 'fraction',
            renderFraction: function (currentClass, totalClass) {
              return '<span class="' + currentClass + '"></span>' + ' of &nbsp' +
                '<span class="' + totalClass + '"></span>';
            }
          },
        });
      }

    } else if ((tablet.matches) && (init)) {
      if (toggleSwiperClasses()) {
        swiper2.destroy();
        init = false;
      }
    }
  }

  window.addEventListener('load', function () {
    swiperMode();
  });

  window.addEventListener('resize', function () {
    swiperMode();
  });

})();
