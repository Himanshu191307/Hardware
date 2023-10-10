function readConfig(id) {
  function unescape(html) {
    return String(html)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&#x2F;/g, '/')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
  }
  // Older browsers that don't support CSP or JSON.parse can use new Function
  var rvalidchars = /^[\],:{}\s]*$/;
  var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
  var elem = document.getElementById(id);
  if (!elem) return null;
  // We'd prefer innerText, but old IEs don't give us innerText for script elems :/
  var text = unescape((elem.textContent || elem.innerHTML).replace(/^\s+|\s+$/gm,''));
  if ( rvalidchars.test(text.replace(rvalidescape, '@')
                  .replace(rvalidtokens, ']')
                  .replace(rvalidbraces, '')) ) {

    // Try to use the native JSON parser first
    return window.JSON && window.JSON.parse ?
      window.JSON.parse(text) :
      (new Function('return ' + text))();
  }
}

// Utility functions
var Strut = {

  // Random float between min and max
  random: function(min, max) {
    return Math.random() *  (max - min) + min;
  },
  arrayRandom: function(arr) {
    return arr[ Math.floor( Math.random() * arr.length ) ];
  },
  interpolate: function(a, b, i) {
    return a*(1-i) + b*i;
  },
  rangePosition: function(a, b, i) {
    return (i-a) / (b-a);
  },
  clamp: function(num, min, max) {
    return Math.max( Math.min( num, max ), min );
  },
  queryArray: function(selector, node) {
    if (!node) node = document.body;
    return Array.prototype.slice.call(node.querySelectorAll(selector));
  },

  ready: function(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  },


  throttle: function(callback, wait, context) {
    var c = context || this;
    var timeout = null;
    var callbackArgs = null;

    var later = function() {
      callback.apply(c, callbackArgs);
      timeout = null;
    }

    return function() {
      if (!timeout) {
        callbackArgs = arguments;
        timeout = setTimeout(later, wait);
      }
    }
  }

};
Strut.supports = {
  es6: !!window.Symbol && !!window.Symbol.species,
  pointerEvents: (function() {
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    return style.pointerEvents === 'auto';
  })(),
  positionSticky: Boolean(window.CSS && CSS.supports("(position: -webkit-sticky) or (position: sticky)")),
  masks: (function() {
    return !(/MSIE|Trident|Edge/i.test(navigator.userAgent))
  })(),

};
function globalNavDropdowns(selector) {
  var self = this;
  this.container = document.querySelector(selector)
  this.root = this.container.querySelector('.navRoot');
  this.primaryNav = this.root.querySelector('.navSection.primary');
  this.primaryNavItem = this.root.querySelector('.navSection.primary .rootLink:last-child');
  this.secondaryNavItem = this.root.querySelector('.navSection.primary .rootLink:last-child');
  this.checkCollision();
  window.addEventListener('load', this.checkCollision.bind(this));
  window.addEventListener('resize', this.checkCollision.bind(this));
  this.container.classList.add('noDropdownTransition');
  this.dropdownBackground = this.container.querySelector('.dropdownBackground');
  this.dropdownBackgroundAlt = this.container.querySelector('.alternateBackground');
  this.dropdownRoot = this.container.querySelector('.dropdownRoot');
  this.dropdownContainer = this.container.querySelector('.dropdownContainer');
  this.dropdownArrow = this.container.querySelector('.dropdownArrow');
  this.dropdownRoots = Strut.queryArray('.hasDropdown', this.root);
  this.dropdownSections = Strut.queryArray('.dropdownSection', this.container).map(function(section){
    return {
      el: section,
      name: section.getAttribute('data-dropdown'),
      content: section.querySelector('.dropdownContent')
    }
  });
  var events = window.PointerEvent ? {
    end: 'pointerup',
    enter: 'pointerenter',
    leave: 'pointerleave'
  } : {
    end: 'touchend',
    enter: 'mouseenter',
    leave: 'mouseleave'
  };

  this.keyDownHandler = null;

  // Root menu items
  this.dropdownRoots.forEach(function(rootEl, i) {

    rootEl.addEventListener(events.end, function(e) {
      e.preventDefault(); // Prevent mouseenter
      e.stopPropagation(); // Stop from propagating to body
      self.toggleDropdown(rootEl);
    });

    rootEl.addEventListener('focusin', function(e) {
      self.stopCloseTimeout();
      self.openDropdown(rootEl, {keyboardNavigation: true});
    });

    rootEl.addEventListener(events.enter, function(e) {
      if (e.pointerType == 'touch') return;
      self.stopCloseTimeout();
      self.openDropdown(rootEl);
    });

    rootEl.addEventListener(events.leave, function(e) {
      if (e.pointerType == 'touch') return;
      self.startCloseTimeout();
    });

  });

  // Dropdown container

  this.dropdownContainer.addEventListener(events.end, function(e) {
    e.stopPropagation(); // Stop from propagating to body
  });

  this.dropdownContainer.addEventListener(events.enter, function(e) {
    if (e.pointerType == 'touch') return;
    self.stopCloseTimeout();
  });

  this.dropdownContainer.addEventListener(events.leave, function(e) {
    if (e.pointerType == 'touch') return;
    self.startCloseTimeout();
  });

  // Body

  document.body.addEventListener(events.end, function(e) {
    if (!Strut.touch.isDragging) self.closeDropdown();
  });

  this.container.classList.add('initialized');
}

