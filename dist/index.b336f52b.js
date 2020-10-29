// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
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

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
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
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"BaJkD":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "b336f52b0af43e73f16c78804a9ea04e";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

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
var checkedAssets, assetsToAccept, acceptedAssets;

function getHostname() {
  return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}

function getPort() {
  return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare


var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(module.bundle.root, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(module.bundle.root, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
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
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
      var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
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

  return getParents(module.bundle.root, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
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
      var assetsToAlsoAccept = cb(function () {
        return getParents(module.bundle.root, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"6Ug5N":[function(require,module,exports) {
"use strict";

var _Mode = require("./shared/enums/Mode");

var _OnOff = require("./shared/enums/OnOff");

// Debugging Mode
const DEBUG = false;
const errors = [];
let websocket;
let config;
let devicePresets;
let mode = _Mode.Mode.STANDBY;
let rgbControlColorPicker;

const setDomValue = (id, value) => {
  const el = document.getElementById(id);

  if (el) {
    if (typeof el.updateValue === 'function') {
      el.updateValue(value);
    } else {
      el.innerText = value;
    }
  }
};

const setComponentState = (id, state) => {
  const component = document.getElementById(id);

  if (component) {
    component.setState(state);
  }
};

const testData = () => {
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

const onWsError = evt => {
  document.querySelector('#error-messages').setState({
    text: 'Error establishing Web Socket connection'
  });
  window.scrollTo(0, 0);
  console.log(evt);
};

const wsConnect = () => {
  const url = 'ws://' + document.location.host + ':1337';

  if (document.location.host.length) {
    let i = 0;
    const connectionInt = setInterval(() => {
      i++;
      websocket = new WebSocket(url);

      websocket.onopen = () => {
        clearInterval(connectionInt);
      }; // websocket.onopen = function (evt) { onOpen(evt) };
      // websocket.onclose = function (evt) { onClose(evt) };
      // websocket.onmessage = function (evt) { onMessage(evt) };


      websocket.onerror = evt => {
        if (i === 5) {
          clearInterval(connectionInt);
          onWsError(evt);
        }
      };
    }, 1000);
  }
};

const showPassword = () => {
  const el = document.getElementById('password');
  const newState = el.state.type === 'password' ? 'text' : 'password';
  setComponentState('password', {
    type: newState
  });
  setDomValue('show-password-button', newState === 'password' ? 'Show' : 'Hide');
};

const setDeviceModels = () => {
  const deviceModels = Object.keys(config.device);
  deviceModels.forEach(model => {
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

const setNetworkModels = () => {
  const networkModels = Object.keys(config.network);
  networkModels.forEach(model => {
    setComponentState(model, {
      value: config.network[model]
    });
  });
};

const loadConfigJson = () => {
  const loadData = data => {
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

const loadDevicePresets = () => {
  if (DEBUG) {
    return;
  }

  fetch('devicePresets').then(response => response.json()).then(data => {
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

const addEventListeners = () => {
  // Page Settings:
  document.addEventListener('touchstart', function () {}, true); // mobile safari styling
  // Mode Toggles

  const modeToggleSwitches = Array.from(document.querySelectorAll('.mode-toggle'));

  for (let toggle of modeToggleSwitches) {
    toggle.addEventListener('onToggle', e => {
      const state = e.target.state;

      if (state.state === 'ON') {
        for (let t of modeToggleSwitches) {
          if (t.state.id !== state.id && t.state.state === 'ON') {
            t.setState({
              state: 'OFF'
            });
          }
        }

        switch (state.id) {
          case 'modeRgb':
            mode = _Mode.Mode.RGB;
            document.querySelector('#rgb-warning').setState({
              text: 'While manual RGB mode is enabled, Lumenator will not respond to external control commands.'
            });
            sendRgbColors();
            break;

          case 'modeWhite':
            mode = _Mode.Mode.WHITE;
            break;

          default:
            // GPIO Testing Mode
            mode = _Mode.Mode.GPIO_TESTING;
            document.querySelector('#gpio-test-warning').setState({
              text: 'While GPIO testing is enabled, Lumenator will not respond to external control commands.'
            });
            break;
        }
      } else if (state.state === 'OFF') {
        mode = _Mode.Mode.STANDBY;
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
        websocket.send(`${e.detail.id}:${_OnOff.OnOff[e.detail.state]}`);
      }
    });
  }
};

const saveConfiguration = () => {
  // document.querySelector('#loader').setState({ loading: true });
  let dto = {};
  const sections = Object.keys(config);
  sections.forEach(section => {
    dto[section] = {};
    const props = Object.keys(config[section]);
    props.forEach(prop => {
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
  }).then(res => res.json()).then(res => {
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
  }).catch(e => {
    console.log(e);
    document.querySelector('#error-messages').setState({
      text: 'Something went wrong while saving the configuration',
      visible: true
    });
    window.scrollTo(0, 0);
  });
};

const refresh = () => {
  window.location.reload();
};

const sendRgbColors = () => {
  if (mode !== _Mode.Mode.RGB) {
    mode = _Mode.Mode.RGB;
    document.querySelector('#modeRgb').setState({
      state: 'ON'
    });
  }

  const color = rgbControlColorPicker.getCurColorRgb();
  const r = `00${color.r}`.slice(`00${color.r}`.length - 3);
  const g = `00${color.g}`.slice(`00${color.g}`.length - 3);
  const b = `00${color.b}`.slice(`00${color.b}`.length - 3);

  if (websocket) {
    websocket.send(`rgbctrl:r:${r}:g:${g}:b:${b}`);
  }
};

const loadColorPickers = () => {
  // Control Page Color Picker
  rgbControlColorPicker = new KellyColorPicker({
    place: 'control-color-picker',
    size: 225,
    color: 'rgb(0, 0, 255)',
    userEvents: {
      mousemoveh: () => {
        sendRgbColors();
      },
      mousemovesv: () => {
        sendRgbColors();
      },
      mouseuph: () => {
        sendRgbColors();
      },
      mouseupsv: () => {
        sendRgbColors();
      }
    }
  });
};

const init = () => {
  if (!DEBUG) {
    wsConnect();
  }

  addEventListeners();
  loadConfigJson();
  loadDevicePresets();
  loadColorPickers();
};

init();
},{"./shared/enums/Mode":"70807","./shared/enums/OnOff":"iW0wU"}],"70807":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mode = void 0;
let Mode;
exports.Mode = Mode;

(function (Mode) {
  Mode[Mode["STANDBY"] = 0] = "STANDBY";
  Mode[Mode["RGB"] = 1] = "RGB";
  Mode[Mode["WHITE"] = 2] = "WHITE";
  Mode[Mode["GPIO_TESTING"] = 3] = "GPIO_TESTING";
})(Mode || (exports.Mode = Mode = {}));
},{}],"iW0wU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OnOff = void 0;
let OnOff;
exports.OnOff = OnOff;

(function (OnOff) {
  OnOff[OnOff["OFF"] = 0] = "OFF";
  OnOff[OnOff["ON"] = 1] = "ON";
})(OnOff || (exports.OnOff = OnOff = {}));
},{}]},{},["BaJkD","6Ug5N"], "6Ug5N", "parcelRequirefcb7")

//# sourceMappingURL=index.b336f52b.js.map
