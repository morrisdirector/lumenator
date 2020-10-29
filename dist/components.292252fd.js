// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"components.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CustomElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(CustomElement, _HTMLElement);

  var _super = _createSuper(CustomElement);

  function CustomElement(template) {
    var _this;

    _classCallCheck(this, CustomElement);

    _this = _super.call(this);
    _this.state = {};

    _this.attachShadow({
      mode: 'open'
    });

    _this.shadowRoot.appendChild(template.content.cloneNode(true));

    return _this;
  }

  _createClass(CustomElement, [{
    key: "isObject",
    value: function isObject(arg) {
      return (_typeof(arg) === 'object' || typeof arg === 'function' || Array.isArray(arg)) && !!arg;
    }
    /**
     * Updates the state with a new state
     * @param newState 
     */

  }, {
    key: "setState",
    value: function setState(newState) {
      var _this2 = this;

      var previousState = _objectSpread({}, this.state);

      Object.entries(newState).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        _this2.state[key] = _this2.isObject(_this2.state[key]) && _this2.isObject(value) ? _objectSpread(_objectSpread({}, _this2.state[key]), value) : value;
      });

      if (typeof this.onStateChanges === 'function') {
        this.onStateChanges(this.state, previousState);
      }
    }
    /**
     * Updates Value for form elements where ID is provided
     * @param value 
     */

  }, {
    key: "updateValue",
    value: function updateValue(value) {
      if (this.state.id) {
        this.setState(_defineProperty({}, this.state.id, value));
      }
    }
  }]);

  return CustomElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
/**
 * Alert Message Component
 */


var alertMessageTemplate = document.createElement('template');
alertMessageTemplate.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<div class=\"alert-message\">\n\t<div id=\"message\" class=\"info\">\n\t\t<span class=\"icon hidden\"></span>\n\t\t<span class=\"text\"></span>\n\t\t<button class=\"close\">x</button>\n\t</div>\n</div>\n";

