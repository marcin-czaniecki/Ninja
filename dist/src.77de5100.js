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
})({"world/world.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.World = void 0;

var World =
/** @class */
function () {
  function World(root, width, height) {
    this.width = width;
    this.height = height;
    this._area = document.createElement("canvas");
    this.camera = {
      x: 0,
      y: 0
    };
    this.currentFrame = 0;
    this.ground = height * 0.3;
    this.init(root);
  }

  Object.defineProperty(World.prototype, "area", {
    get: function get() {
      return this._area;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(World.prototype, "context", {
    get: function get() {
      return this._area.getContext("2d");
    },
    enumerable: false,
    configurable: true
  });

  World.prototype.nextFrame = function () {
    this.currentFrame += 1;
  };

  World.prototype.cameraObserveX = function (x, padding) {
    if (padding === void 0) {
      padding = 0;
    }

    this.camera.x = x + padding;
  };

  World.prototype.cameraObserveY = function (y, padding) {
    if (padding === void 0) {
      padding = 0;
    }

    this.camera.y = y + padding;
  };

  World.prototype.init = function (root) {
    this.area.width = this.width;
    this.area.height = this.height;
    root.append(this._area);
  };

  return World;
}();

exports.World = World;
},{}],"helpers/helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createImage = exports.getRoot = void 0;

var getRoot = function getRoot() {
  var root = document.getElementById("root");

  if (!root) {
    throw Error("You need add div with id root to your index.html");
  }

  var divRoot = root;
  return divRoot;
};

exports.getRoot = getRoot;

var createImage = function createImage(src) {
  var img = new Image();
  img.src = src;
  return img;
};

exports.createImage = createImage;
},{}],"player/player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var Player =
/** @class */
function () {
  function Player(world, width, height) {
    this.activeWorld = world;
    this.width = width;
    this.height = height;
    this.scale = {
      x: 1,
      y: 1
    };
    this.position = {
      x: 0,
      y: 0
    };
    this.currentFrame = 0;
    this.speed = 5;
    this.jump = {
      acceleration: 1,
      speed: 0,
      height: this.height / 10
    };
    this.speedAnimation = 4;
    this.isAir = false;
    this.collisionRectangle = {
      xOffset: 0,
      yOffset: 0,
      width: 0,
      height: 0
    };
    this.updatePlayer();
  }

  Player.prototype.updatePlayer = function () {
    this.collisionRectangle = {
      xOffset: this.width * this.scale.x * 0.2,
      yOffset: this.height * this.scale.y * 0.2,
      width: this.width * this.scale.x * 0.7,
      height: this.height * this.scale.x * 0.7
    };
    this.jump.height = this.height * this.scale.x / 10;
  };

  Object.defineProperty(Player.prototype, "x", {
    get: function get() {
      return this.position.x;
    },
    set: function set(x) {
      this.position.x = x;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Player.prototype, "y", {
    get: function get() {
      return this.position.y;
    },
    set: function set(y) {
      this.position.y = y;
    },
    enumerable: false,
    configurable: true
  });

  Player.prototype.setScale = function (x, y) {
    this.scale = {
      x: x,
      y: y
    };
    this.updatePlayer();
  };

  Player.prototype.nextFrame = function () {
    this.currentFrame += 1;
  };

  Player.prototype.divideSpriteSheet = function (framesPerRow) {
    var spriteSheetRow = Math.floor(this.currentFrame / framesPerRow);
    var spriteSheetColumn = this.currentFrame % framesPerRow;
    var spriteSheetX = spriteSheetColumn * this.width;
    var spriteSheetY = spriteSheetRow * this.height;
    return {
      spriteSheetX: spriteSheetX,
      spriteSheetY: spriteSheetY
    };
  };

  Player.prototype.updateGravitation = function () {
    this.y += this.jump.speed;
    this.jump.speed += this.jump.acceleration;

    if (this.y > this.activeWorld.height - this.activeWorld.ground) {
      this.y = this.activeWorld.height - this.activeWorld.ground;
      this.jump.speed = 0;
      this.isAir = false;
    }
  };

  Player.prototype.updateJump = function (hop) {
    if (hop && !this.isAir) {
      this.jump.speed = -this.jump.height;
      this.isAir = true;
    }
  };

  Player.prototype.updateRun = function () {
    this.x += this.speed;
  };

  Player.prototype.updateAnimationRun = function (maxFrame, single) {
    if (maxFrame === void 0) {
      maxFrame = 10;
    }

    this.activeWorld.nextFrame();

    if (this.activeWorld.currentFrame % this.speedAnimation === 0) {
      this.nextFrame();

      if (this.currentFrame >= maxFrame) {
        if (!single) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = maxFrame - 1;
        }
      }
    }
  };

  Player.prototype.drawAnimationRun = function (context, spriteSheet, framesPerRow, screenX, screenY) {
    var _a = this.divideSpriteSheet(framesPerRow),
        spriteSheetX = _a.spriteSheetX,
        spriteSheetY = _a.spriteSheetY;

    context.drawImage(spriteSheet, spriteSheetX, spriteSheetY, this.width, this.height, screenX, screenY, this.width * this.scale.x, this.height * this.scale.y);
  };

  return Player;
}();

exports.Player = Player;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var world_1 = require("./world/world");

var helpers_1 = require("./helpers/helpers");

var player_1 = require("./player/player");

var world = new world_1.World(helpers_1.getRoot(), window.innerWidth, window.innerHeight);
var player = new player_1.Player(world, 363, 458);
player.setScale(0.5, 0.5);
player.y = world.height - world.ground;
var spriteSheetPlayerRun = helpers_1.createImage("./assets/ninja/run.png");
var spriteSheetPlayerJump = helpers_1.createImage("./assets/ninja/jump.png");
var ctx = world.context;
setInterval(function () {
  player.updateJump(true);
}, 3000);
var single = false;

var update = function update() {
  if (!player.isAir) {
    single = false;
  } else if (player.isAir) {
    single = true;
  }

  player.updateGravitation();
  player.updateRun();
  player.updateAnimationRun(10, single);
  world.cameraObserveY(player.y);
  world.cameraObserveX(player.x, -150);
};

var draw = function draw() {
  ctx.clearRect(0, 0, world.width, world.height);

  if (!player.isAir) {
    player.drawAnimationRun(ctx, spriteSheetPlayerRun, 10, player.x - world.camera.x, world.camera.y);
  } else if (player.isAir) {
    player.drawAnimationRun(ctx, spriteSheetPlayerJump, 10, player.x - world.camera.x, world.camera.y);
  }
};

var mainLoop = function mainLoop() {
  update();
  draw();
  window.requestAnimationFrame(mainLoop);
};

var start = function start() {
  window.requestAnimationFrame(mainLoop);
};

window.addEventListener("load", start);
},{"./world/world":"world/world.ts","./helpers/helpers":"helpers/helpers.ts","./player/player":"player/player.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49847" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map