globalNavDropdowns.prototype.checkCollision = function() {
  var self = this;

  if (Strut.isMobileViewport) return;

  if (self.compact == true) {
    var bw = document.body.clientWidth;
    var pncr = self.primaryNav.getBoundingClientRect();

    // Test if primary nav is too far to the right/off-center
    if (pncr.left + pncr.width/2 > bw/2) {
      self.container.classList.remove('compact');
      self.compact = false;
    }

  } else {
    var picr = self.primaryNavItem.getBoundingClientRect();
    var sicr = self.secondaryNavItem.getBoundingClientRect();

    // Test if primary nav overlaps secondary nav
    if (picr.right > sicr.left) {
      self.container.classList.add('compact');
      self.compact = true;
    }
  }
}

globalNavDropdowns.prototype.registerArrowKeyNavigation = function(rootEl, dropdownEl) {
  var self = this;

  if (this.keyDownHandler !== null) {
    this.unregisterArrowKeyNavigation();
  }

  var dropdownElements = [].slice.call(dropdownEl.querySelectorAll("a"));
  var keyboardCursorPos = 0;
  dropdownElements[keyboardCursorPos].focus();

  this.keyDownHandler = function(e) {
    var TAB = 9;
    var ARROW_UP = 38;
    var ARROW_DOWN = 40;

    if (e.keyCode === TAB) {
      // Focus the top-level navigation item again to enable navigation between tabs
      rootEl.focus();
      self.startCloseTimeout();
    } else if (e.keyCode === ARROW_UP) {
      // Prevent scrolling
      e.preventDefault();

      keyboardCursorPos--;
      if (keyboardCursorPos < 0) {
        keyboardCursorPos += dropdownElements.length
      }

      dropdownElements[keyboardCursorPos].focus();
    } else if (e.keyCode === ARROW_DOWN) {
      // Prevent scrolling
      e.preventDefault();

      keyboardCursorPos++;
      if (keyboardCursorPos >= dropdownElements.length) {
        keyboardCursorPos -= dropdownElements.length;
      }

      dropdownElements[keyboardCursorPos].focus();
    }
  };

  this.container.addEventListener("keydown", this.keyDownHandler);
}

globalNavDropdowns.prototype.unregisterArrowKeyNavigation = function() {
  this.container.removeEventListener("keydown", this.keyDownHandler);
  this.keyDownHandler = null;
}

globalNavDropdowns.prototype.openDropdown = function(rootEl, options) {
  var self = this;

  if (this.activeDropdown === rootEl) return;

  this.container.classList.add('overlayActive');
  this.container.classList.add('dropdownActive');
  this.activeDropdown = rootEl;
  this.activeDropdown.setAttribute('aria-expanded', 'true');

  // Highlight menu item

  this.dropdownRoots.forEach(function(rootEl, i) {
    rootEl.classList.remove('active');
  });

  rootEl.classList.add('active');

  // Show correct section

  var dropdownName = rootEl.getAttribute('data-dropdown');
  var className = 'left';
  var ddWidth, ddHeight;
  var activeContent;

  this.dropdownSections.forEach(function(section){
    section.el.classList.remove('active');
    section.el.classList.remove('left');
    section.el.classList.remove('right');

    if (section.name == dropdownName) {
      section.el.setAttribute('aria-hidden', 'false');
      section.el.classList.add('active');
      className = 'right';
      ddWidth = section.content.offsetWidth;
      ddHeight = section.content.offsetHeight;
      if (!section.content.getAttribute('data-fixed')) {
        // Prevents reflow of the dropdown content
        section.content.style.width = ddWidth + 'px';
        section.content.style.height = ddHeight + 'px';
      } else {
        section.content.setAttribute('data-fixed', true);
      }
      activeContent = section.content;

      if (options && options.keyboardNavigation) {
        self.registerArrowKeyNavigation(rootEl, section.el);
      }
    } else {
      section.el.classList.add(className);
      section.el.setAttribute('aria-hidden', 'true');
    }
  });

  // Move dropdown container

  var origWidth = 380;
  var origHeight = 400;

  var scaleX = ddWidth / origWidth;
  var scaleY = ddHeight / origHeight;

  var rootLinkRect = rootEl.getBoundingClientRect();
  var ddLeft = rootLinkRect.left + rootLinkRect.width/2 - ddWidth/2;
  ddLeft = Math.round(Math.max(ddLeft, 10));

  clearTimeout(this.disableTransitionTimeout);

  this.enableTransitionTimeout = setTimeout(function(){
    self.container.classList.remove('noDropdownTransition');
  }, 50);

  this.dropdownBackground.style.transform = 'translateX(' + ddLeft + 'px) scaleX(' + scaleX + ') scaleY(' + scaleY + ')';

  this.dropdownContainer.style.transform = 'translateX(' + ddLeft + 'px)';
  this.dropdownContainer.style.width = ddWidth + 'px';
  this.dropdownContainer.style.height = ddHeight + 'px';

  // Move arrow

  var arrLeft = Math.round(rootLinkRect.left + rootLinkRect.width/2);
  this.dropdownArrow.style.transform = 'translateX(' + arrLeft + 'px) rotate(45deg)';

  // Move alternating background

  var bgOffset = activeContent.children[0].offsetHeight / scaleY;
  this.dropdownBackgroundAlt.style.transform = 'translateY(' + bgOffset + 'px)'

  if(window.siteAnalytics && window.siteAnalytics.trackGlobalNavDropdownOpen) {
    window.siteAnalytics.trackGlobalNavDropdownOpen(dropdownName);
  }
}