var AlertMessage = /*#__PURE__*/function (_CustomElement) {
  _inherits(AlertMessage, _CustomElement);

  var _super2 = _createSuper(AlertMessage);

  function AlertMessage() {
    var _this3;

    _classCallCheck(this, AlertMessage);

    _this3 = _super2.call(this, alertMessageTemplate);

    var text = _this3.getAttribute('text');

    _this3.setState({
      text: text,
      icon: _this3.getAttribute('icon'),
      type: _this3.getAttribute('type') || 'info',
      closable: !!_this3.getAttribute('closable'),
      visible: !!text
    });

    _this3.onClose = _this3.onClose.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(AlertMessage, [{
    key: "onStateChanges",
    value: function onStateChanges(state, previousState) {
      if (!state.visible && state.text && state.text !== previousState.text) {
        this.setState({
          visible: true
        });
        return;
      }

      if (state.visible) {
        var newClass = state.closable ? "closable ".concat(state.type) : state.type;
        this.shadowRoot.querySelector('#message').className = newClass;
        this.shadowRoot.querySelector('#message span.text').innerHTML = state.text;
        this.shadowRoot.querySelector('.alert-message').className = 'alert-message';

        if (state.icon) {
          switch (state.icon) {
            case 'info':
            default:
              this.shadowRoot.querySelector('#message span.icon').innerHTML = 'i';
              break;
          }

          this.shadowRoot.querySelector('#message span.icon').className = 'icon';
        } else {
          this.shadowRoot.querySelector('#message span.icon').className = 'icon hidden';
        }
      } else {
        this.shadowRoot.querySelector('.alert-message').className = 'alert-message hidden';
      }
    }
  }, {
    key: "onClose",
    value: function onClose() {
      this.setState({
        visible: false,
        text: null
      });
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this.shadowRoot.querySelector('button').addEventListener('click', this.onClose);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.shadowRoot.querySelector('button').removeEventListener('click', this.onClose);
    }
  }]);

  return AlertMessage;
}(CustomElement);

window.customElements.define('alert-message', AlertMessage);
/**
 * Toggle Switch Component
 */

var toggleTemplate = document.createElement('template');
toggleTemplate.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<div class=\"toggle-switch on\" ontouchstart=\"return true;\">\n\t<div class=\"circle\"></div>\n</div>\n";

var ToggleSwitch = /*#__PURE__*/function (_CustomElement2) {
  _inherits(ToggleSwitch, _CustomElement2);

  var _super3 = _createSuper(ToggleSwitch);

  function ToggleSwitch() {
    var _this4;

    _classCallCheck(this, ToggleSwitch);

    _this4 = _super3.call(this, toggleTemplate);

    _this4.setState({
      state: _this4.getAttribute('state') || 'OFF',
      id: _this4.getAttribute('id')
    });

    _this4.shadowRoot.querySelector('.toggle-switch').className = "toggle-switch ".concat(_this4.state.state);
    return _this4;
  }

  _createClass(ToggleSwitch, [{
    key: "onStateChanges",
    value: function onStateChanges(state) {
      this.shadowRoot.querySelector('.toggle-switch').className = "toggle-switch ".concat(state.state);
      var onToggle = new CustomEvent('onToggle', {
        bubbles: true,
        detail: this.state
      });
      this.dispatchEvent(onToggle);
    }
  }, {
    key: "onClick",
    value: function onClick() {
      this.setState({
        state: this.state.state === 'ON' ? 'OFF' : 'ON'
      });
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this.addEventListener('click', this.onClick);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
    }
  }]);

  return ToggleSwitch;
}(CustomElement);

window.customElements.define('toggle-switch', ToggleSwitch);
/**
 * Nav Menu Component
 */

var navMenu = document.createElement('template');
navMenu.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<ul class='nav-menu-ul'><slot></slot></ul>\n";

var NavMenu = /*#__PURE__*/function (_CustomElement3) {
  _inherits(NavMenu, _CustomElement3);

  var _super4 = _createSuper(NavMenu);

  // activeTab;
  function NavMenu() {
    var _this5;

    _classCallCheck(this, NavMenu);

    _this5 = _super4.call(this, navMenu);
    _this5.activeTab = _this5.getAttribute('activeTab');
    return _this5;
  }

  _createClass(NavMenu, [{
    key: "resetAllTabs",
    value: function resetAllTabs(tabs) {
      var _iterator = _createForOfIteratorHelper(tabs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var tab = _step.value;
          tab.shadowRoot.querySelector('.tab').className = 'tab hidden';
          var tabId = tab.getAttribute('id');
          var panel = document.getElementById("panel-".concat(tabId));

          if (panel) {
            panel.classList.add('hidden');
            panel.classList.remove('active');
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "onClick",
    value: function onClick(e) {
      var tabId = e && e.target && e.target.id;

      if (tabId) {
        var tabs = Array.from(this.querySelectorAll('nav-menu-li'));
        this.resetAllTabs(tabs);
        var selected = tabs.find(function (t) {
          return t.getAttribute('id') === tabId;
        });
        selected.shadowRoot.querySelector('.tab').className = 'tab active';
        var panel = document.getElementById("panel-".concat(tabId));

        if (panel) {
          panel.classList.remove('hidden');
          panel.classList.add('active');
        }
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this.addEventListener('click', this.onClick);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
    }
  }]);

  return NavMenu;
}(CustomElement);

window.customElements.define('nav-menu', NavMenu);
/**
 * Nav Menu Li Component
 */

var navMenuLi = document.createElement('template');
navMenuLi.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<li class=\"tab hidden\"><slot></slot>\n</li>\n";

var NavMenuLi = /*#__PURE__*/function (_CustomElement4) {
  _inherits(NavMenuLi, _CustomElement4);

  var _super5 = _createSuper(NavMenuLi);

  function NavMenuLi() {
    var _this6;

    _classCallCheck(this, NavMenuLi);

    _this6 = _super5.call(this, navMenuLi);

    if (_this6.getAttribute('active') !== null) {
      _this6.shadowRoot.querySelector('.tab').className = 'tab active';
    }

    return _this6;
  }

  return NavMenuLi;
}(CustomElement);

window.customElements.define('nav-menu-li', NavMenuLi);
/**
 * Input
 */

var textInput = document.createElement('template');
textInput.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<div class=\"input-container\">\n\t<input id=\"input\" class=\"text-input\">\n\t<slot></slot>\n</div>\n";

var TextInput = /*#__PURE__*/function (_CustomElement5) {
  _inherits(TextInput, _CustomElement5);

  var _super6 = _createSuper(TextInput);

  function TextInput() {
    var _this7;

    _classCallCheck(this, TextInput);

    _this7 = _super6.call(this, textInput);

    _this7.setState({
      id: _this7.getAttribute('id'),
      name: _this7.getAttribute('name'),
      type: _this7.getAttribute('type') || 'text',
      value: _this7.getAttribute('value') || null
    });

    _this7.onChange = _this7.onChange.bind(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(TextInput, [{
    key: "onChange",
    value: function onChange(event) {
      var value = event.target.value;
      var storedVal = this.state.type === 'number' ? parseInt(value, 10) : value;
      this.setState({
        value: storedVal
      });
    }
  }, {
    key: "onStateChanges",
    value: function onStateChanges(state) {
      var input = this.shadowRoot.querySelector('#input');

      if (state.value !== input.value) {
        input.value = state.value;
      }

      this.shadowRoot.querySelector('#input').type = state.type;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var el = this.shadowRoot.querySelector('#input');
      el.addEventListener('change', this.onChange);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var el = this.shadowRoot.querySelector('#input');
      el.removeEventListener('change', this.onChange);
    }
  }]);

  return TextInput;
}(CustomElement);

window.customElements.define('text-input', TextInput);
/**
 * Dropdown Menu (select)
 */

var dropdownMenuTemplate = document.createElement('template');
dropdownMenuTemplate.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<div class=\"dropdown-menu\">\n<select id=\"select\" class=\"placeholder\"></select>\n<slot></slot>\n<div class=\"dropdown-indicator\">\n\t<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox='0 0 1000 1000' xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n\t\t<metadata>IcoFont Icons</metadata>\n\t\t<title>simple-down</title>\n\t\t<glyph glyph-name=\"simple-down\" unicode=\"&#xeab2;\" horiz-adv-x=\"1000\" />\n\t\t<path\n\t\t\td=\"M200 392.6l300 300 300-300-85.10000000000002-85.10000000000002-214.89999999999998 214.79999999999995-214.89999999999998-214.89999999999998-85.10000000000002 85.20000000000005z\" />\n\t</svg>\n</div>\n</div>\n";

var DropdownMenu = /*#__PURE__*/function (_CustomElement6) {
  _inherits(DropdownMenu, _CustomElement6);

  var _super7 = _createSuper(DropdownMenu);

  function DropdownMenu() {
    var _this8;

    _classCallCheck(this, DropdownMenu);

    _this8 = _super7.call(this, dropdownMenuTemplate);

    _this8.setState({
      id: _this8.getAttribute('id'),
      name: _this8.getAttribute('name'),
      value: _this8.getAttribute('value') || null
    });

    _this8.onChange = _this8.onChange.bind(_assertThisInitialized(_this8));
    return _this8;
  }

  _createClass(DropdownMenu, [{
    key: "onChange",
    value: function onChange(event) {
      var value = event.target.value;
      this.setState({
        value: value
      });
    }
  }, {
    key: "onStateChanges",
    value: function onStateChanges(state) {
      var select = this.shadowRoot.querySelector('#select');

      if (state.value !== select.value) {
        select.value = state.value;
      }

      select.classList = !state.value ? 'placeholder' : '';
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this9 = this;

      var el = this.shadowRoot.querySelector('#select');
      el.addEventListener('change', this.onChange);
      this.shadowRoot.addEventListener('slotchange', function () {
        var select = _this9.shadowRoot.querySelector('#select');

        var node = _this9.querySelector('option');

        node && select.append(node);
      });
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var el = this.shadowRoot.querySelector('#select');
      el.removeEventListener('change', this.onChange);
      this.shadowRoot.removeEventListener('slotchange');
    }
  }]);

  return DropdownMenu;
}(CustomElement);

window.customElements.define('dropdown-menu', DropdownMenu);
/**
 * Chip
 */

var chipTemplate = document.createElement('template');
chipTemplate.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<div id=\"chip\" class=\"chip hidden\"></div>\n";

var Chip = /*#__PURE__*/function (_CustomElement7) {
  _inherits(Chip, _CustomElement7);

  var _super8 = _createSuper(Chip);

  function Chip() {
    var _this10;

    _classCallCheck(this, Chip);

    _this10 = _super8.call(this, chipTemplate);

    _this10.setState({
      id: _this10.getAttribute('id'),
      text: _this10.getAttribute('text')
    });

    return _this10;
  }

  _createClass(Chip, [{
    key: "onStateChanges",
    value: function onStateChanges(state) {
      if (state.text) {
        this.shadowRoot.querySelector('#chip').innerHTML = state.text;
        this.shadowRoot.querySelector('#chip').className = 'chip';
      }
    }
  }]);

  return Chip;
}(CustomElement);

window.customElements.define('ui-chip', Chip);
/**
 * Loader
 */

var loaderTemplate = document.createElement('template');
loaderTemplate.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<div id=\"pageLoader\" class=\"pageLoader hidden\">\n\t<div id=\"loader\" class=\"loader\">Loading...</div>\n</div>\n";

var Loader = /*#__PURE__*/function (_CustomElement8) {
  _inherits(Loader, _CustomElement8);

  var _super9 = _createSuper(Loader);

  function Loader() {
    var _this11;

    _classCallCheck(this, Loader);

    _this11 = _super9.call(this, loaderTemplate);

    _this11.setState({
      id: _this11.getAttribute('id'),
      loading: _this11.getAttribute('loading')
    });

    _this11.updateLoadingClass(!!_this11.getAttribute('loading'));

    return _this11;
  }

  _createClass(Loader, [{
    key: "updateLoadingClass",
    value: function updateLoadingClass(loading) {
      if (loading) {
        this.shadowRoot.querySelector('#pageLoader').className = 'pageLoader';
      } else {
        this.shadowRoot.querySelector('#pageLoader').className = 'pageLoader hidden';
      }
    }
  }, {
    key: "onStateChanges",
    value: function onStateChanges(state) {
      this.updateLoadingClass(state.loading);
    }
  }]);

  return Loader;
}(CustomElement);

window.customElements.define('ui-loader', Loader);
/**
 * Color Slider
 */

var colorSliderTemplate = document.createElement('template');
colorSliderTemplate.innerHTML =
/*html*/
"\n<style>\n\t@import \"style.css\";\n</style>\n<div id=\"color-slider\" class=\"color-slider\" ontouchstart=\"return true;\">\n\t<div id=\"handle\"></div>\n</div>\n";

var ColorSlider = /*#__PURE__*/function (_CustomElement9) {
  _inherits(ColorSlider, _CustomElement9);

  var _super10 = _createSuper(ColorSlider);

  function ColorSlider() {
    var _this12;

    _classCallCheck(this, ColorSlider);

    _this12 = _super10.call(this, colorSliderTemplate);
    _this12.handlePos = {
      xLeft: 0,
      xPos: 0,
      xStart: 0,
      xMax: 0,
      posRatio: 0
    };
    _this12.shadowRoot.querySelector('#handle').onmousedown = _this12.onHandleGrab.bind(_assertThisInitialized(_this12));
    _this12.shadowRoot.querySelector('#handle').ontouchstart = _this12.onHandleGrab.bind(_assertThisInitialized(_this12)); // this.slideWidth = this.shadowRoot.querySelector('#color-slider').clientWidth;

    window.onresize = function () {
      var handleWidth = _this12.shadowRoot.querySelector('#handle').clientWidth;

      var hp = _this12.handlePos;

      var sliderRect = _this12.shadowRoot.querySelector('#color-slider').getBoundingClientRect();

      var sliderWidth = sliderRect.right - sliderRect.left;
      var leftOffset = sliderWidth * hp.posRatio - handleWidth - 3;
      _this12.handlePos = {
        xLeft: leftOffset,
        xPos: sliderRect.left + leftOffset - handleWidth - 3,
        xStart: sliderRect.left,
        xMax: sliderRect.right - handleWidth - 3,
        posRatio: hp.posRatio
      };
      console.log(_this12.handlePos);
      _this12.shadowRoot.querySelector('#handle').style.left = _this12.handlePos.xLeft + 'px';
    }; // this.setState({
    // 	id: this.getAttribute('id'),
    // 	loading: this.getAttribute('loading')
    // });
    // this.updateLoadingClass(!!this.getAttribute('loading'));


    _this12.setPosition = _this12.setPosition.bind(_assertThisInitialized(_this12));
    _this12.elementDrag = _this12.elementDrag.bind(_assertThisInitialized(_this12));
    _this12.closeDragElement = _this12.closeDragElement.bind(_assertThisInitialized(_this12));
    return _this12;
  }

  _createClass(ColorSlider, [{
    key: "setPosition",
    value: function setPosition(e) {
      var pos = e.clientX;
      console.log('clientX:', pos);

      if (pos < this.handlePos.xStart) {
        pos = this.handlePos.xStart;
      } else if (pos > this.handlePos.xMax) {
        pos = this.handlePos.xMax;
      }

      console.log('final pos:', pos);
      this.handlePos.xPos = pos;
    }
  }, {
    key: "onHandleGrab",
    value: function onHandleGrab(e) {
      if (!this.handlePos.xStart) {
        this.handlePos.xStart = e.clientX;
        this.handlePos.xMax = e.clientX + this.shadowRoot.querySelector('#color-slider').clientWidth - this.shadowRoot.querySelector('#handle').clientWidth - 3;
      }

      e.preventDefault();
      this.setPosition(e);
      document.onmouseup = this.closeDragElement;
      document.onmousemove = this.elementDrag;
      document.ontouchend = this.closeDragElement;
      document.ontouchmove = this.elementDrag;
    }
  }, {
    key: "elementDrag",
    value: function elementDrag(e) {
      e.preventDefault();
      this.setPosition(e);
      this.handlePos.xLeft = this.handlePos.xPos - this.handlePos.xStart; // this.handlePos.xPos = e.clientX;
      // console.log(this.handlePos);

      var handle = this.shadowRoot.querySelector('#handle');
      handle.style.left = this.handlePos.xLeft + 'px';
    }
  }, {
    key: "closeDragElement",
    value: function closeDragElement(e) {
      var hp = this.handlePos;
      hp.posRatio = (hp.xPos - hp.xStart) / (hp.xMax - hp.xStart);
      console.log(hp.posRatio);
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    } // updateLoadingClass(loading) {
    // 	if (loading) {
    // 		this.shadowRoot.querySelector('#pageLoader').className = 'pageLoader';
    // 	} else {
    // 		this.shadowRoot.querySelector('#pageLoader').className = 'pageLoader hidden';
    // 	}
    // }
    // onStateChanges(state) {
    // 	this.updateLoadingClass(state.loading);
    // }

  }]);

  return ColorSlider;
}(CustomElement);

window.customElements.define('ui-color-slider', ColorSlider);
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64913" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","components.js"], null)
//# sourceMappingURL=/components.292252fd.js.map