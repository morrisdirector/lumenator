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
})({"settings.js":[function(require,module,exports) {
// 'use strict';
var OnOff = {
  ON: 1,
  OFF: 0
};
var Mode = {
  STANDBY: 0,
  RGB: 1,
  WHITE: 2,
  GPIO_TESTING: 3
}; // Debugging Mode

var DEBUG = false; // Hello
},{}],"script.js":[function(require,module,exports) {
"use strict";

var _settings = require("./settings");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var errors = []; // const deviceModels = [ 'name' ];
// const network = [ 'name' ];

var websocket;
var config;
var devicePresets;
var mode = _settings.Mode.STANDBY;
var rgbControlColorPicker;

var setDomValue = function setDomValue(id, value) {
  var el = document.getElementById(id);

  if (el) {
    if (typeof el.updateValue === 'function') {
      el.updateValue(value);
    } else {
      el.innerText = value;
    }
  }
};

var setComponentState = function setComponentState(id, state) {
  var component = document.getElementById(id);

  if (component) {
    component.setState(state);
  }
};

var testData = function testData() {
  return {
    device: {
      name: 'Bulb Test 1',
      map_preset: 'wemos',
      device_type: 0,
      gpio_w: 15,
      gpio_ww: 13,
      gpio_r: 12,
      gpio_g: 14,
      gpio_b: 16
    },
    network: {
      ssid: 'Fake SSID',
      password: 'password'
    }
  };
};

var onWsError = function onWsError(evt) {
  document.querySelector('#error-messages').setState({
    text: 'Error establishing Web Socket connection'
  });
  window.scrollTo(0, 0);
  console.log(evt);
};

var wsConnect = function wsConnect() {
  var url = 'ws://' + document.location.host + ':1337';

  if (document.location.host.length) {
    var i = 0;
    var connectionInt = setInterval(function () {
      i++;
      websocket = new WebSocket(url);

      websocket.onopen = function () {
        clearInterval(connectionInt);
      }; // websocket.onopen = function (evt) { onOpen(evt) };
      // websocket.onclose = function (evt) { onClose(evt) };
      // websocket.onmessage = function (evt) { onMessage(evt) };


      websocket.onerror = function (evt) {
        if (i === 5) {
          clearInterval(connectionInt);
          onWsError(evt);
        }
      };
    }, 1000);
  }
};

var showPassword = function showPassword() {
  var el = document.getElementById('password');
  var newState = el.state.type === 'password' ? 'text' : 'password';
  setComponentState('password', {
    type: newState
  });
  setDomValue('show-password-button', newState === 'password' ? 'Show' : 'Hide');
};

var setDeviceModels = function setDeviceModels() {
  var deviceModels = Object.keys(config.device);
  deviceModels.forEach(function (model) {
    setComponentState(model, {
      value: config.device[model]
    });
  });

  if (config.device.name) {
    setComponentState('title-chip', {
      text: config.device.name
    });
  }
};

var setNetworkModels = function setNetworkModels() {
  var networkModels = Object.keys(config.network);
  networkModels.forEach(function (model) {
    setComponentState(model, {
      value: config.network[model]
    });
  });
};

var loadConfigJson = function loadConfigJson() {
  var loadData = function loadData(data) {
    config = data;
    console.log(config);

    if (config.device) {
      setDeviceModels();
    }

    if (config.network) {
      setNetworkModels();
    }
  };

  if (DEBUG) {
    loadData(testData());
    return;
  }

  fetch('config').then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data) {
      loadData(data);
    }
  }).catch(function (e) {
    console.warn('Something went wrong loading the config json file.', e);
    window.scrollTo(0, 0);
    document.querySelector('#error-messages').setState({
      text: 'Error loading configuration'
    });
  });
};

var loadDevicePresets = function loadDevicePresets() {
  if (DEBUG) {
    return;
  }

  fetch('devicePresets').then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data) {
      devicePresets = data;
    }
  }).catch(function (e) {
    console.warn('Something went wrong loading the device presets.', e);
    window.scrollTo(0, 0);
    document.querySelector('#error-messages').setState({
      text: 'Error loading device presets'
    });
  });
};