globalNavDropdowns.prototype.closeDropdown = function() {
  var self = this;

  if (!this.activeDropdown) return;

  this.dropdownRoots.forEach(function(rootEl, i) {
    rootEl.classList.remove('active');
  });

  this.dropdownContainer
    .querySelector('[aria-hidden="false"]')
    .setAttribute('aria-hidden', 'true');

  // Disable transitions for the next time a dropdown opens

  clearTimeout(this.enableTransitionTimeout);

  this.disableTransitionTimeout = setTimeout(function(){
    self.container.classList.add('noDropdownTransition');
  }, 50);

  // Hide dropdown

  this.container.classList.remove('overlayActive');
  this.container.classList.remove('dropdownActive');
  this.activeDropdown.setAttribute('aria-expanded', 'false');
  this.activeDropdown = undefined;

  this.unregisterArrowKeyNavigation();
}

globalNavDropdowns.prototype.toggleDropdown = function(rootEl) {
  if (this.activeDropdown === rootEl) this.closeDropdown();
  else this.openDropdown(rootEl);
}

globalNavDropdowns.prototype.startCloseTimeout = function() {
  var self = this;

  self.closeDropdownTimeout = setTimeout(function(){
    self.closeDropdown();
  }, 50);
}

globalNavDropdowns.prototype.stopCloseTimeout = function() {
  var self = this;

  clearTimeout(self.closeDropdownTimeout);
}
function globalNavPopup(selector) {
  var self = this;

  var clickEvent = Strut.touch.isSupported ? "touchend" : "click";
  this.activeClass = 'globalPopupActive';

  this.root = document.querySelector(selector);
  this.link = this.root.querySelector('.rootLink');
  this.popup = this.root.querySelector('.popup');
  this.closeButton = this.root.querySelector('.popupCloseButton');

  this.link.addEventListener(clickEvent, function(e) {
    e.stopPropagation();
    self.togglePopup();
  });

  this.popup.addEventListener(clickEvent, function(e) {
    e.stopPropagation();
  });

  // Push the popup down if it extends past the top of the viewport
  this.popup.addEventListener('transitionend', function(e) {
    if (self.isOpening) {
      self.isOpening = false;
      var top = self.popup.getBoundingClientRect().top + window.scrollY;
      if (top < 15) {
        var offset = 15 - top;
        self.popup.style.transform = 'translateY(' + offset + 'px)';
      }
    }
  });

  if (this.closeButton) {
    this.closeButton.addEventListener(clickEvent, function(e) {
      self.closeAllPopups();
    });
  }

  document.body.addEventListener(clickEvent, function(e) {
    if (!Strut.touch.isDragging) self.closeAllPopups();
  }, false);
}

globalNavPopup.prototype.togglePopup = function() {
  var alreadyOpen = this.root.classList.contains(this.activeClass);
  this.closeAllPopups(true);

  if (!alreadyOpen) {
    this.root.classList.add(this.activeClass);
    this.isOpening = true;
    // document.documentElement.classList.add('popupActive');
  }
}

globalNavPopup.prototype.closeAllPopups = function(keep) {
  var popupRoots = document.getElementsByClassName(this.activeClass);
  for (var i = 0; i < popupRoots.length; i++) {
    popupRoots[i].querySelector('.popup').style.transform = null;
    popupRoots[i].classList.remove(this.activeClass);
  }
  // document.documentElement.classList.remove('popupActive');
}
Strut.ready(function(){
  new globalNavDropdowns('.globalNav');
  new globalNavPopup('.globalNav .navSection.mobile');
  new globalNavPopup('.globalFooterNav .select.country');
  new globalNavPopup('.globalFooterNav .select.language');
  document.body.addEventListener('keydown', function(e) {
    var TAB = 9;
    if (e.keyCode == TAB) document.body.classList.add('keyboard-navigation');
  });

  document.body.addEventListener('click', function(e) {
    document.body.classList.remove('keyboard-navigation');
  });
});