var addEventListeners = function addEventListeners() {
  // Page Settings:
  document.addEventListener('touchstart', function () {}, true); // mobile safari styling
  // Mode Toggles

  var modeToggleSwitches = Array.from(document.querySelectorAll('.mode-toggle'));

  for (var _i = 0, _modeToggleSwitches = modeToggleSwitches; _i < _modeToggleSwitches.length; _i++) {
    var toggle = _modeToggleSwitches[_i];
    toggle.addEventListener('onToggle', function (e) {
      var state = e.target.state;

      if (state.state === 'ON') {
        var _iterator = _createForOfIteratorHelper(modeToggleSwitches),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var t = _step.value;

            if (t.state.id !== state.id && t.state.state === 'ON') {
              t.setState({
                state: 'OFF'
              });
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        switch (state.id) {
          case 'modeRgb':
            mode = _settings.Mode.RGB;
            document.querySelector('#rgb-warning').setState({
              text: 'While manual RGB mode is enabled, Lumenator will not respond to external control commands.'
            });
            sendRgbColors();
            break;

          case 'modeWhite':
            mode = _settings.Mode.WHITE;
            break;

          default:
            // GPIO Testing Mode
            mode = _settings.Mode.GPIO_TESTING;
            document.querySelector('#gpio-test-warning').setState({
              text: 'While GPIO testing is enabled, Lumenator will not respond to external control commands.'
            });
            break;
        }
      } else if (state.state === 'OFF') {
        mode = _settings.Mode.STANDBY;
        document.querySelector('#gpio-test-warning').setState({
          visible: false,
          text: null
        });
        document.querySelector('#rgb-warning').setState({
          visible: false,
          text: null
        });

        if (websocket) {
          websocket.send('standby');
        }
      }

      if (websocket && state.id !== 'modeRgb' && state.id !== 'modeWhite') {
        websocket.send("".concat(e.detail.id, ":").concat(OnOff[e.detail.state]));
      }
    });
  }
};

var saveConfiguration = function saveConfiguration() {
  // document.querySelector('#loader').setState({ loading: true });
  var dto = {};
  var sections = Object.keys(config);
  sections.forEach(function (section) {
    dto[section] = {};
    var props = Object.keys(config[section]);
    props.forEach(function (prop) {
      dto[section][prop] = document.getElementById(prop).state.value;
    });
  });
  fetch('config', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dto)
  }).then(function (res) {
    return res.json();
  }).then(function (res) {
    // document.querySelector('#loader').setState({ loading: false });
    if (res.success) {
      document.querySelector('#info-messages').setState({
        text: 'Updated Configuration Successfully',
        visible: true
      });
      window.scrollTo(0, 0);
    } else {
      document.querySelector('#error-messages').setState({
        text: 'Something went wrong while saving the configuration',
        visible: true
      });
      window.scrollTo(0, 0);
    }
  }).catch(function (e) {
    console.log(e);
    document.querySelector('#error-messages').setState({
      text: 'Something went wrong while saving the configuration',
      visible: true
    });
    window.scrollTo(0, 0);
  });
};

var refresh = function refresh() {
  window.location.reload();
};

var sendRgbColors = function sendRgbColors() {
  if (mode !== _settings.Mode.RGB) {
    mode = _settings.Mode.RGB;
    document.querySelector('#modeRgb').setState({
      state: 'ON'
    });
  }

  var color = rgbControlColorPicker.getCurColorRgb();
  var r = "00".concat(color.r).slice("00".concat(color.r).length - 3);
  var g = "00".concat(color.g).slice("00".concat(color.g).length - 3);
  var b = "00".concat(color.b).slice("00".concat(color.b).length - 3);

  if (websocket) {
    websocket.send("rgbctrl:r:".concat(r, ":g:").concat(g, ":b:").concat(b));
  }
};

var loadColorPickers = function loadColorPickers() {
  // Control Page Color Picker
  rgbControlColorPicker = new KellyColorPicker({
    place: 'control-color-picker',
    size: 225,
    color: 'rgb(0, 0, 255)',
    userEvents: {
      mousemoveh: function mousemoveh() {
        sendRgbColors();
      },
      mousemovesv: function mousemovesv() {
        sendRgbColors();
      },
      mouseuph: function mouseuph() {
        sendRgbColors();
      },
      mouseupsv: function mouseupsv() {
        sendRgbColors();
      }
    }
  });
};

var init = function init() {
  if (!DEBUG) {
    wsConnect();
  }

  addEventListeners();
  loadConfigJson();
  loadDevicePresets();
  loadColorPickers();
};

init();
},{"./settings":"settings.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60302" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map