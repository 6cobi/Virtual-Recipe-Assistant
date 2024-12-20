(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"), require("antd"), require("antdCssinjs"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM", "antd", "antdCssinjs"], factory);
	else if(typeof exports === 'object')
		exports["antdx"] = factory(require("React"), require("ReactDOM"), require("antd"), require("antdCssinjs"));
	else
		root["antdx"] = factory(root["React"], root["ReactDOM"], root["antd"], root["antdCssinjs"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__24__, __WEBPACK_EXTERNAL_MODULE__314__, __WEBPACK_EXTERNAL_MODULE__721__, __WEBPACK_EXTERNAL_MODULE__781__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 302:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = canUseDom;
function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

/***/ }),

/***/ 711:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = (__webpack_require__(543)["default"]);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = useEvent;
var React = _interopRequireWildcard(__webpack_require__(24));
function useEvent(callback) {
  var fnRef = React.useRef();
  fnRef.current = callback;
  var memoFn = React.useCallback(function () {
    var _fnRef$current;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return (_fnRef$current = fnRef.current) === null || _fnRef$current === void 0 ? void 0 : _fnRef$current.call.apply(_fnRef$current, [fnRef].concat(args));
  }, []);
  return memoFn;
}

/***/ }),

/***/ 35:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = (__webpack_require__(740)["default"]);
var _interopRequireWildcard = (__webpack_require__(543)["default"]);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.useLayoutUpdateEffect = exports["default"] = void 0;
var React = _interopRequireWildcard(__webpack_require__(24));
var _canUseDom = _interopRequireDefault(__webpack_require__(302));
/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */
var useInternalLayoutEffect =  true && (0, _canUseDom.default)() ? React.useLayoutEffect : React.useEffect;
var useLayoutEffect = function useLayoutEffect(callback, deps) {
  var firstMountRef = React.useRef(true);
  useInternalLayoutEffect(function () {
    return callback(firstMountRef.current);
  }, deps);

  // We tell react that first mount has passed
  useInternalLayoutEffect(function () {
    firstMountRef.current = false;
    return function () {
      firstMountRef.current = true;
    };
  }, []);
};
var useLayoutUpdateEffect = exports.useLayoutUpdateEffect = function useLayoutUpdateEffect(callback, deps) {
  useLayoutEffect(function (firstMount) {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};
var _default = exports["default"] = useLayoutEffect;

/***/ }),

/***/ 578:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = (__webpack_require__(740)["default"]);
__webpack_unused_export__ = ({
  value: true
});
exports.Z = useMergedState;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(488));
var _useEvent = _interopRequireDefault(__webpack_require__(711));
var _useLayoutEffect = __webpack_require__(35);
var _useState5 = _interopRequireDefault(__webpack_require__(714));
/** We only think `undefined` is empty */
function hasValue(value) {
  return value !== undefined;
}

/**
 * Similar to `useState` but will use props value if provided.
 * Note that internal use rc-util `useState` hook.
 */
function useMergedState(defaultStateValue, option) {
  var _ref = option || {},
    defaultValue = _ref.defaultValue,
    value = _ref.value,
    onChange = _ref.onChange,
    postState = _ref.postState;

  // ======================= Init =======================
  var _useState = (0, _useState5.default)(function () {
      if (hasValue(value)) {
        return value;
      } else if (hasValue(defaultValue)) {
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      } else {
        return typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
      }
    }),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    innerValue = _useState2[0],
    setInnerValue = _useState2[1];
  var mergedValue = value !== undefined ? value : innerValue;
  var postMergedValue = postState ? postState(mergedValue) : mergedValue;

  // ====================== Change ======================
  var onChangeFn = (0, _useEvent.default)(onChange);
  var _useState3 = (0, _useState5.default)([mergedValue]),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    prevValue = _useState4[0],
    setPrevValue = _useState4[1];
  (0, _useLayoutEffect.useLayoutUpdateEffect)(function () {
    var prev = prevValue[0];
    if (innerValue !== prev) {
      onChangeFn(innerValue, prev);
    }
  }, [prevValue]);

  // Sync value back to `undefined` when it from control to un-control
  (0, _useLayoutEffect.useLayoutUpdateEffect)(function () {
    if (!hasValue(value)) {
      setInnerValue(value);
    }
  }, [value]);

  // ====================== Update ======================
  var triggerChange = (0, _useEvent.default)(function (updater, ignoreDestroy) {
    setInnerValue(updater, ignoreDestroy);
    setPrevValue([mergedValue], ignoreDestroy);
  });
  return [postMergedValue, triggerChange];
}

/***/ }),

/***/ 714:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = (__webpack_require__(543)["default"]);
var _interopRequireDefault = (__webpack_require__(740)["default"]);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = useSafeState;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(488));
var React = _interopRequireWildcard(__webpack_require__(24));
/**
 * Same as React.useState but `setState` accept `ignoreDestroy` param to not to setState after destroyed.
 * We do not make this auto is to avoid real memory leak.
 * Developer should confirm it's safe to ignore themselves.
 */
function useSafeState(defaultValue) {
  var destroyRef = React.useRef(false);
  var _React$useState = React.useState(defaultValue),
    _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
    value = _React$useState2[0],
    setValue = _React$useState2[1];
  React.useEffect(function () {
    destroyRef.current = false;
    return function () {
      destroyRef.current = true;
    };
  }, []);
  function safeSetState(updater, ignoreDestroy) {
    if (ignoreDestroy && destroyRef.current) {
      return;
    }
    setValue(updater);
  }
  return [value, safeSetState];
}

/***/ }),

/***/ 791:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireDefault = (__webpack_require__(740)["default"]);
__webpack_unused_export__ = ({
  value: true
});
exports.Z = pickAttrs;
var _objectSpread2 = _interopRequireDefault(__webpack_require__(402));
var attributes = "accept acceptCharset accessKey action allowFullScreen allowTransparency\n    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge\n    charSet checked classID className colSpan cols content contentEditable contextMenu\n    controls coords crossOrigin data dateTime default defer dir disabled download draggable\n    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder\n    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity\n    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media\n    mediaGroup method min minLength multiple muted name noValidate nonce open\n    optimum pattern placeholder poster preload radioGroup readOnly rel required\n    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected\n    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style\n    summary tabIndex target title type useMap value width wmode wrap";
var eventsName = "onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown\n    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick\n    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown\n    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel\n    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough\n    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata\n    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError";
var propList = "".concat(attributes, " ").concat(eventsName).split(/[\s\n]+/);

/* eslint-enable max-len */
var ariaPrefix = 'aria-';
var dataPrefix = 'data-';
function match(key, prefix) {
  return key.indexOf(prefix) === 0;
}
/**
 * Picker props from exist props with filter
 * @param props Passed props
 * @param ariaOnly boolean | { aria?: boolean; data?: boolean; attr?: boolean; } filter config
 */
function pickAttrs(props) {
  var ariaOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var mergedConfig;
  if (ariaOnly === false) {
    mergedConfig = {
      aria: true,
      data: true,
      attr: true
    };
  } else if (ariaOnly === true) {
    mergedConfig = {
      aria: true
    };
  } else {
    mergedConfig = (0, _objectSpread2.default)({}, ariaOnly);
  }
  var attrs = {};
  Object.keys(props).forEach(function (key) {
    if (
    // Aria
    mergedConfig.aria && (key === 'role' || match(key, ariaPrefix)) ||
    // Data
    mergedConfig.data && match(key, dataPrefix) ||
    // Attr
    mergedConfig.attr && propList.includes(key)) {
      attrs[key] = props[key];
    }
  });
  return attrs;
}

/***/ }),

/***/ 125:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
exports.Z = get;
function get(entity, path) {
  var current = entity;
  for (var i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[path[i]];
  }
  return current;
}

/***/ }),

/***/ 357:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var b = Symbol.for("react.element"),
  c = Symbol.for("react.portal"),
  d = Symbol.for("react.fragment"),
  e = Symbol.for("react.strict_mode"),
  f = Symbol.for("react.profiler"),
  g = Symbol.for("react.provider"),
  h = Symbol.for("react.context"),
  k = Symbol.for("react.server_context"),
  l = Symbol.for("react.forward_ref"),
  m = Symbol.for("react.suspense"),
  n = Symbol.for("react.suspense_list"),
  p = Symbol.for("react.memo"),
  q = Symbol.for("react.lazy"),
  t = Symbol.for("react.offscreen"),
  u;
u = Symbol.for("react.module.reference");
function v(a) {
  if ("object" === typeof a && null !== a) {
    var r = a.$$typeof;
    switch (r) {
      case b:
        switch (a = a.type, a) {
          case d:
          case f:
          case e:
          case m:
          case n:
            return a;
          default:
            switch (a = a && a.$$typeof, a) {
              case k:
              case h:
              case l:
              case q:
              case p:
              case g:
                return a;
              default:
                return r;
            }
        }
      case c:
        return r;
    }
  }
}
__webpack_unused_export__ = h;
__webpack_unused_export__ = g;
__webpack_unused_export__ = b;
exports.ForwardRef = l;
__webpack_unused_export__ = d;
__webpack_unused_export__ = q;
__webpack_unused_export__ = p;
__webpack_unused_export__ = c;
__webpack_unused_export__ = f;
__webpack_unused_export__ = e;
__webpack_unused_export__ = m;
__webpack_unused_export__ = n;
__webpack_unused_export__ = function () {
  return !1;
};
__webpack_unused_export__ = function () {
  return !1;
};
__webpack_unused_export__ = function (a) {
  return v(a) === h;
};
__webpack_unused_export__ = function (a) {
  return v(a) === g;
};
__webpack_unused_export__ = function (a) {
  return "object" === typeof a && null !== a && a.$$typeof === b;
};
__webpack_unused_export__ = function (a) {
  return v(a) === l;
};
exports.isFragment = function (a) {
  return v(a) === d;
};
__webpack_unused_export__ = function (a) {
  return v(a) === q;
};
exports.isMemo = function (a) {
  return v(a) === p;
};
__webpack_unused_export__ = function (a) {
  return v(a) === c;
};
__webpack_unused_export__ = function (a) {
  return v(a) === f;
};
__webpack_unused_export__ = function (a) {
  return v(a) === e;
};
__webpack_unused_export__ = function (a) {
  return v(a) === m;
};
__webpack_unused_export__ = function (a) {
  return v(a) === n;
};
__webpack_unused_export__ = function (a) {
  return "string" === typeof a || "function" === typeof a || a === d || a === f || a === e || a === m || a === n || a === t || "object" === typeof a && null !== a && (a.$$typeof === q || a.$$typeof === p || a.$$typeof === g || a.$$typeof === h || a.$$typeof === l || a.$$typeof === u || void 0 !== a.getModuleId) ? !0 : !1;
};
__webpack_unused_export__ = v;

/***/ }),

/***/ 851:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(357);
} else {}

/***/ }),

/***/ 24:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__24__;

/***/ }),

/***/ 314:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__314__;

/***/ }),

/***/ 721:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__721__;

/***/ }),

/***/ 781:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__781__;

/***/ }),

/***/ 154:
/***/ (function(module) {

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 462:
/***/ (function(module) {

function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 51:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(108);
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 740:
/***/ (function(module) {

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 543:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = (__webpack_require__(191)["default"]);
function _getRequireWildcardCache(e) {
  if ("function" != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || "object" != _typeof(e) && "function" != typeof e) return {
    "default": e
  };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = {
      __proto__: null
    },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
    var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
    i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
  }
  return n["default"] = e, t && t.set(e, n), n;
}
module.exports = _interopRequireWildcard, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 449:
/***/ (function(module) {

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 431:
/***/ (function(module) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 402:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var defineProperty = __webpack_require__(51);
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 488:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(462);
var iterableToArrayLimit = __webpack_require__(449);
var unsupportedIterableToArray = __webpack_require__(237);
var nonIterableRest = __webpack_require__(431);
function _slicedToArray(r, e) {
  return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 875:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = (__webpack_require__(191)["default"]);
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 108:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = (__webpack_require__(191)["default"]);
var toPrimitive = __webpack_require__(875);
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 191:
/***/ (function(module) {

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 237:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(154);
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
  }
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 55:
/***/ (function(module) {

function _extends() {
  module.exports = _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _extends.apply(this, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 667:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
  'use strict';

  var hasOwn = {}.hasOwnProperty;
  function classNames() {
    var classes = '';
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (arg) {
        classes = appendClass(classes, parseValue(arg));
      }
    }
    return classes;
  }
  function parseValue(arg) {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return arg;
    }
    if (typeof arg !== 'object') {
      return '';
    }
    if (Array.isArray(arg)) {
      return classNames.apply(null, arg);
    }
    if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
      return arg.toString();
    }
    var classes = '';
    for (var key in arg) {
      if (hasOwn.call(arg, key) && arg[key]) {
        classes = appendClass(classes, key);
      }
    }
    return classes;
  }
  function appendClass(value, newClass) {
    if (!newClass) {
      return value;
    }
    if (value) {
      return value + ' ' + newClass;
    }
    return value + newClass;
  }
  if ( true && module.exports) {
    classNames.default = classNames;
    module.exports = classNames;
  } else if (true) {
    // register as 'classnames', consistent with npm package name
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return classNames;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Attachments: function() { return /* reexport */ attachments; },
  Bubble: function() { return /* reexport */ bubble; },
  Conversations: function() { return /* reexport */ conversations; },
  Prompts: function() { return /* reexport */ prompts; },
  Sender: function() { return /* reexport */ sender; },
  Suggestion: function() { return /* reexport */ suggestion; },
  ThoughtChain: function() { return /* reexport */ thought_chain; },
  Welcome: function() { return /* reexport */ welcome; },
  XProvider: function() { return /* reexport */ x_provider; },
  XRequest: function() { return /* reexport */ x_request; },
  XStream: function() { return /* reexport */ x_stream; },
  useXAgent: function() { return /* reexport */ useXAgent; },
  useXChat: function() { return /* reexport */ useXChat; },
  version: function() { return /* reexport */ components_version; }
});

;// CONCATENATED MODULE: ./components/version/version.ts
/* harmony default export */ var version_version = ('1.0.1');
;// CONCATENATED MODULE: ./components/version/index.ts
// @ts-ignore

/* harmony default export */ var components_version = (version_version);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(667);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: external "React"
var external_React_ = __webpack_require__(24);
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_);
;// CONCATENATED MODULE: ./components/x-provider/context.ts

const XProviderContext = /*#__PURE__*/external_React_default().createContext({});
/* harmony default export */ var context = (XProviderContext);
;// CONCATENATED MODULE: ./components/_util/hooks/use-x-component-config.ts


const defaultXComponentStyleConfig = {
  classNames: {},
  styles: {},
  className: '',
  style: {}
};
const useXComponentConfig = component => {
  const xProviderContext = external_React_default().useContext(context);
  return external_React_default().useMemo(() => ({
    ...defaultXComponentStyleConfig,
    ...xProviderContext[component]
  }), [xProviderContext[component]]);
};
/* harmony default export */ var use_x_component_config = (useXComponentConfig);
// EXTERNAL MODULE: external "antd"
var external_antd_ = __webpack_require__(721);
;// CONCATENATED MODULE: ./components/x-provider/hooks/use-x-provider-context.ts


const defaultPrefixCls = 'ant';
function useXProviderContext() {
  const {
    getPrefixCls,
    direction,
    csp,
    iconPrefixCls,
    theme
  } = external_React_default().useContext(external_antd_.ConfigProvider.ConfigContext);
  return {
    theme,
    getPrefixCls,
    direction,
    csp,
    iconPrefixCls
  };
}
/* harmony default export */ var use_x_provider_context = (useXProviderContext);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useEvent.js

function useEvent(callback) {
  var fnRef = external_React_.useRef();
  fnRef.current = callback;
  var memoFn = external_React_.useCallback(function () {
    var _fnRef$current;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return (_fnRef$current = fnRef.current) === null || _fnRef$current === void 0 ? void 0 : _fnRef$current.call.apply(_fnRef$current, [fnRef].concat(args));
  }, []);
  return memoFn;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js




function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}

;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/canUseDom.js
function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useLayoutEffect.js



/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */
var useInternalLayoutEffect =  true && canUseDom() ? external_React_.useLayoutEffect : external_React_.useEffect;
var useLayoutEffect = function useLayoutEffect(callback, deps) {
  var firstMountRef = external_React_.useRef(true);
  useInternalLayoutEffect(function () {
    return callback(firstMountRef.current);
  }, deps);

  // We tell react that first mount has passed
  useInternalLayoutEffect(function () {
    firstMountRef.current = false;
    return function () {
      firstMountRef.current = true;
    };
  }, []);
};
var useLayoutUpdateEffect = function useLayoutUpdateEffect(callback, deps) {
  useLayoutEffect(function (firstMount) {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};
/* harmony default export */ var hooks_useLayoutEffect = ((/* unused pure expression or super */ null && (useLayoutEffect)));
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useState.js


/**
 * Same as React.useState but `setState` accept `ignoreDestroy` param to not to setState after destroyed.
 * We do not make this auto is to avoid real memory leak.
 * Developer should confirm it's safe to ignore themselves.
 */
function useSafeState(defaultValue) {
  var destroyRef = external_React_.useRef(false);
  var _React$useState = external_React_.useState(defaultValue),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    value = _React$useState2[0],
    setValue = _React$useState2[1];
  external_React_.useEffect(function () {
    destroyRef.current = false;
    return function () {
      destroyRef.current = true;
    };
  }, []);
  function safeSetState(updater, ignoreDestroy) {
    if (ignoreDestroy && destroyRef.current) {
      return;
    }
    setValue(updater);
  }
  return [value, safeSetState];
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useMergedState.js




/** We only think `undefined` is empty */
function hasValue(value) {
  return value !== undefined;
}

/**
 * Similar to `useState` but will use props value if provided.
 * Note that internal use rc-util `useState` hook.
 */
function useMergedState(defaultStateValue, option) {
  var _ref = option || {},
    defaultValue = _ref.defaultValue,
    value = _ref.value,
    onChange = _ref.onChange,
    postState = _ref.postState;

  // ======================= Init =======================
  var _useState = useSafeState(function () {
      if (hasValue(value)) {
        return value;
      } else if (hasValue(defaultValue)) {
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      } else {
        return typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
      }
    }),
    _useState2 = _slicedToArray(_useState, 2),
    innerValue = _useState2[0],
    setInnerValue = _useState2[1];
  var mergedValue = value !== undefined ? value : innerValue;
  var postMergedValue = postState ? postState(mergedValue) : mergedValue;

  // ====================== Change ======================
  var onChangeFn = useEvent(onChange);
  var _useState3 = useSafeState([mergedValue]),
    _useState4 = _slicedToArray(_useState3, 2),
    prevValue = _useState4[0],
    setPrevValue = _useState4[1];
  useLayoutUpdateEffect(function () {
    var prev = prevValue[0];
    if (innerValue !== prev) {
      onChangeFn(innerValue, prev);
    }
  }, [prevValue]);

  // Sync value back to `undefined` when it from control to un-control
  useLayoutUpdateEffect(function () {
    if (!hasValue(value)) {
      setInnerValue(value);
    }
  }, [value]);

  // ====================== Update ======================
  var triggerChange = useEvent(function (updater, ignoreDestroy) {
    setInnerValue(updater, ignoreDestroy);
    setPrevValue([mergedValue], ignoreDestroy);
  });
  return [postMergedValue, triggerChange];
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function typeof_typeof(o) {
  "@babel/helpers - typeof";

  return typeof_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, typeof_typeof(o);
}

// EXTERNAL MODULE: ./node_modules/rc-util/node_modules/react-is/index.js
var react_is = __webpack_require__(851);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useMemo.js

function useMemo(getValue, condition, shouldUpdate) {
  var cacheRef = external_React_.useRef({});
  if (!('value' in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
    cacheRef.current.value = getValue();
    cacheRef.current.condition = condition;
  }
  return cacheRef.current.value;
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/ref.js




var fillRef = function fillRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (typeof_typeof(ref) === 'object' && ref && 'current' in ref) {
    ref.current = node;
  }
};

/**
 * Merge refs into one ref function to support ref passing.
 */
var composeRef = function composeRef() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }
  var refList = refs.filter(Boolean);
  if (refList.length <= 1) {
    return refList[0];
  }
  return function (node) {
    refs.forEach(function (ref) {
      fillRef(ref, node);
    });
  };
};
var useComposeRef = function useComposeRef() {
  for (var _len2 = arguments.length, refs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    refs[_key2] = arguments[_key2];
  }
  return useMemo(function () {
    return composeRef.apply(void 0, refs);
  }, refs, function (prev, next) {
    return prev.length !== next.length || prev.every(function (ref, i) {
      return ref !== next[i];
    });
  });
};
var supportRef = function supportRef(nodeOrComponent) {
  var _type$prototype, _nodeOrComponent$prot;
  var type = (0,react_is.isMemo)(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;

  // Function component node
  if (typeof type === 'function' && !((_type$prototype = type.prototype) !== null && _type$prototype !== void 0 && _type$prototype.render) && type.$$typeof !== react_is.ForwardRef) {
    return false;
  }

  // Class component
  if (typeof nodeOrComponent === 'function' && !((_nodeOrComponent$prot = nodeOrComponent.prototype) !== null && _nodeOrComponent$prot !== void 0 && _nodeOrComponent$prot.render) && nodeOrComponent.$$typeof !== react_is.ForwardRef) {
    return false;
  }
  return true;
};
function isReactElement(node) {
  return /*#__PURE__*/ /*#__PURE__*/(0,external_React_.isValidElement)(node) && !(0,react_is.isFragment)(node);
}
var supportNodeRef = function supportNodeRef(node) {
  return isReactElement(node) && supportRef(node);
};

/**
 * In React 19. `ref` is not a property from node.
 * But a property from `props.ref`.
 * To check if `props.ref` exist or fallback to `ref`.
 */
var getNodeRef = Number(external_React_.version.split('.')[0]) >= 19 ?
// >= React 19
function (node) {
  if (isReactElement(node)) {
    return node.props.ref;
  }
  return null;
} :
// < React 19
function (node) {
  if (isReactElement(node)) {
    return node.ref;
  }
  return null;
};
;// CONCATENATED MODULE: ./node_modules/rc-util/es/utils/set.js





function internalSet(entity, paths, value, removeIfUndefined) {
  if (!paths.length) {
    return value;
  }
  var _paths = _toArray(paths),
    path = _paths[0],
    restPath = _paths.slice(1);
  var clone;
  if (!entity && typeof path === 'number') {
    clone = [];
  } else if (Array.isArray(entity)) {
    clone = _toConsumableArray(entity);
  } else {
    clone = _objectSpread({}, entity);
  }

  // Delete prop if `removeIfUndefined` and value is undefined
  if (removeIfUndefined && value === undefined && restPath.length === 1) {
    delete clone[path][restPath[0]];
  } else {
    clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined);
  }
  return clone;
}
function set(entity, paths, value) {
  var removeIfUndefined = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  // Do nothing if `removeIfUndefined` and parent object not exist
  if (paths.length && removeIfUndefined && value === undefined && !get(entity, paths.slice(0, -1))) {
    return entity;
  }
  return internalSet(entity, paths, value, removeIfUndefined);
}
function isObject(obj) {
  return _typeof(obj) === 'object' && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}
function createEmpty(source) {
  return Array.isArray(source) ? [] : {};
}
var keys = typeof Reflect === 'undefined' ? Object.keys : Reflect.ownKeys;

/**
 * Merge objects which will create
 */
function merge() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }
  var clone = createEmpty(sources[0]);
  sources.forEach(function (src) {
    function internalMerge(path, parentLoopSet) {
      var loopSet = new Set(parentLoopSet);
      var value = get(src, path);
      var isArr = Array.isArray(value);
      if (isArr || isObject(value)) {
        // Only add not loop obj
        if (!loopSet.has(value)) {
          loopSet.add(value);
          var originValue = get(clone, path);
          if (isArr) {
            // Array will always be override
            clone = set(clone, path, []);
          } else if (!originValue || _typeof(originValue) !== 'object') {
            // Init container if not exist
            clone = set(clone, path, createEmpty(value));
          }
          keys(value).forEach(function (key) {
            internalMerge([].concat(_toConsumableArray(path), [key]), loopSet);
          });
        }
      } else {
        clone = set(clone, path, value);
      }
    }
    internalMerge([]);
  });
  return clone;
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/warning.js
/* eslint-disable no-console */
var warned = {};
var preWarningFns = [];

/**
 * Pre warning enable you to parse content before console.error.
 * Modify to null will prevent warning.
 */
var preMessage = function preMessage(fn) {
  preWarningFns.push(fn);
};

/**
 * Warning if condition not match.
 * @param valid Condition
 * @param message Warning message
 * @example
 * ```js
 * warning(false, 'some error'); // print some error
 * warning(true, 'some error'); // print nothing
 * warning(1 === 2, 'some error'); // print some error
 * ```
 */
function warning(valid, message) {
  if (false) { var finalMessage; }
}

/** @see Similar to {@link warning} */
function note(valid, message) {
  if (false) { var finalMessage; }
}
function resetWarned() {
  warned = {};
}
function call(method, valid, message) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}

/** @see Same as {@link warning}, but only warn once for the same message */
function warningOnce(valid, message) {
  call(warning, valid, message);
}

/** @see Same as {@link warning}, but only warn once for the same message */
function noteOnce(valid, message) {
  call(note, valid, message);
}
warningOnce.preMessage = preMessage;
warningOnce.resetWarned = resetWarned;
warningOnce.noteOnce = noteOnce;
/* harmony default export */ var es_warning = (warningOnce);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/index.js






// EXTERNAL MODULE: external "ReactDOM"
var external_ReactDOM_ = __webpack_require__(314);
var external_ReactDOM_default = /*#__PURE__*/__webpack_require__.n(external_ReactDOM_);
;// CONCATENATED MODULE: ./components/attachments/context.tsx

const AttachmentContext = /*#__PURE__*/external_React_default().createContext(null);
;// CONCATENATED MODULE: ./components/attachments/DropArea.tsx




function DropArea(props) {
  const {
    getDropContainer,
    className,
    prefixCls,
    children
  } = props;
  const {
    disabled
  } = external_React_default().useContext(AttachmentContext);
  const [container, setContainer] = external_React_default().useState();
  const [showArea, setShowArea] = external_React_default().useState(null);

  // ========================== Container ===========================
  external_React_default().useEffect(() => {
    const nextContainer = getDropContainer?.();
    if (container !== nextContainer) {
      setContainer(nextContainer);
    }
  }, [getDropContainer]);

  // ============================= Drop =============================
  external_React_default().useEffect(() => {
    // Add global drop event
    if (container) {
      const onDragEnter = () => {
        setShowArea(true);
      };

      // Should prevent default to make drop event work
      const onDragOver = e => {
        e.preventDefault();
      };
      const onDragLeave = e => {
        if (!e.relatedTarget) {
          setShowArea(false);
        }
      };
      const onDrop = e => {
        setShowArea(false);
        e.preventDefault();
      };
      document.addEventListener('dragenter', onDragEnter);
      document.addEventListener('dragover', onDragOver);
      document.addEventListener('dragleave', onDragLeave);
      document.addEventListener('drop', onDrop);
      return () => {
        document.removeEventListener('dragenter', onDragEnter);
        document.removeEventListener('dragover', onDragOver);
        document.removeEventListener('dragleave', onDragLeave);
        document.removeEventListener('drop', onDrop);
      };
    }
  }, [!!container]);

  // =========================== Visible ============================
  const showDropdown = getDropContainer && container && !disabled;

  // ============================ Render ============================
  if (!showDropdown) {
    return null;
  }
  const areaCls = `${prefixCls}-drop-area`;
  return /*#__PURE__*/(0,external_ReactDOM_.createPortal)( /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(areaCls, className, {
      [`${areaCls}-on-body`]: container.tagName === 'BODY'
    }),
    style: {
      display: showArea ? 'block' : 'none'
    }
  }, children), container);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/PlusOutlined.js
// This icon file is generated automatically.
var PlusOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"
      }
    }, {
      "tag": "path",
      "attrs": {
        "d": "M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"
      }
    }]
  },
  "name": "plus",
  "theme": "outlined"
};
/* harmony default export */ var asn_PlusOutlined = (PlusOutlined);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function toPrimitive(t, r) {
  if ("object" != typeof_typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof_typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == typeof_typeof(i) ? i : i + "";
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js

function objectWithoutProperties_objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}

;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/node_modules/@ctrl/tinycolor/dist/module/util.js
/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
function util_bound01(n, max) {
  if (isOnePointZero(n)) {
    n = '100%';
  }
  var isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
  // Automatically convert percentage into number
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }
  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }
  // Convert into [0, 1] range if it isn't already
  if (max === 360) {
    // If n is a hue given in degrees,
    // wrap around out-of-range values into [0, 360] range
    // then convert into [0, 1].
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    // If n not a hue given in degrees
    // Convert into [0, 1] range if it isn't already.
    n = n % max / parseFloat(String(max));
  }
  return n;
}
/**
 * Force a number between 0 and 1
 * @hidden
 */
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
function isOnePointZero(n) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}
/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
function isPercentage(n) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
}
/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}
/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
function convertToPercentage(n) {
  if (n <= 1) {
    return "".concat(Number(n) * 100, "%");
  }
  return n;
}
/**
 * Force a hex value to have 2 characters
 * @hidden
 */
function util_pad2(c) {
  return c.length === 1 ? '0' + c : String(c);
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/node_modules/@ctrl/tinycolor/dist/module/conversion.js

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */
function rgbToRgb(r, g, b) {
  return {
    r: util_bound01(r, 255) * 255,
    g: util_bound01(g, 255) * 255,
    b: util_bound01(b, 255) * 255
  };
}
/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]
 */
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var s = 0;
  var l = (max + min) / 2;
  if (max === min) {
    s = 0;
    h = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l
  };
}
function hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * (6 * t);
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}
/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hslToRgb(h, s, l) {
  var r;
  var g;
  var b;
  h = util_bound01(h, 360);
  s = util_bound01(s, 100);
  l = util_bound01(l, 100);
  if (s === 0) {
    // achromatic
    g = l;
    b = l;
    r = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]
 */
function rgbToHsv(r, g, b) {
  r = util_bound01(r, 255);
  g = util_bound01(g, 255);
  b = util_bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var v = max;
  var d = max - min;
  var s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    v: v
  };
}
/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hsvToRgb(h, s, v) {
  h = util_bound01(h, 360) * 6;
  s = util_bound01(s, 100);
  v = util_bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
/**
 * Converts an RGB color to hex
 *
 * Assumes r, g, and b are contained in the set [0, 255]
 * Returns a 3 or 6 character hex
 */
function rgbToHex(r, g, b, allow3Char) {
  var hex = [util_pad2(Math.round(r).toString(16)), util_pad2(Math.round(g).toString(16)), util_pad2(Math.round(b).toString(16))];
  // Return a 3 character hex if possible
  if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join('');
}
/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * Assumes r, g, b are contained in the set [0, 255] and
 * a in [0, 1]. Returns a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16)), pad2(convertDecimalToHex(a))];
  // Return a 4 character hex if possible
  if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join('');
}
/**
 * Converts an RGBA color to an ARGB Hex8 string
 * Rarely used, but required for "toFilter()"
 */
function rgbaToArgbHex(r, g, b, a) {
  var hex = [pad2(convertDecimalToHex(a)), pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  return hex.join('');
}
/** Converts a decimal to a hex value */
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 0xff00) >> 8,
    b: color & 0xff
  };
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
// https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
/**
 * @hidden
 */
var names = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  goldenrod: '#daa520',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavenderblush: '#fff0f5',
  lavender: '#e6e6fa',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};
;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/node_modules/@ctrl/tinycolor/dist/module/format-input.js
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */



/**
 * Given a string or object, convert that input to RGB
 *
 * Possible string inputs:
 * ```
 * "red"
 * "#f00" or "f00"
 * "#ff0000" or "ff0000"
 * "#ff000000" or "ff000000"
 * "rgb 255 0 0" or "rgb (255, 0, 0)"
 * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
 * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
 * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
 * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
 * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
 * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
 * ```
 */
function inputToRGB(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color === 'string') {
    color = stringInputToObject(color);
  }
  if (typeof color === 'object') {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = 'hsv';
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = 'hsl';
    }
    if (Object.prototype.hasOwnProperty.call(color, 'a')) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok: ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a
  };
}
// <http://www.w3.org/TR/css3-values/#integers>
var CSS_INTEGER = '[-\\+]?\\d+%?';
// <http://www.w3.org/TR/css3-values/#number-value>
var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var matchers = {
  CSS_UNIT: new RegExp(CSS_UNIT),
  rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
  rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
  hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
  hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
  hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
  hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
 */
function stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === 'transparent') {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: 'name'
    };
  }
  // Try to match string input using regular expressions.
  // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the tinycolor is initialized with string or object.
  var match = matchers.rgb.exec(color);
  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }
  match = matchers.hsl.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }
  match = matchers.hsla.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }
  match = matchers.hsv.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }
  match = matchers.hsva.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? 'name' : 'hex8'
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? 'name' : 'hex'
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? 'name' : 'hex8'
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? 'name' : 'hex'
    };
  }
  return false;
}
/**
 * Check to see if it looks like a CSS unit
 * (see `matchers` above for definition).
 */
function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/es/generate.js

var hueStep = 2; // 色相阶梯
var saturationStep = 0.16; // 饱和度阶梯，浅色部分
var saturationStep2 = 0.05; // 饱和度阶梯，深色部分
var brightnessStep1 = 0.05; // 亮度阶梯，浅色部分
var brightnessStep2 = 0.15; // 亮度阶梯，深色部分
var lightColorCount = 5; // 浅色数量，主色上
var darkColorCount = 4; // 深色数量，主色下
// 暗色主题颜色映射关系表
var darkColorMap = [{
  index: 7,
  opacity: 0.15
}, {
  index: 6,
  opacity: 0.25
}, {
  index: 5,
  opacity: 0.3
}, {
  index: 5,
  opacity: 0.45
}, {
  index: 5,
  opacity: 0.65
}, {
  index: 5,
  opacity: 0.85
}, {
  index: 4,
  opacity: 0.9
}, {
  index: 3,
  opacity: 0.95
}, {
  index: 2,
  opacity: 0.97
}, {
  index: 1,
  opacity: 0.98
}];
// Wrapper function ported from TinyColor.prototype.toHsv
// Keep it here because of `hsv.h * 360`
function toHsv(_ref) {
  var r = _ref.r,
    g = _ref.g,
    b = _ref.b;
  var hsv = rgbToHsv(r, g, b);
  return {
    h: hsv.h * 360,
    s: hsv.s,
    v: hsv.v
  };
}

// Wrapper function ported from TinyColor.prototype.toHexString
// Keep it here because of the prefix `#`
function toHex(_ref2) {
  var r = _ref2.r,
    g = _ref2.g,
    b = _ref2.b;
  return "#".concat(rgbToHex(r, g, b, false));
}

// Wrapper function ported from TinyColor.prototype.mix, not treeshakable.
// Amount in range [0, 1]
// Assume color1 & color2 has no alpha, since the following src code did so.
function mix(rgb1, rgb2, amount) {
  var p = amount / 100;
  var rgb = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b
  };
  return rgb;
}
function getHue(hsv, i, light) {
  var hue;
  // 根据色相不同，色相转向不同
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}
function getSaturation(hsv, i, light) {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  var saturation;
  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }
  // 边界值修正
  if (saturation > 1) {
    saturation = 1;
  }
  // 第一格的 s 限制在 0.06-0.1 之间
  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1;
  }
  if (saturation < 0.06) {
    saturation = 0.06;
  }
  return Number(saturation.toFixed(2));
}
function getValue(hsv, i, light) {
  var value;
  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }
  if (value > 1) {
    value = 1;
  }
  return Number(value.toFixed(2));
}
function generate(color) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var patterns = [];
  var pColor = inputToRGB(color);
  for (var i = lightColorCount; i > 0; i -= 1) {
    var hsv = toHsv(pColor);
    var colorString = toHex(inputToRGB({
      h: getHue(hsv, i, true),
      s: getSaturation(hsv, i, true),
      v: getValue(hsv, i, true)
    }));
    patterns.push(colorString);
  }
  patterns.push(toHex(pColor));
  for (var _i = 1; _i <= darkColorCount; _i += 1) {
    var _hsv = toHsv(pColor);
    var _colorString = toHex(inputToRGB({
      h: getHue(_hsv, _i),
      s: getSaturation(_hsv, _i),
      v: getValue(_hsv, _i)
    }));
    patterns.push(_colorString);
  }

  // dark theme patterns
  if (opts.theme === 'dark') {
    return darkColorMap.map(function (_ref3) {
      var index = _ref3.index,
        opacity = _ref3.opacity;
      var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || '#141414'), inputToRGB(patterns[index]), opacity * 100));
      return darkColorString;
    });
  }
  return patterns;
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/es/presets.js
// Generated by script. Do NOT modify!

var presetPrimaryColors = {
  "red": "#F5222D",
  "volcano": "#FA541C",
  "orange": "#FA8C16",
  "gold": "#FAAD14",
  "yellow": "#FADB14",
  "lime": "#A0D911",
  "green": "#52C41A",
  "cyan": "#13C2C2",
  "blue": "#1677FF",
  "geekblue": "#2F54EB",
  "purple": "#722ED1",
  "magenta": "#EB2F96",
  "grey": "#666666"
};
var red = ["#fff1f0", "#ffccc7", "#ffa39e", "#ff7875", "#ff4d4f", "#f5222d", "#cf1322", "#a8071a", "#820014", "#5c0011"];
red.primary = red[5];
var volcano = ["#fff2e8", "#ffd8bf", "#ffbb96", "#ff9c6e", "#ff7a45", "#fa541c", "#d4380d", "#ad2102", "#871400", "#610b00"];
volcano.primary = volcano[5];
var orange = ["#fff7e6", "#ffe7ba", "#ffd591", "#ffc069", "#ffa940", "#fa8c16", "#d46b08", "#ad4e00", "#873800", "#612500"];
orange.primary = orange[5];
var gold = ["#fffbe6", "#fff1b8", "#ffe58f", "#ffd666", "#ffc53d", "#faad14", "#d48806", "#ad6800", "#874d00", "#613400"];
gold.primary = gold[5];
var yellow = ["#feffe6", "#ffffb8", "#fffb8f", "#fff566", "#ffec3d", "#fadb14", "#d4b106", "#ad8b00", "#876800", "#614700"];
yellow.primary = yellow[5];
var lime = ["#fcffe6", "#f4ffb8", "#eaff8f", "#d3f261", "#bae637", "#a0d911", "#7cb305", "#5b8c00", "#3f6600", "#254000"];
lime.primary = lime[5];
var green = ["#f6ffed", "#d9f7be", "#b7eb8f", "#95de64", "#73d13d", "#52c41a", "#389e0d", "#237804", "#135200", "#092b00"];
green.primary = green[5];
var cyan = ["#e6fffb", "#b5f5ec", "#87e8de", "#5cdbd3", "#36cfc9", "#13c2c2", "#08979c", "#006d75", "#00474f", "#002329"];
cyan.primary = cyan[5];
var blue = ["#e6f4ff", "#bae0ff", "#91caff", "#69b1ff", "#4096ff", "#1677ff", "#0958d9", "#003eb3", "#002c8c", "#001d66"];
blue.primary = blue[5];
var geekblue = ["#f0f5ff", "#d6e4ff", "#adc6ff", "#85a5ff", "#597ef7", "#2f54eb", "#1d39c4", "#10239e", "#061178", "#030852"];
geekblue.primary = geekblue[5];
var purple = ["#f9f0ff", "#efdbff", "#d3adf7", "#b37feb", "#9254de", "#722ed1", "#531dab", "#391085", "#22075e", "#120338"];
purple.primary = purple[5];
var magenta = ["#fff0f6", "#ffd6e7", "#ffadd2", "#ff85c0", "#f759ab", "#eb2f96", "#c41d7f", "#9e1068", "#780650", "#520339"];
magenta.primary = magenta[5];
var grey = ["#a6a6a6", "#999999", "#8c8c8c", "#808080", "#737373", "#666666", "#404040", "#1a1a1a", "#000000", "#000000"];
grey.primary = grey[5];
var gray = (/* unused pure expression or super */ null && (grey));
var presetPalettes = {
  red: red,
  volcano: volcano,
  orange: orange,
  gold: gold,
  yellow: yellow,
  lime: lime,
  green: green,
  cyan: cyan,
  blue: blue,
  geekblue: geekblue,
  purple: purple,
  magenta: magenta,
  grey: grey
};
var redDark = ["#2a1215", "#431418", "#58181c", "#791a1f", "#a61d24", "#d32029", "#e84749", "#f37370", "#f89f9a", "#fac8c3"];
redDark.primary = redDark[5];
var volcanoDark = ["#2b1611", "#441d12", "#592716", "#7c3118", "#aa3e19", "#d84a1b", "#e87040", "#f3956a", "#f8b692", "#fad4bc"];
volcanoDark.primary = volcanoDark[5];
var orangeDark = ["#2b1d11", "#442a11", "#593815", "#7c4a15", "#aa6215", "#d87a16", "#e89a3c", "#f3b765", "#f8cf8d", "#fae3b7"];
orangeDark.primary = orangeDark[5];
var goldDark = ["#2b2111", "#443111", "#594214", "#7c5914", "#aa7714", "#d89614", "#e8b339", "#f3cc62", "#f8df8b", "#faedb5"];
goldDark.primary = goldDark[5];
var yellowDark = ["#2b2611", "#443b11", "#595014", "#7c6e14", "#aa9514", "#d8bd14", "#e8d639", "#f3ea62", "#f8f48b", "#fafab5"];
yellowDark.primary = yellowDark[5];
var limeDark = ["#1f2611", "#2e3c10", "#3e4f13", "#536d13", "#6f9412", "#8bbb11", "#a9d134", "#c9e75d", "#e4f88b", "#f0fab5"];
limeDark.primary = limeDark[5];
var greenDark = ["#162312", "#1d3712", "#274916", "#306317", "#3c8618", "#49aa19", "#6abe39", "#8fd460", "#b2e58b", "#d5f2bb"];
greenDark.primary = greenDark[5];
var cyanDark = ["#112123", "#113536", "#144848", "#146262", "#138585", "#13a8a8", "#33bcb7", "#58d1c9", "#84e2d8", "#b2f1e8"];
cyanDark.primary = cyanDark[5];
var blueDark = ["#111a2c", "#112545", "#15325b", "#15417e", "#1554ad", "#1668dc", "#3c89e8", "#65a9f3", "#8dc5f8", "#b7dcfa"];
blueDark.primary = blueDark[5];
var geekblueDark = ["#131629", "#161d40", "#1c2755", "#203175", "#263ea0", "#2b4acb", "#5273e0", "#7f9ef3", "#a8c1f8", "#d2e0fa"];
geekblueDark.primary = geekblueDark[5];
var purpleDark = ["#1a1325", "#24163a", "#301c4d", "#3e2069", "#51258f", "#642ab5", "#854eca", "#ab7ae0", "#cda8f0", "#ebd7fa"];
purpleDark.primary = purpleDark[5];
var magentaDark = ["#291321", "#40162f", "#551c3b", "#75204f", "#a02669", "#cb2b83", "#e0529c", "#f37fb7", "#f8a8cc", "#fad2e3"];
magentaDark.primary = magentaDark[5];
var greyDark = ["#151515", "#1f1f1f", "#2d2d2d", "#393939", "#494949", "#5a5a5a", "#6a6a6a", "#7b7b7b", "#888888", "#969696"];
greyDark.primary = greyDark[5];
var presetDarkPalettes = {
  red: redDark,
  volcano: volcanoDark,
  orange: orangeDark,
  gold: goldDark,
  yellow: yellowDark,
  lime: limeDark,
  green: greenDark,
  cyan: cyanDark,
  blue: blueDark,
  geekblue: geekblueDark,
  purple: purpleDark,
  magenta: magentaDark,
  grey: greyDark
};
;// CONCATENATED MODULE: ./node_modules/@ant-design/colors/es/index.js



;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/components/Context.js

var IconContext = /*#__PURE__*/(0,external_React_.createContext)({});
/* harmony default export */ var Context = (IconContext);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}

;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/contains.js
function contains(root, n) {
  if (!root) {
    return false;
  }

  // Use native if support
  if (root.contains) {
    return root.contains(n);
  }

  // `document.contains` not support with IE11
  var node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/dynamicCSS.js



var APPEND_ORDER = 'data-rc-order';
var APPEND_PRIORITY = 'data-rc-priority';
var MARK_KEY = "rc-util-key";
var containerCache = new Map();
function getMark() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    mark = _ref.mark;
  if (mark) {
    return mark.startsWith('data-') ? mark : "data-".concat(mark);
  }
  return MARK_KEY;
}
function getContainer(option) {
  if (option.attachTo) {
    return option.attachTo;
  }
  var head = document.querySelector('head');
  return head || document.body;
}
function getOrder(prepend) {
  if (prepend === 'queue') {
    return 'prependQueue';
  }
  return prepend ? 'prepend' : 'append';
}

/**
 * Find style which inject by rc-util
 */
function findStyles(container) {
  return Array.from((containerCache.get(container) || container).children).filter(function (node) {
    return node.tagName === 'STYLE';
  });
}
function injectCSS(css) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!canUseDom()) {
    return null;
  }
  var csp = option.csp,
    prepend = option.prepend,
    _option$priority = option.priority,
    priority = _option$priority === void 0 ? 0 : _option$priority;
  var mergedOrder = getOrder(prepend);
  var isPrependQueue = mergedOrder === 'prependQueue';
  var styleNode = document.createElement('style');
  styleNode.setAttribute(APPEND_ORDER, mergedOrder);
  if (isPrependQueue && priority) {
    styleNode.setAttribute(APPEND_PRIORITY, "".concat(priority));
  }
  if (csp !== null && csp !== void 0 && csp.nonce) {
    styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
  }
  styleNode.innerHTML = css;
  var container = getContainer(option);
  var firstChild = container.firstChild;
  if (prepend) {
    // If is queue `prepend`, it will prepend first style and then append rest style
    if (isPrependQueue) {
      var existStyle = (option.styles || findStyles(container)).filter(function (node) {
        // Ignore style which not injected by rc-util with prepend
        if (!['prepend', 'prependQueue'].includes(node.getAttribute(APPEND_ORDER))) {
          return false;
        }

        // Ignore style which priority less then new style
        var nodePriority = Number(node.getAttribute(APPEND_PRIORITY) || 0);
        return priority >= nodePriority;
      });
      if (existStyle.length) {
        container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
        return styleNode;
      }
    }

    // Use `insertBefore` as `prepend`
    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }
  return styleNode;
}
function findExistNode(key) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var container = getContainer(option);
  return (option.styles || findStyles(container)).find(function (node) {
    return node.getAttribute(getMark(option)) === key;
  });
}
function removeCSS(key) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var existNode = findExistNode(key, option);
  if (existNode) {
    var container = getContainer(option);
    container.removeChild(existNode);
  }
}

/**
 * qiankun will inject `appendChild` to insert into other
 */
function syncRealContainer(container, option) {
  var cachedRealContainer = containerCache.get(container);

  // Find real container when not cached or cached container removed
  if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
    var placeholderStyle = injectCSS('', option);
    var parentNode = placeholderStyle.parentNode;
    containerCache.set(container, parentNode);
    container.removeChild(placeholderStyle);
  }
}

/**
 * manually clear container cache to avoid global cache in unit testes
 */
function clearContainerCache() {
  containerCache.clear();
}
function updateCSS(css, key) {
  var originOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var container = getContainer(originOption);
  var styles = findStyles(container);
  var option = _objectSpread2(_objectSpread2({}, originOption), {}, {
    styles: styles
  });

  // Sync real parent
  syncRealContainer(container, option);
  var existNode = findExistNode(key, option);
  if (existNode) {
    var _option$csp, _option$csp2;
    if ((_option$csp = option.csp) !== null && _option$csp !== void 0 && _option$csp.nonce && existNode.nonce !== ((_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce)) {
      var _option$csp3;
      existNode.nonce = (_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce;
    }
    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }
    return existNode;
  }
  var newNode = injectCSS(css, option);
  newNode.setAttribute(getMark(option), key);
  return newNode;
}
;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/shadow.js
function getRoot(ele) {
  var _ele$getRootNode;
  return ele === null || ele === void 0 || (_ele$getRootNode = ele.getRootNode) === null || _ele$getRootNode === void 0 ? void 0 : _ele$getRootNode.call(ele);
}

/**
 * Check if is in shadowRoot
 */
function inShadow(ele) {
  return getRoot(ele) instanceof ShadowRoot;
}

/**
 * Return shadowRoot if possible
 */
function getShadowRoot(ele) {
  return inShadow(ele) ? getRoot(ele) : null;
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/utils.js








function camelCase(input) {
  return input.replace(/-(.)/g, function (match, g) {
    return g.toUpperCase();
  });
}
function utils_warning(valid, message) {
  es_warning(valid, "[@ant-design/icons] ".concat(message));
}
function isIconDefinition(target) {
  return typeof_typeof(target) === 'object' && typeof target.name === 'string' && typeof target.theme === 'string' && (typeof_typeof(target.icon) === 'object' || typeof target.icon === 'function');
}
function normalizeAttrs() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(attrs).reduce(function (acc, key) {
    var val = attrs[key];
    switch (key) {
      case 'class':
        acc.className = val;
        delete acc.class;
        break;
      default:
        delete acc[key];
        acc[camelCase(key)] = val;
    }
    return acc;
  }, {});
}
function utils_generate(node, key, rootProps) {
  if (!rootProps) {
    return /*#__PURE__*/external_React_default().createElement(node.tag, _objectSpread2({
      key: key
    }, normalizeAttrs(node.attrs)), (node.children || []).map(function (child, index) {
      return utils_generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
    }));
  }
  return /*#__PURE__*/external_React_default().createElement(node.tag, _objectSpread2(_objectSpread2({
    key: key
  }, normalizeAttrs(node.attrs)), rootProps), (node.children || []).map(function (child, index) {
    return utils_generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
  }));
}
function getSecondaryColor(primaryColor) {
  // choose the second color
  return generate(primaryColor)[0];
}
function normalizeTwoToneColors(twoToneColor) {
  if (!twoToneColor) {
    return [];
  }
  return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
}

// These props make sure that the SVG behaviours like general text.
// Reference: https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4
var svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false'
};
var iconStyles = "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
var useInsertStyles = function useInsertStyles(eleRef) {
  var _useContext = (0,external_React_.useContext)(Context),
    csp = _useContext.csp,
    prefixCls = _useContext.prefixCls;
  var mergedStyleStr = iconStyles;
  if (prefixCls) {
    mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
  }
  (0,external_React_.useEffect)(function () {
    var ele = eleRef.current;
    var shadowRoot = getShadowRoot(ele);
    updateCSS(mergedStyleStr, '@ant-design-icons', {
      prepend: true,
      csp: csp,
      attachTo: shadowRoot
    });
  }, []);
};
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/components/IconBase.js


var _excluded = ["icon", "className", "onClick", "style", "primaryColor", "secondaryColor"];


var twoToneColorPalette = {
  primaryColor: '#333',
  secondaryColor: '#E6E6E6',
  calculated: false
};
function setTwoToneColors(_ref) {
  var primaryColor = _ref.primaryColor,
    secondaryColor = _ref.secondaryColor;
  twoToneColorPalette.primaryColor = primaryColor;
  twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
  twoToneColorPalette.calculated = !!secondaryColor;
}
function getTwoToneColors() {
  return _objectSpread2({}, twoToneColorPalette);
}
var IconBase = function IconBase(props) {
  var icon = props.icon,
    className = props.className,
    onClick = props.onClick,
    style = props.style,
    primaryColor = props.primaryColor,
    secondaryColor = props.secondaryColor,
    restProps = objectWithoutProperties_objectWithoutProperties(props, _excluded);
  var svgRef = external_React_.useRef();
  var colors = twoToneColorPalette;
  if (primaryColor) {
    colors = {
      primaryColor: primaryColor,
      secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
    };
  }
  useInsertStyles(svgRef);
  utils_warning(isIconDefinition(icon), "icon should be icon definiton, but got ".concat(icon));
  if (!isIconDefinition(icon)) {
    return null;
  }
  var target = icon;
  if (target && typeof target.icon === 'function') {
    target = _objectSpread2(_objectSpread2({}, target), {}, {
      icon: target.icon(colors.primaryColor, colors.secondaryColor)
    });
  }
  return utils_generate(target.icon, "svg-".concat(target.name), _objectSpread2(_objectSpread2({
    className: className,
    onClick: onClick,
    style: style,
    'data-icon': target.name,
    width: '1em',
    height: '1em',
    fill: 'currentColor',
    'aria-hidden': 'true'
  }, restProps), {}, {
    ref: svgRef
  }));
};
IconBase.displayName = 'IconReact';
IconBase.getTwoToneColors = getTwoToneColors;
IconBase.setTwoToneColors = setTwoToneColors;
/* harmony default export */ var components_IconBase = (IconBase);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/components/twoTonePrimaryColor.js



function setTwoToneColor(twoToneColor) {
  var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor),
    _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2),
    primaryColor = _normalizeTwoToneColo2[0],
    secondaryColor = _normalizeTwoToneColo2[1];
  return components_IconBase.setTwoToneColors({
    primaryColor: primaryColor,
    secondaryColor: secondaryColor
  });
}
function getTwoToneColor() {
  var colors = components_IconBase.getTwoToneColors();
  if (!colors.calculated) {
    return colors.primaryColor;
  }
  return [colors.primaryColor, colors.secondaryColor];
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/components/AntdIcon.js
'use client';





var AntdIcon_excluded = ["className", "icon", "spin", "rotate", "tabIndex", "onClick", "twoToneColor"];







// Initial setting
// should move it to antd main repo?
setTwoToneColor(blue.primary);

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34757#issuecomment-488848720

var Icon = /*#__PURE__*/external_React_.forwardRef(function (props, ref) {
  var className = props.className,
    icon = props.icon,
    spin = props.spin,
    rotate = props.rotate,
    tabIndex = props.tabIndex,
    onClick = props.onClick,
    twoToneColor = props.twoToneColor,
    restProps = objectWithoutProperties_objectWithoutProperties(props, AntdIcon_excluded);
  var _React$useContext = external_React_.useContext(Context),
    _React$useContext$pre = _React$useContext.prefixCls,
    prefixCls = _React$useContext$pre === void 0 ? 'anticon' : _React$useContext$pre,
    rootClassName = _React$useContext.rootClassName;
  var classString = classnames_default()(rootClassName, prefixCls, _defineProperty(_defineProperty({}, "".concat(prefixCls, "-").concat(icon.name), !!icon.name), "".concat(prefixCls, "-spin"), !!spin || icon.name === 'loading'), className);
  var iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
  }
  var svgStyle = rotate ? {
    msTransform: "rotate(".concat(rotate, "deg)"),
    transform: "rotate(".concat(rotate, "deg)")
  } : undefined;
  var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor),
    _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2),
    primaryColor = _normalizeTwoToneColo2[0],
    secondaryColor = _normalizeTwoToneColo2[1];
  return /*#__PURE__*/external_React_.createElement("span", _extends({
    role: "img",
    "aria-label": icon.name
  }, restProps, {
    ref: ref,
    tabIndex: iconTabIndex,
    onClick: onClick,
    className: classString
  }), /*#__PURE__*/external_React_.createElement(components_IconBase, {
    icon: icon,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    style: svgStyle
  }));
});
Icon.displayName = 'AntdIcon';
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;
/* harmony default export */ var AntdIcon = (Icon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/PlusOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var PlusOutlined_PlusOutlined = function PlusOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_PlusOutlined
  }));
};

/**![plus](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQ4MiAxNTJoNjBxOCAwIDggOHY3MDRxMCA4LTggOGgtNjBxLTggMC04LThWMTYwcTAtOCA4LTh6IiAvPjxwYXRoIGQ9Ik0xOTIgNDc0aDY3MnE4IDAgOCA4djYwcTAgOC04IDhIMTYwcS04IDAtOC04di02MHEwLTggOC04eiIgLz48L3N2Zz4=) */
var RefIcon = /*#__PURE__*/external_React_.forwardRef(PlusOutlined_PlusOutlined);
if (false) {}
/* harmony default export */ var icons_PlusOutlined = (RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/LeftOutlined.js
// This icon file is generated automatically.
var LeftOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
      }
    }]
  },
  "name": "left",
  "theme": "outlined"
};
/* harmony default export */ var asn_LeftOutlined = (LeftOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/LeftOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var LeftOutlined_LeftOutlined = function LeftOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_LeftOutlined
  }));
};

/**![left](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcyNCAyMTguM1YxNDFjMC02LjctNy43LTEwLjQtMTIuOS02LjNMMjYwLjMgNDg2LjhhMzEuODYgMzEuODYgMCAwMDAgNTAuM2w0NTAuOCAzNTIuMWM1LjMgNC4xIDEyLjkuNCAxMi45LTYuM3YtNzcuM2MwLTQuOS0yLjMtOS42LTYuMS0xMi42bC0zNjAtMjgxIDM2MC0yODEuMWMzLjgtMyA2LjEtNy43IDYuMS0xMi42eiIgLz48L3N2Zz4=) */
var LeftOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(LeftOutlined_LeftOutlined);
if (false) {}
/* harmony default export */ var icons_LeftOutlined = (LeftOutlined_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/RightOutlined.js
// This icon file is generated automatically.
var RightOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"
      }
    }]
  },
  "name": "right",
  "theme": "outlined"
};
/* harmony default export */ var asn_RightOutlined = (RightOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/RightOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var RightOutlined_RightOutlined = function RightOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_RightOutlined
  }));
};

/**![right](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTc2NS43IDQ4Ni44TDMxNC45IDEzNC43QTcuOTcgNy45NyAwIDAwMzAyIDE0MXY3Ny4zYzAgNC45IDIuMyA5LjYgNi4xIDEyLjZsMzYwIDI4MS4xLTM2MCAyODEuMWMtMy45IDMtNi4xIDcuNy02LjEgMTIuNlY4ODNjMCA2LjcgNy43IDEwLjQgMTIuOSA2LjNsNDUwLjgtMzUyLjFhMzEuOTYgMzEuOTYgMCAwMDAtNTAuNHoiIC8+PC9zdmc+) */
var RightOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(RightOutlined_RightOutlined);
if (false) {}
/* harmony default export */ var icons_RightOutlined = (RightOutlined_RefIcon);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/Dom/findDOMNode.js



function isDOM(node) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Element
  // Since XULElement is also subclass of Element, we only need HTMLElement and SVGElement
  return node instanceof HTMLElement || node instanceof SVGElement;
}

/**
 * Retrieves a DOM node via a ref, and does not invoke `findDOMNode`.
 */
function getDOM(node) {
  if (node && typeof_typeof(node) === 'object' && isDOM(node.nativeElement)) {
    return node.nativeElement;
  }
  if (isDOM(node)) {
    return node;
  }
  return null;
}

/**
 * Return if a node is a DOM node. Else will return by `findDOMNode`
 */
function findDOMNode(node) {
  var domNode = getDOM(node);
  if (domNode) {
    return domNode;
  }
  if (node instanceof (external_React_default()).Component) {
    var _ReactDOM$findDOMNode;
    return (_ReactDOM$findDOMNode = (external_ReactDOM_default()).findDOMNode) === null || _ReactDOM$findDOMNode === void 0 ? void 0 : _ReactDOM$findDOMNode.call((external_ReactDOM_default()), node);
  }
  return null;
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/context.js

var context_excluded = (/* unused pure expression or super */ null && (["children"]));

var context_Context = /*#__PURE__*/external_React_.createContext({});
function MotionProvider(_ref) {
  var children = _ref.children,
    props = _objectWithoutProperties(_ref, context_excluded);
  return /*#__PURE__*/React.createElement(context_Context.Provider, {
    value: props
  }, children);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(t, "prototype", {
    writable: !1
  }), e && _setPrototypeOf(t, e);
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof_typeof(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createSuper.js



function _createSuper(t) {
  var r = _isNativeReflectConstruct();
  return function () {
    var e,
      o = _getPrototypeOf(t);
    if (r) {
      var s = _getPrototypeOf(this).constructor;
      e = Reflect.construct(o, arguments, s);
    } else e = o.apply(this, arguments);
    return _possibleConstructorReturn(this, e);
  };
}

;// CONCATENATED MODULE: ./node_modules/rc-motion/es/DomWrapper.js





var DomWrapper = /*#__PURE__*/function (_React$Component) {
  _inherits(DomWrapper, _React$Component);
  var _super = _createSuper(DomWrapper);
  function DomWrapper() {
    _classCallCheck(this, DomWrapper);
    return _super.apply(this, arguments);
  }
  _createClass(DomWrapper, [{
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return DomWrapper;
}(external_React_.Component);
/* harmony default export */ var es_DomWrapper = (DomWrapper);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/hooks/useSyncState.js



/**
 * Same as React.useState but will always get latest state.
 * This is useful when React merge multiple state updates into one.
 * e.g. onTransitionEnd trigger multiple event at once will be merged state update in React.
 */
function useSyncState(defaultValue) {
  var _React$useReducer = external_React_.useReducer(function (x) {
      return x + 1;
    }, 0),
    _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
    forceUpdate = _React$useReducer2[1];
  var currentValueRef = external_React_.useRef(defaultValue);
  var getValue = useEvent(function () {
    return currentValueRef.current;
  });
  var setValue = useEvent(function (updater) {
    currentValueRef.current = typeof updater === 'function' ? updater(currentValueRef.current) : updater;
    forceUpdate();
  });
  return [getValue, setValue];
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/interface.js
var STATUS_NONE = 'none';
var STATUS_APPEAR = 'appear';
var STATUS_ENTER = 'enter';
var STATUS_LEAVE = 'leave';
var STEP_NONE = 'none';
var STEP_PREPARE = 'prepare';
var STEP_START = 'start';
var STEP_ACTIVE = 'active';
var STEP_ACTIVATED = 'end';
/**
 * Used for disabled motion case.
 * Prepare stage will still work but start & active will be skipped.
 */
var STEP_PREPARED = 'prepared';
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/util/motion.js


// ================= Transition =================
// Event wrapper. Copy from react source code
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};
  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes["Webkit".concat(styleProp)] = "webkit".concat(eventName);
  prefixes["Moz".concat(styleProp)] = "moz".concat(eventName);
  prefixes["ms".concat(styleProp)] = "MS".concat(eventName);
  prefixes["O".concat(styleProp)] = "o".concat(eventName.toLowerCase());
  return prefixes;
}
function getVendorPrefixes(domSupport, win) {
  var prefixes = {
    animationend: makePrefixMap('Animation', 'AnimationEnd'),
    transitionend: makePrefixMap('Transition', 'TransitionEnd')
  };
  if (domSupport) {
    if (!('AnimationEvent' in win)) {
      delete prefixes.animationend.animation;
    }
    if (!('TransitionEvent' in win)) {
      delete prefixes.transitionend.transition;
    }
  }
  return prefixes;
}
var vendorPrefixes = getVendorPrefixes(canUseDom(), typeof window !== 'undefined' ? window : {});
var style = {};
if (canUseDom()) {
  var _document$createEleme = document.createElement('div');
  style = _document$createEleme.style;
}
var prefixedEventNames = {};
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  }
  var prefixMap = vendorPrefixes[eventName];
  if (prefixMap) {
    var stylePropList = Object.keys(prefixMap);
    var len = stylePropList.length;
    for (var i = 0; i < len; i += 1) {
      var styleProp = stylePropList[i];
      if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
        prefixedEventNames[eventName] = prefixMap[styleProp];
        return prefixedEventNames[eventName];
      }
    }
  }
  return '';
}
var internalAnimationEndName = getVendorPrefixedEventName('animationend');
var internalTransitionEndName = getVendorPrefixedEventName('transitionend');
var supportTransition = !!(internalAnimationEndName && internalTransitionEndName);
var animationEndName = internalAnimationEndName || 'animationend';
var transitionEndName = internalTransitionEndName || 'transitionend';
function getTransitionName(transitionName, transitionType) {
  if (!transitionName) return null;
  if (typeof_typeof(transitionName) === 'object') {
    var type = transitionType.replace(/-\w/g, function (match) {
      return match[1].toUpperCase();
    });
    return transitionName[type];
  }
  return "".concat(transitionName, "-").concat(transitionType);
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useDomMotionEvents.js



/* harmony default export */ var useDomMotionEvents = (function (onInternalMotionEnd) {
  var cacheElementRef = (0,external_React_.useRef)();

  // Remove events
  function removeMotionEvents(element) {
    if (element) {
      element.removeEventListener(transitionEndName, onInternalMotionEnd);
      element.removeEventListener(animationEndName, onInternalMotionEnd);
    }
  }

  // Patch events
  function patchMotionEvents(element) {
    if (cacheElementRef.current && cacheElementRef.current !== element) {
      removeMotionEvents(cacheElementRef.current);
    }
    if (element && element !== cacheElementRef.current) {
      element.addEventListener(transitionEndName, onInternalMotionEnd);
      element.addEventListener(animationEndName, onInternalMotionEnd);

      // Save as cache in case dom removed trigger by `motionDeadline`
      cacheElementRef.current = element;
    }
  }

  // Clean up when removed
  external_React_.useEffect(function () {
    return function () {
      removeMotionEvents(cacheElementRef.current);
    };
  }, []);
  return [patchMotionEvents, removeMotionEvents];
});
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useIsomorphicLayoutEffect.js



// It's safe to use `useLayoutEffect` but the warning is annoying
var useIsomorphicLayoutEffect = canUseDom() ? external_React_.useLayoutEffect : external_React_.useEffect;
/* harmony default export */ var hooks_useIsomorphicLayoutEffect = (useIsomorphicLayoutEffect);
;// CONCATENATED MODULE: ./node_modules/rc-util/es/raf.js
var raf = function raf(callback) {
  return +setTimeout(callback, 16);
};
var caf = function caf(num) {
  return clearTimeout(num);
};
if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
  raf = function raf(callback) {
    return window.requestAnimationFrame(callback);
  };
  caf = function caf(handle) {
    return window.cancelAnimationFrame(handle);
  };
}
var rafUUID = 0;
var rafIds = new Map();
function cleanup(id) {
  rafIds.delete(id);
}
var wrapperRaf = function wrapperRaf(callback) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  rafUUID += 1;
  var id = rafUUID;
  function callRef(leftTimes) {
    if (leftTimes === 0) {
      // Clean up
      cleanup(id);

      // Trigger
      callback();
    } else {
      // Next raf
      var realId = raf(function () {
        callRef(leftTimes - 1);
      });

      // Bind real raf id
      rafIds.set(id, realId);
    }
  }
  callRef(times);
  return id;
};
wrapperRaf.cancel = function (id) {
  var realId = rafIds.get(id);
  cleanup(id);
  return caf(realId);
};
if (false) {}
/* harmony default export */ var es_raf = (wrapperRaf);
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useNextFrame.js


/* harmony default export */ var useNextFrame = (function () {
  var nextFrameRef = external_React_.useRef(null);
  function cancelNextFrame() {
    es_raf.cancel(nextFrameRef.current);
  }
  function nextFrame(callback) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    cancelNextFrame();
    var nextFrameId = es_raf(function () {
      if (delay <= 1) {
        callback({
          isCanceled: function isCanceled() {
            return nextFrameId !== nextFrameRef.current;
          }
        });
      } else {
        nextFrame(callback, delay - 1);
      }
    });
    nextFrameRef.current = nextFrameId;
  }
  external_React_.useEffect(function () {
    return function () {
      cancelNextFrame();
    };
  }, []);
  return [nextFrame, cancelNextFrame];
});
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useStepQueue.js






var FULL_STEP_QUEUE = [STEP_PREPARE, STEP_START, STEP_ACTIVE, STEP_ACTIVATED];
var SIMPLE_STEP_QUEUE = [STEP_PREPARE, STEP_PREPARED];

/** Skip current step */
var SkipStep = false;
/** Current step should be update in */
var DoStep = true;
function isActive(step) {
  return step === STEP_ACTIVE || step === STEP_ACTIVATED;
}
/* harmony default export */ var useStepQueue = (function (status, prepareOnly, callback) {
  var _useState = useSafeState(STEP_NONE),
    _useState2 = _slicedToArray(_useState, 2),
    step = _useState2[0],
    setStep = _useState2[1];
  var _useNextFrame = useNextFrame(),
    _useNextFrame2 = _slicedToArray(_useNextFrame, 2),
    nextFrame = _useNextFrame2[0],
    cancelNextFrame = _useNextFrame2[1];
  function startQueue() {
    setStep(STEP_PREPARE, true);
  }
  var STEP_QUEUE = prepareOnly ? SIMPLE_STEP_QUEUE : FULL_STEP_QUEUE;
  hooks_useIsomorphicLayoutEffect(function () {
    if (step !== STEP_NONE && step !== STEP_ACTIVATED) {
      var index = STEP_QUEUE.indexOf(step);
      var nextStep = STEP_QUEUE[index + 1];
      var result = callback(step);
      if (result === SkipStep) {
        // Skip when no needed
        setStep(nextStep, true);
      } else if (nextStep) {
        // Do as frame for step update
        nextFrame(function (info) {
          function doNext() {
            // Skip since current queue is ood
            if (info.isCanceled()) return;
            setStep(nextStep, true);
          }
          if (result === true) {
            doNext();
          } else {
            // Only promise should be async
            Promise.resolve(result).then(doNext);
          }
        });
      }
    }
  }, [status, step]);
  external_React_.useEffect(function () {
    return function () {
      cancelNextFrame();
    };
  }, []);
  return [startQueue, step];
});
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/hooks/useStatus.js












function useStatus(supportMotion, visible, getElement, _ref) {
  var _ref$motionEnter = _ref.motionEnter,
    motionEnter = _ref$motionEnter === void 0 ? true : _ref$motionEnter,
    _ref$motionAppear = _ref.motionAppear,
    motionAppear = _ref$motionAppear === void 0 ? true : _ref$motionAppear,
    _ref$motionLeave = _ref.motionLeave,
    motionLeave = _ref$motionLeave === void 0 ? true : _ref$motionLeave,
    motionDeadline = _ref.motionDeadline,
    motionLeaveImmediately = _ref.motionLeaveImmediately,
    onAppearPrepare = _ref.onAppearPrepare,
    onEnterPrepare = _ref.onEnterPrepare,
    onLeavePrepare = _ref.onLeavePrepare,
    onAppearStart = _ref.onAppearStart,
    onEnterStart = _ref.onEnterStart,
    onLeaveStart = _ref.onLeaveStart,
    onAppearActive = _ref.onAppearActive,
    onEnterActive = _ref.onEnterActive,
    onLeaveActive = _ref.onLeaveActive,
    onAppearEnd = _ref.onAppearEnd,
    onEnterEnd = _ref.onEnterEnd,
    onLeaveEnd = _ref.onLeaveEnd,
    onVisibleChanged = _ref.onVisibleChanged;
  // Used for outer render usage to avoid `visible: false & status: none` to render nothing
  var _useState = useSafeState(),
    _useState2 = _slicedToArray(_useState, 2),
    asyncVisible = _useState2[0],
    setAsyncVisible = _useState2[1];
  var _useSyncState = useSyncState(STATUS_NONE),
    _useSyncState2 = _slicedToArray(_useSyncState, 2),
    getStatus = _useSyncState2[0],
    setStatus = _useSyncState2[1];
  var _useState3 = useSafeState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    style = _useState4[0],
    setStyle = _useState4[1];
  var currentStatus = getStatus();
  var mountedRef = (0,external_React_.useRef)(false);
  var deadlineRef = (0,external_React_.useRef)(null);

  // =========================== Dom Node ===========================
  function getDomElement() {
    return getElement();
  }

  // ========================== Motion End ==========================
  var activeRef = (0,external_React_.useRef)(false);

  /**
   * Clean up status & style
   */
  function updateMotionEndStatus() {
    setStatus(STATUS_NONE);
    setStyle(null, true);
  }
  var onInternalMotionEnd = useEvent(function (event) {
    var status = getStatus();
    // Do nothing since not in any transition status.
    // This may happen when `motionDeadline` trigger.
    if (status === STATUS_NONE) {
      return;
    }
    var element = getDomElement();
    if (event && !event.deadline && event.target !== element) {
      // event exists
      // not initiated by deadline
      // transitionEnd not fired by inner elements
      return;
    }
    var currentActive = activeRef.current;
    var canEnd;
    if (status === STATUS_APPEAR && currentActive) {
      canEnd = onAppearEnd === null || onAppearEnd === void 0 ? void 0 : onAppearEnd(element, event);
    } else if (status === STATUS_ENTER && currentActive) {
      canEnd = onEnterEnd === null || onEnterEnd === void 0 ? void 0 : onEnterEnd(element, event);
    } else if (status === STATUS_LEAVE && currentActive) {
      canEnd = onLeaveEnd === null || onLeaveEnd === void 0 ? void 0 : onLeaveEnd(element, event);
    }

    // Only update status when `canEnd` and not destroyed
    if (currentActive && canEnd !== false) {
      updateMotionEndStatus();
    }
  });
  var _useDomMotionEvents = useDomMotionEvents(onInternalMotionEnd),
    _useDomMotionEvents2 = _slicedToArray(_useDomMotionEvents, 1),
    patchMotionEvents = _useDomMotionEvents2[0];

  // ============================= Step =============================
  var getEventHandlers = function getEventHandlers(targetStatus) {
    switch (targetStatus) {
      case STATUS_APPEAR:
        return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onAppearPrepare), STEP_START, onAppearStart), STEP_ACTIVE, onAppearActive);
      case STATUS_ENTER:
        return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onEnterPrepare), STEP_START, onEnterStart), STEP_ACTIVE, onEnterActive);
      case STATUS_LEAVE:
        return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onLeavePrepare), STEP_START, onLeaveStart), STEP_ACTIVE, onLeaveActive);
      default:
        return {};
    }
  };
  var eventHandlers = external_React_.useMemo(function () {
    return getEventHandlers(currentStatus);
  }, [currentStatus]);
  var _useStepQueue = useStepQueue(currentStatus, !supportMotion, function (newStep) {
      // Only prepare step can be skip
      if (newStep === STEP_PREPARE) {
        var onPrepare = eventHandlers[STEP_PREPARE];
        if (!onPrepare) {
          return SkipStep;
        }
        return onPrepare(getDomElement());
      }

      // Rest step is sync update
      if (step in eventHandlers) {
        var _eventHandlers$step;
        setStyle(((_eventHandlers$step = eventHandlers[step]) === null || _eventHandlers$step === void 0 ? void 0 : _eventHandlers$step.call(eventHandlers, getDomElement(), null)) || null);
      }
      if (step === STEP_ACTIVE && currentStatus !== STATUS_NONE) {
        // Patch events when motion needed
        patchMotionEvents(getDomElement());
        if (motionDeadline > 0) {
          clearTimeout(deadlineRef.current);
          deadlineRef.current = setTimeout(function () {
            onInternalMotionEnd({
              deadline: true
            });
          }, motionDeadline);
        }
      }
      if (step === STEP_PREPARED) {
        updateMotionEndStatus();
      }
      return DoStep;
    }),
    _useStepQueue2 = _slicedToArray(_useStepQueue, 2),
    startStep = _useStepQueue2[0],
    step = _useStepQueue2[1];
  var active = isActive(step);
  activeRef.current = active;

  // ============================ Status ============================
  // Update with new status
  hooks_useIsomorphicLayoutEffect(function () {
    setAsyncVisible(visible);
    var isMounted = mountedRef.current;
    mountedRef.current = true;

    // if (!supportMotion) {
    //   return;
    // }

    var nextStatus;

    // Appear
    if (!isMounted && visible && motionAppear) {
      nextStatus = STATUS_APPEAR;
    }

    // Enter
    if (isMounted && visible && motionEnter) {
      nextStatus = STATUS_ENTER;
    }

    // Leave
    if (isMounted && !visible && motionLeave || !isMounted && motionLeaveImmediately && !visible && motionLeave) {
      nextStatus = STATUS_LEAVE;
    }
    var nextEventHandlers = getEventHandlers(nextStatus);

    // Update to next status
    if (nextStatus && (supportMotion || nextEventHandlers[STEP_PREPARE])) {
      setStatus(nextStatus);
      startStep();
    } else {
      // Set back in case no motion but prev status has prepare step
      setStatus(STATUS_NONE);
    }
  }, [visible]);

  // ============================ Effect ============================
  // Reset when motion changed
  (0,external_React_.useEffect)(function () {
    if (
    // Cancel appear
    currentStatus === STATUS_APPEAR && !motionAppear ||
    // Cancel enter
    currentStatus === STATUS_ENTER && !motionEnter ||
    // Cancel leave
    currentStatus === STATUS_LEAVE && !motionLeave) {
      setStatus(STATUS_NONE);
    }
  }, [motionAppear, motionEnter, motionLeave]);
  (0,external_React_.useEffect)(function () {
    return function () {
      mountedRef.current = false;
      clearTimeout(deadlineRef.current);
    };
  }, []);

  // Trigger `onVisibleChanged`
  var firstMountChangeRef = external_React_.useRef(false);
  (0,external_React_.useEffect)(function () {
    // [visible & motion not end] => [!visible & motion end] still need trigger onVisibleChanged
    if (asyncVisible) {
      firstMountChangeRef.current = true;
    }
    if (asyncVisible !== undefined && currentStatus === STATUS_NONE) {
      // Skip first render is invisible since it's nothing changed
      if (firstMountChangeRef.current || asyncVisible) {
        onVisibleChanged === null || onVisibleChanged === void 0 || onVisibleChanged(asyncVisible);
      }
      firstMountChangeRef.current = true;
    }
  }, [asyncVisible, currentStatus]);

  // ============================ Styles ============================
  var mergedStyle = style;
  if (eventHandlers[STEP_PREPARE] && step === STEP_START) {
    mergedStyle = _objectSpread2({
      transition: 'none'
    }, mergedStyle);
  }
  return [currentStatus, step, mergedStyle, asyncVisible !== null && asyncVisible !== void 0 ? asyncVisible : visible];
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/CSSMotion.js




/* eslint-disable react/default-props-match-prop-types, react/no-multi-comp, react/prop-types */











/**
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */
function genCSSMotion(config) {
  var transitionSupport = config;
  if (typeof_typeof(config) === 'object') {
    transitionSupport = config.transitionSupport;
  }
  function isSupportTransition(props, contextMotion) {
    return !!(props.motionName && transitionSupport && contextMotion !== false);
  }
  var CSSMotion = /*#__PURE__*/external_React_.forwardRef(function (props, ref) {
    var _props$visible = props.visible,
      visible = _props$visible === void 0 ? true : _props$visible,
      _props$removeOnLeave = props.removeOnLeave,
      removeOnLeave = _props$removeOnLeave === void 0 ? true : _props$removeOnLeave,
      forceRender = props.forceRender,
      children = props.children,
      motionName = props.motionName,
      leavedClassName = props.leavedClassName,
      eventProps = props.eventProps;
    var _React$useContext = external_React_.useContext(context_Context),
      contextMotion = _React$useContext.motion;
    var supportMotion = isSupportTransition(props, contextMotion);

    // Ref to the react node, it may be a HTMLElement
    var nodeRef = (0,external_React_.useRef)();
    // Ref to the dom wrapper in case ref can not pass to HTMLElement
    var wrapperNodeRef = (0,external_React_.useRef)();
    function getDomElement() {
      try {
        // Here we're avoiding call for findDOMNode since it's deprecated
        // in strict mode. We're calling it only when node ref is not
        // an instance of DOM HTMLElement. Otherwise use
        // findDOMNode as a final resort
        return nodeRef.current instanceof HTMLElement ? nodeRef.current : findDOMNode(wrapperNodeRef.current);
      } catch (e) {
        // Only happen when `motionDeadline` trigger but element removed.
        return null;
      }
    }
    var _useStatus = useStatus(supportMotion, visible, getDomElement, props),
      _useStatus2 = _slicedToArray(_useStatus, 4),
      status = _useStatus2[0],
      statusStep = _useStatus2[1],
      statusStyle = _useStatus2[2],
      mergedVisible = _useStatus2[3];

    // Record whether content has rendered
    // Will return null for un-rendered even when `removeOnLeave={false}`
    var renderedRef = external_React_.useRef(mergedVisible);
    if (mergedVisible) {
      renderedRef.current = true;
    }

    // ====================== Refs ======================
    var setNodeRef = external_React_.useCallback(function (node) {
      nodeRef.current = node;
      fillRef(ref, node);
    }, [ref]);

    // ===================== Render =====================
    var motionChildren;
    var mergedProps = _objectSpread2(_objectSpread2({}, eventProps), {}, {
      visible: visible
    });
    if (!children) {
      // No children
      motionChildren = null;
    } else if (status === STATUS_NONE) {
      // Stable children
      if (mergedVisible) {
        motionChildren = children(_objectSpread2({}, mergedProps), setNodeRef);
      } else if (!removeOnLeave && renderedRef.current && leavedClassName) {
        motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, {
          className: leavedClassName
        }), setNodeRef);
      } else if (forceRender || !removeOnLeave && !leavedClassName) {
        motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, {
          style: {
            display: 'none'
          }
        }), setNodeRef);
      } else {
        motionChildren = null;
      }
    } else {
      // In motion
      var statusSuffix;
      if (statusStep === STEP_PREPARE) {
        statusSuffix = 'prepare';
      } else if (isActive(statusStep)) {
        statusSuffix = 'active';
      } else if (statusStep === STEP_START) {
        statusSuffix = 'start';
      }
      var motionCls = getTransitionName(motionName, "".concat(status, "-").concat(statusSuffix));
      motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, {
        className: classnames_default()(getTransitionName(motionName, status), _defineProperty(_defineProperty({}, motionCls, motionCls && statusSuffix), motionName, typeof motionName === 'string')),
        style: statusStyle
      }), setNodeRef);
    }

    // Auto inject ref if child node not have `ref` props
    if ( /*#__PURE__*/ /*#__PURE__*/external_React_.isValidElement(motionChildren) && supportRef(motionChildren)) {
      var _ref = motionChildren,
        originNodeRef = _ref.ref;
      if (!originNodeRef) {
        motionChildren = /*#__PURE__*/external_React_.cloneElement(motionChildren, {
          ref: setNodeRef
        });
      }
    }
    return /*#__PURE__*/external_React_.createElement(es_DomWrapper, {
      ref: wrapperNodeRef
    }, motionChildren);
  });
  CSSMotion.displayName = 'CSSMotion';
  return CSSMotion;
}
/* harmony default export */ var es_CSSMotion = (genCSSMotion(supportTransition));
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/util/diff.js


var STATUS_ADD = 'add';
var STATUS_KEEP = 'keep';
var STATUS_REMOVE = 'remove';
var STATUS_REMOVED = 'removed';
function wrapKeyToObject(key) {
  var keyObj;
  if (key && typeof_typeof(key) === 'object' && 'key' in key) {
    keyObj = key;
  } else {
    keyObj = {
      key: key
    };
  }
  return _objectSpread2(_objectSpread2({}, keyObj), {}, {
    key: String(keyObj.key)
  });
}
function parseKeys() {
  var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return keys.map(wrapKeyToObject);
}
function diffKeys() {
  var prevKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var currentKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var list = [];
  var currentIndex = 0;
  var currentLen = currentKeys.length;
  var prevKeyObjects = parseKeys(prevKeys);
  var currentKeyObjects = parseKeys(currentKeys);

  // Check prev keys to insert or keep
  prevKeyObjects.forEach(function (keyObj) {
    var hit = false;
    for (var i = currentIndex; i < currentLen; i += 1) {
      var currentKeyObj = currentKeyObjects[i];
      if (currentKeyObj.key === keyObj.key) {
        // New added keys should add before current key
        if (currentIndex < i) {
          list = list.concat(currentKeyObjects.slice(currentIndex, i).map(function (obj) {
            return _objectSpread2(_objectSpread2({}, obj), {}, {
              status: STATUS_ADD
            });
          }));
          currentIndex = i;
        }
        list.push(_objectSpread2(_objectSpread2({}, currentKeyObj), {}, {
          status: STATUS_KEEP
        }));
        currentIndex += 1;
        hit = true;
        break;
      }
    }

    // If not hit, it means key is removed
    if (!hit) {
      list.push(_objectSpread2(_objectSpread2({}, keyObj), {}, {
        status: STATUS_REMOVE
      }));
    }
  });

  // Add rest to the list
  if (currentIndex < currentLen) {
    list = list.concat(currentKeyObjects.slice(currentIndex).map(function (obj) {
      return _objectSpread2(_objectSpread2({}, obj), {}, {
        status: STATUS_ADD
      });
    }));
  }

  /**
   * Merge same key when it remove and add again:
   *    [1 - add, 2 - keep, 1 - remove] -> [1 - keep, 2 - keep]
   */
  var keys = {};
  list.forEach(function (_ref) {
    var key = _ref.key;
    keys[key] = (keys[key] || 0) + 1;
  });
  var duplicatedKeys = Object.keys(keys).filter(function (key) {
    return keys[key] > 1;
  });
  duplicatedKeys.forEach(function (matchKey) {
    // Remove `STATUS_REMOVE` node.
    list = list.filter(function (_ref2) {
      var key = _ref2.key,
        status = _ref2.status;
      return key !== matchKey || status !== STATUS_REMOVE;
    });

    // Update `STATUS_ADD` to `STATUS_KEEP`
    list.forEach(function (node) {
      if (node.key === matchKey) {
        // eslint-disable-next-line no-param-reassign
        node.status = STATUS_KEEP;
      }
    });
  });
  return list;
}
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/CSSMotionList.js









var CSSMotionList_excluded = ["component", "children", "onVisibleChanged", "onAllRemoved"],
  _excluded2 = ["status"];
/* eslint react/prop-types: 0 */




var MOTION_PROP_NAMES = ['eventProps', 'visible', 'children', 'motionName', 'motionAppear', 'motionEnter', 'motionLeave', 'motionLeaveImmediately', 'motionDeadline', 'removeOnLeave', 'leavedClassName', 'onAppearPrepare', 'onAppearStart', 'onAppearActive', 'onAppearEnd', 'onEnterStart', 'onEnterActive', 'onEnterEnd', 'onLeaveStart', 'onLeaveActive', 'onLeaveEnd'];
/**
 * Generate a CSSMotionList component with config
 * @param transitionSupport No need since CSSMotionList no longer depends on transition support
 * @param CSSMotion CSSMotion component
 */
function genCSSMotionList(transitionSupport) {
  var CSSMotion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : es_CSSMotion;
  var CSSMotionList = /*#__PURE__*/function (_React$Component) {
    _inherits(CSSMotionList, _React$Component);
    var _super = _createSuper(CSSMotionList);
    function CSSMotionList() {
      var _this;
      _classCallCheck(this, CSSMotionList);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _super.call.apply(_super, [this].concat(args));
      _defineProperty(_assertThisInitialized(_this), "state", {
        keyEntities: []
      });
      // ZombieJ: Return the count of rest keys. It's safe to refactor if need more info.
      _defineProperty(_assertThisInitialized(_this), "removeKey", function (removeKey) {
        _this.setState(function (prevState) {
          var nextKeyEntities = prevState.keyEntities.map(function (entity) {
            if (entity.key !== removeKey) return entity;
            return _objectSpread2(_objectSpread2({}, entity), {}, {
              status: STATUS_REMOVED
            });
          });
          return {
            keyEntities: nextKeyEntities
          };
        }, function () {
          var keyEntities = _this.state.keyEntities;
          var restKeysCount = keyEntities.filter(function (_ref) {
            var status = _ref.status;
            return status !== STATUS_REMOVED;
          }).length;
          if (restKeysCount === 0 && _this.props.onAllRemoved) {
            _this.props.onAllRemoved();
          }
        });
      });
      return _this;
    }
    _createClass(CSSMotionList, [{
      key: "render",
      value: function render() {
        var _this2 = this;
        var keyEntities = this.state.keyEntities;
        var _this$props = this.props,
          component = _this$props.component,
          children = _this$props.children,
          _onVisibleChanged = _this$props.onVisibleChanged,
          onAllRemoved = _this$props.onAllRemoved,
          restProps = objectWithoutProperties_objectWithoutProperties(_this$props, CSSMotionList_excluded);
        var Component = component || external_React_.Fragment;
        var motionProps = {};
        MOTION_PROP_NAMES.forEach(function (prop) {
          motionProps[prop] = restProps[prop];
          delete restProps[prop];
        });
        delete restProps.keys;
        return /*#__PURE__*/external_React_.createElement(Component, restProps, keyEntities.map(function (_ref2, index) {
          var status = _ref2.status,
            eventProps = objectWithoutProperties_objectWithoutProperties(_ref2, _excluded2);
          var visible = status === STATUS_ADD || status === STATUS_KEEP;
          return /*#__PURE__*/external_React_.createElement(CSSMotion, _extends({}, motionProps, {
            key: eventProps.key,
            visible: visible,
            eventProps: eventProps,
            onVisibleChanged: function onVisibleChanged(changedVisible) {
              _onVisibleChanged === null || _onVisibleChanged === void 0 || _onVisibleChanged(changedVisible, {
                key: eventProps.key
              });
              if (!changedVisible) {
                _this2.removeKey(eventProps.key);
              }
            }
          }), function (props, ref) {
            return children(_objectSpread2(_objectSpread2({}, props), {}, {
              index: index
            }), ref);
          });
        }));
      }
    }], [{
      key: "getDerivedStateFromProps",
      value: function getDerivedStateFromProps(_ref3, _ref4) {
        var keys = _ref3.keys;
        var keyEntities = _ref4.keyEntities;
        var parsedKeyObjects = parseKeys(keys);
        var mixedKeyEntities = diffKeys(keyEntities, parsedKeyObjects);
        return {
          keyEntities: mixedKeyEntities.filter(function (entity) {
            var prevEntity = keyEntities.find(function (_ref5) {
              var key = _ref5.key;
              return entity.key === key;
            });

            // Remove if already mark as removed
            if (prevEntity && prevEntity.status === STATUS_REMOVED && entity.status === STATUS_REMOVE) {
              return false;
            }
            return true;
          })
        };
      }
    }]);
    return CSSMotionList;
  }(external_React_.Component);
  _defineProperty(CSSMotionList, "defaultProps", {
    component: 'div'
  });
  return CSSMotionList;
}
/* harmony default export */ var CSSMotionList = (genCSSMotionList(supportTransition));
;// CONCATENATED MODULE: ./node_modules/rc-motion/es/index.js




/* harmony default export */ var es = (es_CSSMotion);
// EXTERNAL MODULE: ./node_modules/@umijs/babel-preset-umi/node_modules/@babel/runtime/helpers/extends.js
var helpers_extends = __webpack_require__(55);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);
;// CONCATENATED MODULE: ./components/attachments/SilentUploader.tsx



/**
 * SilentUploader is only wrap children with antd Upload component.
 */
function SilentUploader(props, ref) {
  const {
    children,
    upload,
    rootClassName
  } = props;
  const uploadRef = external_React_default().useRef(null);
  external_React_default().useImperativeHandle(ref, () => uploadRef.current);

  // ============================ Render ============================
  return /*#__PURE__*/external_React_default().createElement(external_antd_.Upload, extends_default()({}, upload, {
    showUploadList: false,
    rootClassName: rootClassName,
    ref: uploadRef
  }), children);
}
/* harmony default export */ var attachments_SilentUploader = (/*#__PURE__*/external_React_default().forwardRef(SilentUploader));
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FileExcelFilled.js
// This icon file is generated automatically.
var FileExcelFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM575.34 477.84l-61.22 102.3L452.3 477.8a12 12 0 00-10.27-5.79h-38.44a12 12 0 00-6.4 1.85 12 12 0 00-3.75 16.56l82.34 130.42-83.45 132.78a12 12 0 00-1.84 6.39 12 12 0 0012 12h34.46a12 12 0 0010.21-5.7l62.7-101.47 62.3 101.45a12 12 0 0010.23 5.72h37.48a12 12 0 006.48-1.9 12 12 0 003.62-16.58l-83.83-130.55 85.3-132.47a12 12 0 001.9-6.5 12 12 0 00-12-12h-35.7a12 12 0 00-10.29 5.84z"
      }
    }]
  },
  "name": "file-excel",
  "theme": "filled"
};
/* harmony default export */ var asn_FileExcelFilled = (FileExcelFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FileExcelFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FileExcelFilled_FileExcelFilled = function FileExcelFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FileExcelFilled
  }));
};

/**![file-excel](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43YzYgNiA5LjQgMTQuMSA5LjQgMjIuNlY5MjhjMCAxNy43LTE0LjMgMzItMzIgMzJIMTkyYy0xNy43IDAtMzItMTQuMy0zMi0zMlY5NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmg0MjQuN2M4LjUgMCAxNi43IDMuNCAyMi43IDkuNGwyMTUuMiAyMTUuM3pNNzkwLjIgMzI2TDYwMiAxMzcuOFYzMjZoMTg4LjJ6TTU3NS4zNCA0NzcuODRsLTYxLjIyIDEwMi4zTDQ1Mi4zIDQ3Ny44YTEyIDEyIDAgMDAtMTAuMjctNS43OWgtMzguNDRhMTIgMTIgMCAwMC02LjQgMS44NSAxMiAxMiAwIDAwLTMuNzUgMTYuNTZsODIuMzQgMTMwLjQyLTgzLjQ1IDEzMi43OGExMiAxMiAwIDAwLTEuODQgNi4zOSAxMiAxMiAwIDAwMTIgMTJoMzQuNDZhMTIgMTIgMCAwMDEwLjIxLTUuN2w2Mi43LTEwMS40NyA2Mi4zIDEwMS40NWExMiAxMiAwIDAwMTAuMjMgNS43MmgzNy40OGExMiAxMiAwIDAwNi40OC0xLjkgMTIgMTIgMCAwMDMuNjItMTYuNThsLTgzLjgzLTEzMC41NSA4NS4zLTEzMi40N2ExMiAxMiAwIDAwMS45LTYuNSAxMiAxMiAwIDAwLTEyLTEyaC0zNS43YTEyIDEyIDAgMDAtMTAuMjkgNS44NHoiIC8+PC9zdmc+) */
var FileExcelFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FileExcelFilled_FileExcelFilled);
if (false) {}
/* harmony default export */ var icons_FileExcelFilled = (FileExcelFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FileImageFilled.js
// This icon file is generated automatically.
var FileImageFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7L639.4 73.4c-6-6-14.2-9.4-22.7-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.6zM400 402c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zm296 294H328c-6.7 0-10.4-7.7-6.3-12.9l99.8-127.2a8 8 0 0112.6 0l41.1 52.4 77.8-99.2a8 8 0 0112.6 0l136.5 174c4.3 5.2.5 12.9-6.1 12.9zm-94-370V137.8L790.2 326H602z"
      }
    }]
  },
  "name": "file-image",
  "theme": "filled"
};
/* harmony default export */ var asn_FileImageFilled = (FileImageFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FileImageFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FileImageFilled_FileImageFilled = function FileImageFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FileImageFilled
  }));
};

/**![file-image](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43TDYzOS40IDczLjRjLTYtNi0xNC4yLTkuNC0yMi43LTkuNEgxOTJjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjgzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg2NDBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMzExLjNjMC04LjUtMy40LTE2LjYtOS40LTIyLjZ6TTQwMCA0MDJjMjIuMSAwIDQwIDE3LjkgNDAgNDBzLTE3LjkgNDAtNDAgNDAtNDAtMTcuOS00MC00MCAxNy45LTQwIDQwLTQwem0yOTYgMjk0SDMyOGMtNi43IDAtMTAuNC03LjctNi4zLTEyLjlsOTkuOC0xMjcuMmE4IDggMCAwMTEyLjYgMGw0MS4xIDUyLjQgNzcuOC05OS4yYTggOCAwIDAxMTIuNiAwbDEzNi41IDE3NGM0LjMgNS4yLjUgMTIuOS02LjEgMTIuOXptLTk0LTM3MFYxMzcuOEw3OTAuMiAzMjZINjAyeiIgLz48L3N2Zz4=) */
var FileImageFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FileImageFilled_FileImageFilled);
if (false) {}
/* harmony default export */ var icons_FileImageFilled = (FileImageFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FileMarkdownFilled.js
// This icon file is generated automatically.
var FileMarkdownFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM426.13 600.93l59.11 132.97a16 16 0 0014.62 9.5h24.06a16 16 0 0014.63-9.51l59.1-133.35V758a16 16 0 0016.01 16H641a16 16 0 0016-16V486a16 16 0 00-16-16h-34.75a16 16 0 00-14.67 9.62L512.1 662.2l-79.48-182.59a16 16 0 00-14.67-9.61H383a16 16 0 00-16 16v272a16 16 0 0016 16h27.13a16 16 0 0016-16V600.93z"
      }
    }]
  },
  "name": "file-markdown",
  "theme": "filled"
};
/* harmony default export */ var asn_FileMarkdownFilled = (FileMarkdownFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FileMarkdownFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FileMarkdownFilled_FileMarkdownFilled = function FileMarkdownFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FileMarkdownFilled
  }));
};

/**![file-markdown](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43YzYgNiA5LjQgMTQuMSA5LjQgMjIuNlY5MjhjMCAxNy43LTE0LjMgMzItMzIgMzJIMTkyYy0xNy43IDAtMzItMTQuMy0zMi0zMlY5NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmg0MjQuN2M4LjUgMCAxNi43IDMuNCAyMi43IDkuNGwyMTUuMiAyMTUuM3pNNzkwLjIgMzI2TDYwMiAxMzcuOFYzMjZoMTg4LjJ6TTQyNi4xMyA2MDAuOTNsNTkuMTEgMTMyLjk3YTE2IDE2IDAgMDAxNC42MiA5LjVoMjQuMDZhMTYgMTYgMCAwMDE0LjYzLTkuNTFsNTkuMS0xMzMuMzVWNzU4YTE2IDE2IDAgMDAxNi4wMSAxNkg2NDFhMTYgMTYgMCAwMDE2LTE2VjQ4NmExNiAxNiAwIDAwLTE2LTE2aC0zNC43NWExNiAxNiAwIDAwLTE0LjY3IDkuNjJMNTEyLjEgNjYyLjJsLTc5LjQ4LTE4Mi41OWExNiAxNiAwIDAwLTE0LjY3LTkuNjFIMzgzYTE2IDE2IDAgMDAtMTYgMTZ2MjcyYTE2IDE2IDAgMDAxNiAxNmgyNy4xM2ExNiAxNiAwIDAwMTYtMTZWNjAwLjkzeiIgLz48L3N2Zz4=) */
var FileMarkdownFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FileMarkdownFilled_FileMarkdownFilled);
if (false) {}
/* harmony default export */ var icons_FileMarkdownFilled = (FileMarkdownFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FilePdfFilled.js
// This icon file is generated automatically.
var FilePdfFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM633.22 637.26c-15.18-.5-31.32.67-49.65 2.96-24.3-14.99-40.66-35.58-52.28-65.83l1.07-4.38 1.24-5.18c4.3-18.13 6.61-31.36 7.3-44.7.52-10.07-.04-19.36-1.83-27.97-3.3-18.59-16.45-29.46-33.02-30.13-15.45-.63-29.65 8-33.28 21.37-5.91 21.62-2.45 50.07 10.08 98.59-15.96 38.05-37.05 82.66-51.2 107.54-18.89 9.74-33.6 18.6-45.96 28.42-16.3 12.97-26.48 26.3-29.28 40.3-1.36 6.49.69 14.97 5.36 21.92 5.3 7.88 13.28 13 22.85 13.74 24.15 1.87 53.83-23.03 86.6-79.26 3.29-1.1 6.77-2.26 11.02-3.7l11.9-4.02c7.53-2.54 12.99-4.36 18.39-6.11 23.4-7.62 41.1-12.43 57.2-15.17 27.98 14.98 60.32 24.8 82.1 24.8 17.98 0 30.13-9.32 34.52-23.99 3.85-12.88.8-27.82-7.48-36.08-8.56-8.41-24.3-12.43-45.65-13.12zM385.23 765.68v-.36l.13-.34a54.86 54.86 0 015.6-10.76c4.28-6.58 10.17-13.5 17.47-20.87 3.92-3.95 8-7.8 12.79-12.12 1.07-.96 7.91-7.05 9.19-8.25l11.17-10.4-8.12 12.93c-12.32 19.64-23.46 33.78-33 43-3.51 3.4-6.6 5.9-9.1 7.51a16.43 16.43 0 01-2.61 1.42c-.41.17-.77.27-1.13.3a2.2 2.2 0 01-1.12-.15 2.07 2.07 0 01-1.27-1.91zM511.17 547.4l-2.26 4-1.4-4.38c-3.1-9.83-5.38-24.64-6.01-38-.72-15.2.49-24.32 5.29-24.32 6.74 0 9.83 10.8 10.07 27.05.22 14.28-2.03 29.14-5.7 35.65zm-5.81 58.46l1.53-4.05 2.09 3.8c11.69 21.24 26.86 38.96 43.54 51.31l3.6 2.66-4.39.9c-16.33 3.38-31.54 8.46-52.34 16.85 2.17-.88-21.62 8.86-27.64 11.17l-5.25 2.01 2.8-4.88c12.35-21.5 23.76-47.32 36.05-79.77zm157.62 76.26c-7.86 3.1-24.78.33-54.57-12.39l-7.56-3.22 8.2-.6c23.3-1.73 39.8-.45 49.42 3.07 4.1 1.5 6.83 3.39 8.04 5.55a4.64 4.64 0 01-1.36 6.31 6.7 6.7 0 01-2.17 1.28z"
      }
    }]
  },
  "name": "file-pdf",
  "theme": "filled"
};
/* harmony default export */ var asn_FilePdfFilled = (FilePdfFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FilePdfFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FilePdfFilled_FilePdfFilled = function FilePdfFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FilePdfFilled
  }));
};

/**![file-pdf](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43YzYgNiA5LjQgMTQuMSA5LjQgMjIuNlY5MjhjMCAxNy43LTE0LjMgMzItMzIgMzJIMTkyYy0xNy43IDAtMzItMTQuMy0zMi0zMlY5NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmg0MjQuN2M4LjUgMCAxNi43IDMuNCAyMi43IDkuNGwyMTUuMiAyMTUuM3pNNzkwLjIgMzI2TDYwMiAxMzcuOFYzMjZoMTg4LjJ6TTYzMy4yMiA2MzcuMjZjLTE1LjE4LS41LTMxLjMyLjY3LTQ5LjY1IDIuOTYtMjQuMy0xNC45OS00MC42Ni0zNS41OC01Mi4yOC02NS44M2wxLjA3LTQuMzggMS4yNC01LjE4YzQuMy0xOC4xMyA2LjYxLTMxLjM2IDcuMy00NC43LjUyLTEwLjA3LS4wNC0xOS4zNi0xLjgzLTI3Ljk3LTMuMy0xOC41OS0xNi40NS0yOS40Ni0zMy4wMi0zMC4xMy0xNS40NS0uNjMtMjkuNjUgOC0zMy4yOCAyMS4zNy01LjkxIDIxLjYyLTIuNDUgNTAuMDcgMTAuMDggOTguNTktMTUuOTYgMzguMDUtMzcuMDUgODIuNjYtNTEuMiAxMDcuNTQtMTguODkgOS43NC0zMy42IDE4LjYtNDUuOTYgMjguNDItMTYuMyAxMi45Ny0yNi40OCAyNi4zLTI5LjI4IDQwLjMtMS4zNiA2LjQ5LjY5IDE0Ljk3IDUuMzYgMjEuOTIgNS4zIDcuODggMTMuMjggMTMgMjIuODUgMTMuNzQgMjQuMTUgMS44NyA1My44My0yMy4wMyA4Ni42LTc5LjI2IDMuMjktMS4xIDYuNzctMi4yNiAxMS4wMi0zLjdsMTEuOS00LjAyYzcuNTMtMi41NCAxMi45OS00LjM2IDE4LjM5LTYuMTEgMjMuNC03LjYyIDQxLjEtMTIuNDMgNTcuMi0xNS4xNyAyNy45OCAxNC45OCA2MC4zMiAyNC44IDgyLjEgMjQuOCAxNy45OCAwIDMwLjEzLTkuMzIgMzQuNTItMjMuOTkgMy44NS0xMi44OC44LTI3LjgyLTcuNDgtMzYuMDgtOC41Ni04LjQxLTI0LjMtMTIuNDMtNDUuNjUtMTMuMTJ6TTM4NS4yMyA3NjUuNjh2LS4zNmwuMTMtLjM0YTU0Ljg2IDU0Ljg2IDAgMDE1LjYtMTAuNzZjNC4yOC02LjU4IDEwLjE3LTEzLjUgMTcuNDctMjAuODcgMy45Mi0zLjk1IDgtNy44IDEyLjc5LTEyLjEyIDEuMDctLjk2IDcuOTEtNy4wNSA5LjE5LTguMjVsMTEuMTctMTAuNC04LjEyIDEyLjkzYy0xMi4zMiAxOS42NC0yMy40NiAzMy43OC0zMyA0My0zLjUxIDMuNC02LjYgNS45LTkuMSA3LjUxYTE2LjQzIDE2LjQzIDAgMDEtMi42MSAxLjQyYy0uNDEuMTctLjc3LjI3LTEuMTMuM2EyLjIgMi4yIDAgMDEtMS4xMi0uMTUgMi4wNyAyLjA3IDAgMDEtMS4yNy0xLjkxek01MTEuMTcgNTQ3LjRsLTIuMjYgNC0xLjQtNC4zOGMtMy4xLTkuODMtNS4zOC0yNC42NC02LjAxLTM4LS43Mi0xNS4yLjQ5LTI0LjMyIDUuMjktMjQuMzIgNi43NCAwIDkuODMgMTAuOCAxMC4wNyAyNy4wNS4yMiAxNC4yOC0yLjAzIDI5LjE0LTUuNyAzNS42NXptLTUuODEgNTguNDZsMS41My00LjA1IDIuMDkgMy44YzExLjY5IDIxLjI0IDI2Ljg2IDM4Ljk2IDQzLjU0IDUxLjMxbDMuNiAyLjY2LTQuMzkuOWMtMTYuMzMgMy4zOC0zMS41NCA4LjQ2LTUyLjM0IDE2Ljg1IDIuMTctLjg4LTIxLjYyIDguODYtMjcuNjQgMTEuMTdsLTUuMjUgMi4wMSAyLjgtNC44OGMxMi4zNS0yMS41IDIzLjc2LTQ3LjMyIDM2LjA1LTc5Ljc3em0xNTcuNjIgNzYuMjZjLTcuODYgMy4xLTI0Ljc4LjMzLTU0LjU3LTEyLjM5bC03LjU2LTMuMjIgOC4yLS42YzIzLjMtMS43MyAzOS44LS40NSA0OS40MiAzLjA3IDQuMSAxLjUgNi44MyAzLjM5IDguMDQgNS41NWE0LjY0IDQuNjQgMCAwMS0xLjM2IDYuMzEgNi43IDYuNyAwIDAxLTIuMTcgMS4yOHoiIC8+PC9zdmc+) */
var FilePdfFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FilePdfFilled_FilePdfFilled);
if (false) {}
/* harmony default export */ var icons_FilePdfFilled = (FilePdfFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FilePptFilled.js
// This icon file is generated automatically.
var FilePptFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM468.53 760v-91.54h59.27c60.57 0 100.2-39.65 100.2-98.12 0-58.22-39.58-98.34-99.98-98.34H424a12 12 0 00-12 12v276a12 12 0 0012 12h32.53a12 12 0 0012-12zm0-139.33h34.9c47.82 0 67.19-12.93 67.19-50.33 0-32.05-18.12-50.12-49.87-50.12h-52.22v100.45z"
      }
    }]
  },
  "name": "file-ppt",
  "theme": "filled"
};
/* harmony default export */ var asn_FilePptFilled = (FilePptFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FilePptFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FilePptFilled_FilePptFilled = function FilePptFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FilePptFilled
  }));
};

/**![file-ppt](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43YzYgNiA5LjQgMTQuMSA5LjQgMjIuNlY5MjhjMCAxNy43LTE0LjMgMzItMzIgMzJIMTkyYy0xNy43IDAtMzItMTQuMy0zMi0zMlY5NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmg0MjQuN2M4LjUgMCAxNi43IDMuNCAyMi43IDkuNGwyMTUuMiAyMTUuM3pNNzkwLjIgMzI2TDYwMiAxMzcuOFYzMjZoMTg4LjJ6TTQ2OC41MyA3NjB2LTkxLjU0aDU5LjI3YzYwLjU3IDAgMTAwLjItMzkuNjUgMTAwLjItOTguMTIgMC01OC4yMi0zOS41OC05OC4zNC05OS45OC05OC4zNEg0MjRhMTIgMTIgMCAwMC0xMiAxMnYyNzZhMTIgMTIgMCAwMDEyIDEyaDMyLjUzYTEyIDEyIDAgMDAxMi0xMnptMC0xMzkuMzNoMzQuOWM0Ny44MiAwIDY3LjE5LTEyLjkzIDY3LjE5LTUwLjMzIDAtMzIuMDUtMTguMTItNTAuMTItNDkuODctNTAuMTJoLTUyLjIydjEwMC40NXoiIC8+PC9zdmc+) */
var FilePptFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FilePptFilled_FilePptFilled);
if (false) {}
/* harmony default export */ var icons_FilePptFilled = (FilePptFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FileWordFilled.js
// This icon file is generated automatically.
var FileWordFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM512 566.1l52.81 197a12 12 0 0011.6 8.9h31.77a12 12 0 0011.6-8.88l74.37-276a12 12 0 00.4-3.12 12 12 0 00-12-12h-35.57a12 12 0 00-11.7 9.31l-45.78 199.1-49.76-199.32A12 12 0 00528.1 472h-32.2a12 12 0 00-11.64 9.1L434.6 680.01 388.5 481.3a12 12 0 00-11.68-9.29h-35.39a12 12 0 00-3.11.41 12 12 0 00-8.47 14.7l74.17 276A12 12 0 00415.6 772h31.99a12 12 0 0011.59-8.9l52.81-197z"
      }
    }]
  },
  "name": "file-word",
  "theme": "filled"
};
/* harmony default export */ var asn_FileWordFilled = (FileWordFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FileWordFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FileWordFilled_FileWordFilled = function FileWordFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FileWordFilled
  }));
};

/**![file-word](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43YzYgNiA5LjQgMTQuMSA5LjQgMjIuNlY5MjhjMCAxNy43LTE0LjMgMzItMzIgMzJIMTkyYy0xNy43IDAtMzItMTQuMy0zMi0zMlY5NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmg0MjQuN2M4LjUgMCAxNi43IDMuNCAyMi43IDkuNGwyMTUuMiAyMTUuM3pNNzkwLjIgMzI2TDYwMiAxMzcuOFYzMjZoMTg4LjJ6TTUxMiA1NjYuMWw1Mi44MSAxOTdhMTIgMTIgMCAwMDExLjYgOC45aDMxLjc3YTEyIDEyIDAgMDAxMS42LTguODhsNzQuMzctMjc2YTEyIDEyIDAgMDAuNC0zLjEyIDEyIDEyIDAgMDAtMTItMTJoLTM1LjU3YTEyIDEyIDAgMDAtMTEuNyA5LjMxbC00NS43OCAxOTkuMS00OS43Ni0xOTkuMzJBMTIgMTIgMCAwMDUyOC4xIDQ3MmgtMzIuMmExMiAxMiAwIDAwLTExLjY0IDkuMUw0MzQuNiA2ODAuMDEgMzg4LjUgNDgxLjNhMTIgMTIgMCAwMC0xMS42OC05LjI5aC0zNS4zOWExMiAxMiAwIDAwLTMuMTEuNDEgMTIgMTIgMCAwMC04LjQ3IDE0LjdsNzQuMTcgMjc2QTEyIDEyIDAgMDA0MTUuNiA3NzJoMzEuOTlhMTIgMTIgMCAwMDExLjU5LTguOWw1Mi44MS0xOTd6IiAvPjwvc3ZnPg==) */
var FileWordFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FileWordFilled_FileWordFilled);
if (false) {}
/* harmony default export */ var icons_FileWordFilled = (FileWordFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FileZipFilled.js
// This icon file is generated automatically.
var FileZipFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM296 136v64h64v-64h-64zm64 64v64h64v-64h-64zm-64 64v64h64v-64h-64zm64 64v64h64v-64h-64zm-64 64v64h64v-64h-64zm64 64v64h64v-64h-64zm-64 64v64h64v-64h-64zm0 64v160h128V584H296zm48 48h32v64h-32v-64z"
      }
    }]
  },
  "name": "file-zip",
  "theme": "filled"
};
/* harmony default export */ var asn_FileZipFilled = (FileZipFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FileZipFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FileZipFilled_FileZipFilled = function FileZipFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FileZipFilled
  }));
};

/**![file-zip](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43YzYgNiA5LjQgMTQuMSA5LjQgMjIuNlY5MjhjMCAxNy43LTE0LjMgMzItMzIgMzJIMTkyYy0xNy43IDAtMzItMTQuMy0zMi0zMlY5NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmg0MjQuN2M4LjUgMCAxNi43IDMuNCAyMi43IDkuNGwyMTUuMiAyMTUuM3pNNzkwLjIgMzI2TDYwMiAxMzcuOFYzMjZoMTg4LjJ6TTI5NiAxMzZ2NjRoNjR2LTY0aC02NHptNjQgNjR2NjRoNjR2LTY0aC02NHptLTY0IDY0djY0aDY0di02NGgtNjR6bTY0IDY0djY0aDY0di02NGgtNjR6bS02NCA2NHY2NGg2NHYtNjRoLTY0em02NCA2NHY2NGg2NHYtNjRoLTY0em0tNjQgNjR2NjRoNjR2LTY0aC02NHptMCA2NHYxNjBoMTI4VjU4NEgyOTZ6bTQ4IDQ4aDMydjY0aC0zMnYtNjR6IiAvPjwvc3ZnPg==) */
var FileZipFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FileZipFilled_FileZipFilled);
if (false) {}
/* harmony default export */ var icons_FileZipFilled = (FileZipFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/FileTextFilled.js
// This icon file is generated automatically.
var FileTextFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM320 482a8 8 0 00-8 8v48a8 8 0 008 8h384a8 8 0 008-8v-48a8 8 0 00-8-8H320zm0 136a8 8 0 00-8 8v48a8 8 0 008 8h184a8 8 0 008-8v-48a8 8 0 00-8-8H320z"
      }
    }]
  },
  "name": "file-text",
  "theme": "filled"
};
/* harmony default export */ var asn_FileTextFilled = (FileTextFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/FileTextFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var FileTextFilled_FileTextFilled = function FileTextFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_FileTextFilled
  }));
};

/**![file-text](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC43YzYgNiA5LjQgMTQuMSA5LjQgMjIuNlY5MjhjMCAxNy43LTE0LjMgMzItMzIgMzJIMTkyYy0xNy43IDAtMzItMTQuMy0zMi0zMlY5NmMwLTE3LjcgMTQuMy0zMiAzMi0zMmg0MjQuN2M4LjUgMCAxNi43IDMuNCAyMi43IDkuNGwyMTUuMiAyMTUuM3pNNzkwLjIgMzI2TDYwMiAxMzcuOFYzMjZoMTg4LjJ6TTMyMCA0ODJhOCA4IDAgMDAtOCA4djQ4YTggOCAwIDAwOCA4aDM4NGE4IDggMCAwMDgtOHYtNDhhOCA4IDAgMDAtOC04SDMyMHptMCAxMzZhOCA4IDAgMDAtOCA4djQ4YTggOCAwIDAwOCA4aDE4NGE4IDggMCAwMDgtOHYtNDhhOCA4IDAgMDAtOC04SDMyMHoiIC8+PC9zdmc+) */
var FileTextFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(FileTextFilled_FileTextFilled);
if (false) {}
/* harmony default export */ var icons_FileTextFilled = (FileTextFilled_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/CloseCircleFilled.js
// This icon file is generated automatically.
var CloseCircleFilled = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "fill-rule": "evenodd",
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z"
      }
    }]
  },
  "name": "close-circle",
  "theme": "filled"
};
/* harmony default export */ var asn_CloseCircleFilled = (CloseCircleFilled);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/CloseCircleFilled.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var CloseCircleFilled_CloseCircleFilled = function CloseCircleFilled(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_CloseCircleFilled
  }));
};

/**![close-circle](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgZm9jdXNhYmxlPSJmYWxzZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTEyIDY0YzI0Ny40IDAgNDQ4IDIwMC42IDQ0OCA0NDhTNzU5LjQgOTYwIDUxMiA5NjAgNjQgNzU5LjQgNjQgNTEyIDI2NC42IDY0IDUxMiA2NHptMTI3Ljk4IDI3NC44MmgtLjA0bC0uMDguMDZMNTEyIDQ2Ni43NSAzODQuMTQgMzM4Ljg4Yy0uMDQtLjA1LS4wNi0uMDYtLjA4LS4wNmEuMTIuMTIgMCAwMC0uMDcgMGMtLjAzIDAtLjA1LjAxLS4wOS4wNWwtNDUuMDIgNDUuMDJhLjIuMiAwIDAwLS4wNS4wOS4xMi4xMiAwIDAwMCAuMDd2LjAyYS4yNy4yNyAwIDAwLjA2LjA2TDQ2Ni43NSA1MTIgMzM4Ljg4IDYzOS44NmMtLjA1LjA0LS4wNi4wNi0uMDYuMDhhLjEyLjEyIDAgMDAwIC4wN2MwIC4wMy4wMS4wNS4wNS4wOWw0NS4wMiA0NS4wMmEuMi4yIDAgMDAuMDkuMDUuMTIuMTIgMCAwMC4wNyAwYy4wMiAwIC4wNC0uMDEuMDgtLjA1TDUxMiA1NTcuMjVsMTI3Ljg2IDEyNy44N2MuMDQuMDQuMDYuMDUuMDguMDVhLjEyLjEyIDAgMDAuMDcgMGMuMDMgMCAuMDUtLjAxLjA5LS4wNWw0NS4wMi00NS4wMmEuMi4yIDAgMDAuMDUtLjA5LjEyLjEyIDAgMDAwLS4wN3YtLjAyYS4yNy4yNyAwIDAwLS4wNS0uMDZMNTU3LjI1IDUxMmwxMjcuODctMTI3Ljg2Yy4wNC0uMDQuMDUtLjA2LjA1LS4wOGEuMTIuMTIgMCAwMDAtLjA3YzAtLjAzLS4wMS0uMDUtLjA1LS4wOWwtNDUuMDItNDUuMDJhLjIuMiAwIDAwLS4wOS0uMDUuMTIuMTIgMCAwMC0uMDcgMHoiIC8+PC9zdmc+) */
var CloseCircleFilled_RefIcon = /*#__PURE__*/external_React_.forwardRef(CloseCircleFilled_CloseCircleFilled);
if (false) {}
/* harmony default export */ var icons_CloseCircleFilled = (CloseCircleFilled_RefIcon);
// EXTERNAL MODULE: external "antdCssinjs"
var external_antdCssinjs_ = __webpack_require__(781);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/calc/calculator.js


var AbstractCalculator = /*#__PURE__*/_createClass(function AbstractCalculator() {
  _classCallCheck(this, AbstractCalculator);
});
/* harmony default export */ var calculator = (AbstractCalculator);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/calc/CSSCalculator.js








var CALC_UNIT = 'CALC_UNIT';
var regexp = new RegExp(CALC_UNIT, 'g');
function unit(value) {
  if (typeof value === 'number') {
    return "".concat(value).concat(CALC_UNIT);
  }
  return value;
}
var CSSCalculator = /*#__PURE__*/function (_AbstractCalculator) {
  _inherits(CSSCalculator, _AbstractCalculator);
  var _super = _createSuper(CSSCalculator);
  function CSSCalculator(num, unitlessCssVar) {
    var _this;
    _classCallCheck(this, CSSCalculator);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "result", '');
    _defineProperty(_assertThisInitialized(_this), "unitlessCssVar", void 0);
    _defineProperty(_assertThisInitialized(_this), "lowPriority", void 0);
    var numType = typeof_typeof(num);
    _this.unitlessCssVar = unitlessCssVar;
    if (num instanceof CSSCalculator) {
      _this.result = "(".concat(num.result, ")");
    } else if (numType === 'number') {
      _this.result = unit(num);
    } else if (numType === 'string') {
      _this.result = num;
    }
    return _this;
  }
  _createClass(CSSCalculator, [{
    key: "add",
    value: function add(num) {
      if (num instanceof CSSCalculator) {
        this.result = "".concat(this.result, " + ").concat(num.getResult());
      } else if (typeof num === 'number' || typeof num === 'string') {
        this.result = "".concat(this.result, " + ").concat(unit(num));
      }
      this.lowPriority = true;
      return this;
    }
  }, {
    key: "sub",
    value: function sub(num) {
      if (num instanceof CSSCalculator) {
        this.result = "".concat(this.result, " - ").concat(num.getResult());
      } else if (typeof num === 'number' || typeof num === 'string') {
        this.result = "".concat(this.result, " - ").concat(unit(num));
      }
      this.lowPriority = true;
      return this;
    }
  }, {
    key: "mul",
    value: function mul(num) {
      if (this.lowPriority) {
        this.result = "(".concat(this.result, ")");
      }
      if (num instanceof CSSCalculator) {
        this.result = "".concat(this.result, " * ").concat(num.getResult(true));
      } else if (typeof num === 'number' || typeof num === 'string') {
        this.result = "".concat(this.result, " * ").concat(num);
      }
      this.lowPriority = false;
      return this;
    }
  }, {
    key: "div",
    value: function div(num) {
      if (this.lowPriority) {
        this.result = "(".concat(this.result, ")");
      }
      if (num instanceof CSSCalculator) {
        this.result = "".concat(this.result, " / ").concat(num.getResult(true));
      } else if (typeof num === 'number' || typeof num === 'string') {
        this.result = "".concat(this.result, " / ").concat(num);
      }
      this.lowPriority = false;
      return this;
    }
  }, {
    key: "getResult",
    value: function getResult(force) {
      return this.lowPriority || force ? "(".concat(this.result, ")") : this.result;
    }
  }, {
    key: "equal",
    value: function equal(options) {
      var _this2 = this;
      var _ref = options || {},
        cssUnit = _ref.unit;
      var mergedUnit = true;
      if (typeof cssUnit === 'boolean') {
        mergedUnit = cssUnit;
      } else if (Array.from(this.unitlessCssVar).some(function (cssVar) {
        return _this2.result.includes(cssVar);
      })) {
        mergedUnit = false;
      }
      this.result = this.result.replace(regexp, mergedUnit ? 'px' : '');
      if (typeof this.lowPriority !== 'undefined') {
        return "calc(".concat(this.result, ")");
      }
      return this.result;
    }
  }]);
  return CSSCalculator;
}(calculator);

;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/calc/NumCalculator.js







var NumCalculator = /*#__PURE__*/function (_AbstractCalculator) {
  _inherits(NumCalculator, _AbstractCalculator);
  var _super = _createSuper(NumCalculator);
  function NumCalculator(num) {
    var _this;
    _classCallCheck(this, NumCalculator);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "result", 0);
    if (num instanceof NumCalculator) {
      _this.result = num.result;
    } else if (typeof num === 'number') {
      _this.result = num;
    }
    return _this;
  }
  _createClass(NumCalculator, [{
    key: "add",
    value: function add(num) {
      if (num instanceof NumCalculator) {
        this.result += num.result;
      } else if (typeof num === 'number') {
        this.result += num;
      }
      return this;
    }
  }, {
    key: "sub",
    value: function sub(num) {
      if (num instanceof NumCalculator) {
        this.result -= num.result;
      } else if (typeof num === 'number') {
        this.result -= num;
      }
      return this;
    }
  }, {
    key: "mul",
    value: function mul(num) {
      if (num instanceof NumCalculator) {
        this.result *= num.result;
      } else if (typeof num === 'number') {
        this.result *= num;
      }
      return this;
    }
  }, {
    key: "div",
    value: function div(num) {
      if (num instanceof NumCalculator) {
        this.result /= num.result;
      } else if (typeof num === 'number') {
        this.result /= num;
      }
      return this;
    }
  }, {
    key: "equal",
    value: function equal() {
      return this.result;
    }
  }]);
  return NumCalculator;
}(calculator);
/* harmony default export */ var calc_NumCalculator = (NumCalculator);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/calc/index.js


var genCalc = function genCalc(type, unitlessCssVar) {
  var Calculator = type === 'css' ? CSSCalculator : calc_NumCalculator;
  return function (num) {
    return new Calculator(num, unitlessCssVar);
  };
};
/* harmony default export */ var util_calc = (genCalc);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/getCompVarPrefix.js
var getCompVarPrefix = function getCompVarPrefix(component, prefix) {
  return "".concat([prefix, component.replace(/([A-Z]+)([A-Z][a-z]+)/g, '$1-$2').replace(/([a-z])([A-Z])/g, '$1-$2')].filter(Boolean).join('-'));
};
/* harmony default export */ var util_getCompVarPrefix = (getCompVarPrefix);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/getComponentToken.js



function getComponentToken(component, token, defaultToken, options) {
  var customToken = _objectSpread2({}, token[component]);
  if (options !== null && options !== void 0 && options.deprecatedTokens) {
    var deprecatedTokens = options.deprecatedTokens;
    deprecatedTokens.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        oldTokenKey = _ref2[0],
        newTokenKey = _ref2[1];
      if (false) {}

      // Should wrap with `if` clause, or there will be `undefined` in object.
      if (customToken !== null && customToken !== void 0 && customToken[oldTokenKey] || customToken !== null && customToken !== void 0 && customToken[newTokenKey]) {
        var _customToken$newToken;
        (_customToken$newToken = customToken[newTokenKey]) !== null && _customToken$newToken !== void 0 ? _customToken$newToken : customToken[newTokenKey] = customToken === null || customToken === void 0 ? void 0 : customToken[oldTokenKey];
      }
    });
  }
  var mergedToken = _objectSpread2(_objectSpread2({}, defaultToken), customToken);

  // Remove same value as global token to minimize size
  Object.keys(mergedToken).forEach(function (key) {
    if (mergedToken[key] === token[key]) {
      delete mergedToken[key];
    }
  });
  return mergedToken;
}
/* harmony default export */ var util_getComponentToken = (getComponentToken);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/statistic.js


var enableStatistic =  false || typeof CSSINJS_STATISTIC !== 'undefined';
var recording = true;

/**
 * This function will do as `Object.assign` in production. But will use Object.defineProperty:get to
 * pass all value access in development. To support statistic field usage with alias token.
 */
function statistic_merge() {
  for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }
  /* istanbul ignore next */
  if (!enableStatistic) {
    return Object.assign.apply(Object, [{}].concat(objs));
  }
  recording = false;
  var ret = {};
  objs.forEach(function (obj) {
    if (typeof_typeof(obj) !== 'object') {
      return;
    }
    var keys = Object.keys(obj);
    keys.forEach(function (key) {
      Object.defineProperty(ret, key, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return obj[key];
        }
      });
    });
  });
  recording = true;
  return ret;
}

/** @internal Internal Usage. Not use in your production. */
var statistic = {};

/** @internal Internal Usage. Not use in your production. */
var _statistic_build_ = {};

/* istanbul ignore next */
function noop() {}

/** Statistic token usage case. Should use `merge` function if you do not want spread record. */
var statisticToken = function statisticToken(token) {
  var tokenKeys;
  var proxy = token;
  var flush = noop;
  if (enableStatistic && typeof Proxy !== 'undefined') {
    tokenKeys = new Set();
    proxy = new Proxy(token, {
      get: function get(obj, prop) {
        if (recording) {
          var _tokenKeys;
          (_tokenKeys = tokenKeys) === null || _tokenKeys === void 0 || _tokenKeys.add(prop);
        }
        return obj[prop];
      }
    });
    flush = function flush(componentName, componentToken) {
      var _statistic$componentN;
      statistic[componentName] = {
        global: Array.from(tokenKeys),
        component: _objectSpread2(_objectSpread2({}, (_statistic$componentN = statistic[componentName]) === null || _statistic$componentN === void 0 ? void 0 : _statistic$componentN.component), componentToken)
      };
    };
  }
  return {
    token: proxy,
    keys: tokenKeys,
    flush: flush
  };
};
/* harmony default export */ var util_statistic = (statisticToken);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/getDefaultComponentToken.js

function getDefaultComponentToken(component, token, getDefaultToken) {
  if (typeof getDefaultToken === 'function') {
    var _token$component;
    return getDefaultToken(statistic_merge(token, (_token$component = token[component]) !== null && _token$component !== void 0 ? _token$component : {}));
  }
  return getDefaultToken !== null && getDefaultToken !== void 0 ? getDefaultToken : {};
}
/* harmony default export */ var util_getDefaultComponentToken = (getDefaultComponentToken);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/maxmin.js

function genMaxMin(type) {
  if (type === 'js') {
    return {
      max: Math.max,
      min: Math.min
    };
  }
  return {
    max: function max() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return "max(".concat(args.map(function (value) {
        return (0,external_antdCssinjs_.unit)(value);
      }).join(','), ")");
    },
    min: function min() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return "min(".concat(args.map(function (value) {
        return (0,external_antdCssinjs_.unit)(value);
      }).join(','), ")");
    }
  };
}
/* harmony default export */ var maxmin = (genMaxMin);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/_util/hooks/useUniqueMemo.js





var BEAT_LIMIT = 1000 * 60 * 10;

/**
 * A helper class to map keys to values.
 * It supports both primitive keys and object keys.
 */
var ArrayKeyMap = /*#__PURE__*/function () {
  function ArrayKeyMap() {
    _classCallCheck(this, ArrayKeyMap);
    _defineProperty(this, "map", new Map());
    // Use WeakMap to avoid memory leak
    _defineProperty(this, "objectIDMap", new WeakMap());
    _defineProperty(this, "nextID", 0);
    _defineProperty(this, "lastAccessBeat", new Map());
    // We will clean up the cache when reach the limit
    _defineProperty(this, "accessBeat", 0);
  }
  _createClass(ArrayKeyMap, [{
    key: "set",
    value: function set(keys, value) {
      // New set will trigger clear
      this.clear();

      // Set logic
      var compositeKey = this.getCompositeKey(keys);
      this.map.set(compositeKey, value);
      this.lastAccessBeat.set(compositeKey, Date.now());
    }
  }, {
    key: "get",
    value: function get(keys) {
      var compositeKey = this.getCompositeKey(keys);
      var cache = this.map.get(compositeKey);
      this.lastAccessBeat.set(compositeKey, Date.now());
      this.accessBeat += 1;
      return cache;
    }
  }, {
    key: "getCompositeKey",
    value: function getCompositeKey(keys) {
      var _this = this;
      var ids = keys.map(function (key) {
        if (key && typeof_typeof(key) === 'object') {
          return "obj_".concat(_this.getObjectID(key));
        }
        return "".concat(typeof_typeof(key), "_").concat(key);
      });
      return ids.join('|');
    }
  }, {
    key: "getObjectID",
    value: function getObjectID(obj) {
      if (this.objectIDMap.has(obj)) {
        return this.objectIDMap.get(obj);
      }
      var id = this.nextID;
      this.objectIDMap.set(obj, id);
      this.nextID += 1;
      return id;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this2 = this;
      if (this.accessBeat > 10000) {
        var now = Date.now();
        this.lastAccessBeat.forEach(function (beat, key) {
          if (now - beat > BEAT_LIMIT) {
            _this2.map.delete(key);
            _this2.lastAccessBeat.delete(key);
          }
        });
        this.accessBeat = 0;
      }
    }
  }]);
  return ArrayKeyMap;
}();
var uniqueMap = new ArrayKeyMap();

/**
 * Like `useMemo`, but this hook result will be shared across all instances.
 */
function useUniqueMemo(memoFn, deps) {
  return external_React_default().useMemo(function () {
    var cachedValue = uniqueMap.get(deps);
    if (cachedValue) {
      return cachedValue;
    }
    var newValue = memoFn();
    uniqueMap.set(deps, newValue);
    return newValue;
  }, deps);
}
/* harmony default export */ var hooks_useUniqueMemo = (useUniqueMemo);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/hooks/useCSP.js
/**
 * Provide a default hook since not everyone needs to config this.
 */
var useDefaultCSP = function useDefaultCSP() {
  return {};
};
/* harmony default export */ var hooks_useCSP = (useDefaultCSP);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/util/genStyleUtils.js














function genStyleUtils(config) {
  // Dependency inversion for preparing basic config.
  var _config$useCSP = config.useCSP,
    useCSP = _config$useCSP === void 0 ? hooks_useCSP : _config$useCSP,
    useToken = config.useToken,
    usePrefix = config.usePrefix,
    getResetStyles = config.getResetStyles,
    getCommonStyle = config.getCommonStyle,
    getCompUnitless = config.getCompUnitless;
  function genStyleHooks(component, styleFn, getDefaultToken, options) {
    var componentName = Array.isArray(component) ? component[0] : component;
    function prefixToken(key) {
      return "".concat(String(componentName)).concat(key.slice(0, 1).toUpperCase()).concat(key.slice(1));
    }

    // Fill unitless
    var originUnitless = (options === null || options === void 0 ? void 0 : options.unitless) || {};
    var originCompUnitless = typeof getCompUnitless === 'function' ? getCompUnitless(component) : {};
    var compUnitless = _objectSpread2(_objectSpread2({}, originCompUnitless), {}, _defineProperty({}, prefixToken('zIndexPopup'), true));
    Object.keys(originUnitless).forEach(function (key) {
      compUnitless[prefixToken(key)] = originUnitless[key];
    });

    // Options
    var mergedOptions = _objectSpread2(_objectSpread2({}, options), {}, {
      unitless: compUnitless,
      prefixToken: prefixToken
    });

    // Hooks
    var useStyle = genComponentStyleHook(component, styleFn, getDefaultToken, mergedOptions);
    var useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions);
    return function (prefixCls) {
      var rootCls = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : prefixCls;
      var _useStyle = useStyle(prefixCls, rootCls),
        _useStyle2 = _slicedToArray(_useStyle, 2),
        hashId = _useStyle2[1];
      var _useCSSVar = useCSSVar(rootCls),
        _useCSSVar2 = _slicedToArray(_useCSSVar, 2),
        wrapCSSVar = _useCSSVar2[0],
        cssVarCls = _useCSSVar2[1];
      return [wrapCSSVar, hashId, cssVarCls];
    };
  }
  function genCSSVarRegister(component, getDefaultToken, options) {
    var compUnitless = options.unitless,
      _options$injectStyle = options.injectStyle,
      injectStyle = _options$injectStyle === void 0 ? true : _options$injectStyle,
      prefixToken = options.prefixToken,
      ignore = options.ignore;
    var CSSVarRegister = function CSSVarRegister(_ref) {
      var rootCls = _ref.rootCls,
        _ref$cssVar = _ref.cssVar,
        cssVar = _ref$cssVar === void 0 ? {} : _ref$cssVar;
      var _useToken = useToken(),
        realToken = _useToken.realToken;
      (0,external_antdCssinjs_.useCSSVarRegister)({
        path: [component],
        prefix: cssVar.prefix,
        key: cssVar.key,
        unitless: compUnitless,
        ignore: ignore,
        token: realToken,
        scope: rootCls
      }, function () {
        var defaultToken = util_getDefaultComponentToken(component, realToken, getDefaultToken);
        var componentToken = util_getComponentToken(component, realToken, defaultToken, {
          deprecatedTokens: options === null || options === void 0 ? void 0 : options.deprecatedTokens
        });
        Object.keys(defaultToken).forEach(function (key) {
          componentToken[prefixToken(key)] = componentToken[key];
          delete componentToken[key];
        });
        return componentToken;
      });
      return null;
    };
    var useCSSVar = function useCSSVar(rootCls) {
      var _useToken2 = useToken(),
        cssVar = _useToken2.cssVar;
      return [function (node) {
        return injectStyle && cssVar ? /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement(CSSVarRegister, {
          rootCls: rootCls,
          cssVar: cssVar,
          component: component
        }), node) : node;
      }, cssVar === null || cssVar === void 0 ? void 0 : cssVar.key];
    };
    return useCSSVar;
  }
  function genComponentStyleHook(componentName, styleFn, getDefaultToken) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var cells = Array.isArray(componentName) ? componentName : [componentName, componentName];
    var _cells = _slicedToArray(cells, 1),
      component = _cells[0];
    var concatComponent = cells.join('-');
    var mergedLayer = config.layer || {
      name: 'antd'
    };

    // Return new style hook
    return function (prefixCls) {
      var rootCls = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : prefixCls;
      var _useToken3 = useToken(),
        theme = _useToken3.theme,
        realToken = _useToken3.realToken,
        hashId = _useToken3.hashId,
        token = _useToken3.token,
        cssVar = _useToken3.cssVar;
      var _usePrefix = usePrefix(),
        rootPrefixCls = _usePrefix.rootPrefixCls,
        iconPrefixCls = _usePrefix.iconPrefixCls;
      var csp = useCSP();
      var type = cssVar ? 'css' : 'js';

      // Use unique memo to share the result across all instances
      var calc = hooks_useUniqueMemo(function () {
        var unitlessCssVar = new Set();
        if (cssVar) {
          Object.keys(options.unitless || {}).forEach(function (key) {
            // Some component proxy the AliasToken (e.g. Image) and some not (e.g. Modal)
            // We should both pass in `unitlessCssVar` to make sure the CSSVar can be unitless.
            unitlessCssVar.add((0,external_antdCssinjs_.token2CSSVar)(key, cssVar.prefix));
            unitlessCssVar.add((0,external_antdCssinjs_.token2CSSVar)(key, util_getCompVarPrefix(component, cssVar.prefix)));
          });
        }
        return util_calc(type, unitlessCssVar);
      }, [type, component, cssVar === null || cssVar === void 0 ? void 0 : cssVar.prefix]);
      var _genMaxMin = maxmin(type),
        max = _genMaxMin.max,
        min = _genMaxMin.min;

      // Shared config
      var sharedConfig = {
        theme: theme,
        token: token,
        hashId: hashId,
        nonce: function nonce() {
          return csp.nonce;
        },
        clientOnly: options.clientOnly,
        layer: mergedLayer,
        // antd is always at top of styles
        order: options.order || -999
      };

      // Generate style for all need reset tags.
      (0,external_antdCssinjs_.useStyleRegister)(_objectSpread2(_objectSpread2({}, sharedConfig), {}, {
        clientOnly: false,
        path: ['Shared', rootPrefixCls]
      }), function () {
        return typeof getResetStyles === 'function' ? getResetStyles(token) : [];
      });
      var wrapSSR = (0,external_antdCssinjs_.useStyleRegister)(_objectSpread2(_objectSpread2({}, sharedConfig), {}, {
        path: [concatComponent, prefixCls, iconPrefixCls]
      }), function () {
        if (options.injectStyle === false) {
          return [];
        }
        var _statisticToken = util_statistic(token),
          proxyToken = _statisticToken.token,
          flush = _statisticToken.flush;
        var defaultComponentToken = util_getDefaultComponentToken(component, realToken, getDefaultToken);
        var componentCls = ".".concat(prefixCls);
        var componentToken = util_getComponentToken(component, realToken, defaultComponentToken, {
          deprecatedTokens: options.deprecatedTokens
        });
        if (cssVar && defaultComponentToken && typeof_typeof(defaultComponentToken) === 'object') {
          Object.keys(defaultComponentToken).forEach(function (key) {
            defaultComponentToken[key] = "var(".concat((0,external_antdCssinjs_.token2CSSVar)(key, util_getCompVarPrefix(component, cssVar.prefix)), ")");
          });
        }
        var mergedToken = statistic_merge(proxyToken, {
          componentCls: componentCls,
          prefixCls: prefixCls,
          iconCls: ".".concat(iconPrefixCls),
          antCls: ".".concat(rootPrefixCls),
          calc: calc,
          // @ts-ignore
          max: max,
          // @ts-ignore
          min: min
        }, cssVar ? defaultComponentToken : componentToken);
        var styleInterpolation = styleFn(mergedToken, {
          hashId: hashId,
          prefixCls: prefixCls,
          rootPrefixCls: rootPrefixCls,
          iconPrefixCls: iconPrefixCls
        });
        flush(component, componentToken);
        var commonStyle = typeof getCommonStyle === 'function' ? getCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont) : null;
        return [options.resetStyle === false ? null : commonStyle, styleInterpolation];
      });
      return [wrapSSR, hashId];
    };
  }
  function genSubStyleComponent(componentName, styleFn, getDefaultToken) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, _objectSpread2({
      resetStyle: false,
      // Sub Style should default after root one
      order: -998
    }, options));
    var StyledComponent = function StyledComponent(_ref2) {
      var prefixCls = _ref2.prefixCls,
        _ref2$rootCls = _ref2.rootCls,
        rootCls = _ref2$rootCls === void 0 ? prefixCls : _ref2$rootCls;
      useStyle(prefixCls, rootCls);
      return null;
    };
    if (false) {}
    return StyledComponent;
  }
  return {
    genStyleHooks: genStyleHooks,
    genSubStyleComponent: genSubStyleComponent,
    genComponentStyleHook: genComponentStyleHook
  };
}
/* harmony default export */ var util_genStyleUtils = (genStyleUtils);
;// CONCATENATED MODULE: ./node_modules/@ant-design/cssinjs-utils/es/index.js



;// CONCATENATED MODULE: ./node_modules/@ant-design/fast-color/es/FastColor.js

const round = Math.round;

/**
 * Support format, alpha unit will check the % mark:
 * - rgba(102, 204, 255, .5)      -> [102, 204, 255, 0.5]
 * - rgb(102 204 255 / .5)        -> [102, 204, 255, 0.5]
 * - rgb(100%, 50%, 0% / 50%)     -> [255, 128, 0, 0.5]
 * - hsl(270, 60, 40, .5)         -> [270, 60, 40, 0.5]
 * - hsl(270deg 60% 40% / 50%)   -> [270, 60, 40, 0.5]
 *
 * When `base` is provided, the percentage value will be divided by `base`.
 */
function splitColorStr(str, parseNum) {
  const match = str
  // Remove str before `(`
  .replace(/^[^(]*\((.*)/, '$1')
  // Remove str after `)`
  .replace(/\).*/, '').match(/\d*\.?\d+%?/g) || [];
  const numList = match.map(item => parseFloat(item));
  for (let i = 0; i < 3; i += 1) {
    numList[i] = parseNum(numList[i] || 0, match[i] || '', i);
  }

  // For alpha. 50% should be 0.5
  if (match[3]) {
    numList[3] = match[3].includes('%') ? numList[3] / 100 : numList[3];
  } else {
    // By default, alpha is 1
    numList[3] = 1;
  }
  return numList;
}
const parseHSVorHSL = (num, _, index) => index === 0 ? num : num / 100;

/** round and limit number to integer between 0-255 */
function limitRange(value, max) {
  const mergedMax = max || 255;
  if (value > mergedMax) {
    return mergedMax;
  }
  if (value < 0) {
    return 0;
  }
  return value;
}
class FastColor {
  constructor(input) {
    /**
     * All FastColor objects are valid. So isValid is always true. This property is kept to be compatible with TinyColor.
     */
    _defineProperty(this, "isValid", true);
    /**
     * Red, R in RGB
     */
    _defineProperty(this, "r", 0);
    /**
     * Green, G in RGB
     */
    _defineProperty(this, "g", 0);
    /**
     * Blue, B in RGB
     */
    _defineProperty(this, "b", 0);
    /**
     * Alpha/Opacity, A in RGBA/HSLA
     */
    _defineProperty(this, "a", 1);
    // HSV privates
    _defineProperty(this, "_h", void 0);
    _defineProperty(this, "_s", void 0);
    _defineProperty(this, "_l", void 0);
    _defineProperty(this, "_v", void 0);
    // intermediate variables to calculate HSL/HSV
    _defineProperty(this, "_max", void 0);
    _defineProperty(this, "_min", void 0);
    _defineProperty(this, "_brightness", void 0);
    /**
     * Always check 3 char in the object to determine the format.
     * We not use function in check to save bundle size.
     * e.g. 'rgb' -> { r: 0, g: 0, b: 0 }.
     */
    function matchFormat(str) {
      return str[0] in input && str[1] in input && str[2] in input;
    }
    if (!input) {
      // Do nothing since already initialized
    } else if (typeof input === 'string') {
      const trimStr = input.trim();
      function matchPrefix(prefix) {
        return trimStr.startsWith(prefix);
      }
      if (/^#?[A-F\d]{3,8}$/i.test(trimStr)) {
        this.fromHexString(trimStr);
      } else if (matchPrefix('rgb')) {
        this.fromRgbString(trimStr);
      } else if (matchPrefix('hsl')) {
        this.fromHslString(trimStr);
      } else if (matchPrefix('hsv') || matchPrefix('hsb')) {
        this.fromHsvString(trimStr);
      }
    } else if (input instanceof FastColor) {
      this.r = input.r;
      this.g = input.g;
      this.b = input.b;
      this.a = input.a;
      this._h = input._h;
      this._s = input._s;
      this._l = input._l;
      this._v = input._v;
    } else if (matchFormat('rgb')) {
      this.r = limitRange(input.r);
      this.g = limitRange(input.g);
      this.b = limitRange(input.b);
      this.a = typeof input.a === 'number' ? limitRange(input.a, 1) : 1;
    } else if (matchFormat('hsl')) {
      this.fromHsl(input);
    } else if (matchFormat('hsv')) {
      this.fromHsv(input);
    } else {
      throw new Error('@ant-design/fast-color: unsupported input ' + JSON.stringify(input));
    }
  }

  // ======================= Setter =======================

  setR(value) {
    return this._sc('r', value);
  }
  setG(value) {
    return this._sc('g', value);
  }
  setB(value) {
    return this._sc('b', value);
  }
  setA(value) {
    return this._sc('a', value, 1);
  }
  setHue(value) {
    const hsv = this.toHsv();
    hsv.h = value;
    return this._c(hsv);
  }

  // ======================= Getter =======================
  /**
   * Returns the perceived luminance of a color, from 0-1.
   * @see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   */
  getLuminance() {
    function adjustGamma(raw) {
      const val = raw / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    }
    const R = adjustGamma(this.r);
    const G = adjustGamma(this.g);
    const B = adjustGamma(this.b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  getHue() {
    if (typeof this._h === 'undefined') {
      const delta = this.getMax() - this.getMin();
      if (delta === 0) {
        this._h = 0;
      } else {
        this._h = round(60 * (this.r === this.getMax() ? (this.g - this.b) / delta + (this.g < this.b ? 6 : 0) : this.g === this.getMax() ? (this.b - this.r) / delta + 2 : (this.r - this.g) / delta + 4));
      }
    }
    return this._h;
  }
  getSaturation() {
    if (typeof this._s === 'undefined') {
      const delta = this.getMax() - this.getMin();
      if (delta === 0) {
        this._s = 0;
      } else {
        this._s = delta / this.getMax();
      }
    }
    return this._s;
  }
  getLightness() {
    if (typeof this._l === 'undefined') {
      this._l = (this.getMax() + this.getMin()) / 510;
    }
    return this._l;
  }
  getValue() {
    if (typeof this._v === 'undefined') {
      this._v = this.getMax() / 255;
    }
    return this._v;
  }

  /**
   * Returns the perceived brightness of the color, from 0-255.
   * Note: this is not the b of HSB
   * @see http://www.w3.org/TR/AERT#color-contrast
   */
  getBrightness() {
    if (typeof this._brightness === 'undefined') {
      this._brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1000;
    }
    return this._brightness;
  }

  // ======================== Func ========================

  darken(amount = 10) {
    const h = this.getHue();
    const s = this.getSaturation();
    let l = this.getLightness() - amount / 100;
    if (l < 0) {
      l = 0;
    }
    return this._c({
      h,
      s,
      l,
      a: this.a
    });
  }
  lighten(amount = 10) {
    const h = this.getHue();
    const s = this.getSaturation();
    let l = this.getLightness() + amount / 100;
    if (l > 1) {
      l = 1;
    }
    return this._c({
      h,
      s,
      l,
      a: this.a
    });
  }

  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).
   */
  mix(input, amount = 50) {
    const color = this._c(input);
    const p = amount / 100;
    const calc = key => (color[key] - this[key]) * p + this[key];
    const rgba = {
      r: round(calc('r')),
      g: round(calc('g')),
      b: round(calc('b')),
      a: round(calc('a') * 100) / 100
    };
    return this._c(rgba);
  }

  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   */
  tint(amount = 10) {
    return this.mix({
      r: 255,
      g: 255,
      b: 255,
      a: 1
    }, amount);
  }

  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   */
  shade(amount = 10) {
    return this.mix({
      r: 0,
      g: 0,
      b: 0,
      a: 1
    }, amount);
  }
  onBackground(background) {
    const bg = this._c(background);
    const alpha = this.a + bg.a * (1 - this.a);
    const calc = key => {
      return round((this[key] * this.a + bg[key] * bg.a * (1 - this.a)) / alpha);
    };
    return this._c({
      r: calc('r'),
      g: calc('g'),
      b: calc('b'),
      a: alpha
    });
  }

  // ======================= Status =======================
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return this.getBrightness() >= 128;
  }

  // ======================== MISC ========================
  equals(other) {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
  }
  clone() {
    return this._c(this);
  }

  // ======================= Format =======================
  toHexString() {
    let hex = '#';
    const rHex = (this.r || 0).toString(16);
    hex += rHex.length === 2 ? rHex : '0' + rHex;
    const gHex = (this.g || 0).toString(16);
    hex += gHex.length === 2 ? gHex : '0' + gHex;
    const bHex = (this.b || 0).toString(16);
    hex += bHex.length === 2 ? bHex : '0' + bHex;
    if (typeof this.a === 'number' && this.a >= 0 && this.a < 1) {
      const aHex = round(this.a * 255).toString(16);
      hex += aHex.length === 2 ? aHex : '0' + aHex;
    }
    return hex;
  }

  /** CSS support color pattern */
  toHsl() {
    return {
      h: this.getHue(),
      s: this.getSaturation(),
      l: this.getLightness(),
      a: this.a
    };
  }

  /** CSS support color pattern */
  toHslString() {
    const h = this.getHue();
    const s = round(this.getSaturation() * 100);
    const l = round(this.getLightness() * 100);
    return this.a !== 1 ? `hsla(${h},${s}%,${l}%,${this.a})` : `hsl(${h},${s}%,${l}%)`;
  }

  /** Same as toHsb */
  toHsv() {
    return {
      h: this.getHue(),
      s: this.getSaturation(),
      v: this.getValue(),
      a: this.a
    };
  }
  toRgb() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    };
  }
  toRgbString() {
    return this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`;
  }
  toString() {
    return this.toRgbString();
  }

  // ====================== Privates ======================
  /** Return a new FastColor object with one channel changed */
  _sc(rgb, value, max) {
    const clone = this.clone();
    clone[rgb] = limitRange(value, max);
    return clone;
  }
  _c(input) {
    return new this.constructor(input);
  }
  getMax() {
    if (typeof this._max === 'undefined') {
      this._max = Math.max(this.r, this.g, this.b);
    }
    return this._max;
  }
  getMin() {
    if (typeof this._min === 'undefined') {
      this._min = Math.min(this.r, this.g, this.b);
    }
    return this._min;
  }
  fromHexString(trimStr) {
    const withoutPrefix = trimStr.replace('#', '');
    function connectNum(index1, index2) {
      return parseInt(withoutPrefix[index1] + withoutPrefix[index2 || index1], 16);
    }
    if (withoutPrefix.length < 6) {
      // #rgb or #rgba
      this.r = connectNum(0);
      this.g = connectNum(1);
      this.b = connectNum(2);
      this.a = withoutPrefix[3] ? connectNum(3) / 255 : 1;
    } else {
      // #rrggbb or #rrggbbaa
      this.r = connectNum(0, 1);
      this.g = connectNum(2, 3);
      this.b = connectNum(4, 5);
      this.a = withoutPrefix[6] ? connectNum(6, 7) / 255 : 1;
    }
  }
  fromHsl({
    h,
    s,
    l,
    a
  }) {
    this._h = h % 360;
    this._s = s;
    this._l = l;
    this.a = typeof a === 'number' ? a : 1;
    if (s <= 0) {
      const rgb = round(l * 255);
      this.r = rgb;
      this.g = rgb;
      this.b = rgb;
    }
    let r = 0,
      g = 0,
      b = 0;
    const huePrime = h / 60;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
    if (huePrime >= 0 && huePrime < 1) {
      r = chroma;
      g = secondComponent;
    } else if (huePrime >= 1 && huePrime < 2) {
      r = secondComponent;
      g = chroma;
    } else if (huePrime >= 2 && huePrime < 3) {
      g = chroma;
      b = secondComponent;
    } else if (huePrime >= 3 && huePrime < 4) {
      g = secondComponent;
      b = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
      r = secondComponent;
      b = chroma;
    } else if (huePrime >= 5 && huePrime < 6) {
      r = chroma;
      b = secondComponent;
    }
    const lightnessModification = l - chroma / 2;
    this.r = round((r + lightnessModification) * 255);
    this.g = round((g + lightnessModification) * 255);
    this.b = round((b + lightnessModification) * 255);
  }
  fromHsv({
    h,
    s,
    v,
    a
  }) {
    this._h = h % 360;
    this._s = s;
    this._v = v;
    this.a = typeof a === 'number' ? a : 1;
    const vv = round(v * 255);
    this.r = vv;
    this.g = vv;
    this.b = vv;
    if (s <= 0) {
      return;
    }
    const hh = h / 60;
    const i = Math.floor(hh);
    const ff = hh - i;
    const p = round(v * (1.0 - s) * 255);
    const q = round(v * (1.0 - s * ff) * 255);
    const t = round(v * (1.0 - s * (1.0 - ff)) * 255);
    switch (i) {
      case 0:
        this.g = t;
        this.b = p;
        break;
      case 1:
        this.r = q;
        this.b = p;
        break;
      case 2:
        this.r = p;
        this.b = t;
        break;
      case 3:
        this.r = p;
        this.g = q;
        break;
      case 4:
        this.r = t;
        this.g = p;
        break;
      case 5:
      default:
        this.g = p;
        this.b = q;
        break;
    }
  }
  fromHsvString(trimStr) {
    const cells = splitColorStr(trimStr, parseHSVorHSL);
    this.fromHsv({
      h: cells[0],
      s: cells[1],
      v: cells[2],
      a: cells[3]
    });
  }
  fromHslString(trimStr) {
    const cells = splitColorStr(trimStr, parseHSVorHSL);
    this.fromHsl({
      h: cells[0],
      s: cells[1],
      l: cells[2],
      a: cells[3]
    });
  }
  fromRgbString(trimStr) {
    const cells = splitColorStr(trimStr, (num, txt) =>
    // Convert percentage to number. e.g. 50% -> 128
    txt.includes('%') ? round(num / 100 * 255) : num);
    this.r = cells[0];
    this.g = cells[1];
    this.b = cells[2];
    this.a = cells[3];
  }
}
;// CONCATENATED MODULE: ./node_modules/@ant-design/fast-color/es/index.js


;// CONCATENATED MODULE: ./node_modules/antd/es/theme/useToken.js
var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};






const unitless = {
  lineHeight: true,
  lineHeightSM: true,
  lineHeightLG: true,
  lineHeightHeading1: true,
  lineHeightHeading2: true,
  lineHeightHeading3: true,
  lineHeightHeading4: true,
  lineHeightHeading5: true,
  opacityLoading: true,
  fontWeightStrong: true,
  zIndexPopupBase: true,
  zIndexBase: true,
  opacityImage: true
};
const ignore = {
  size: true,
  sizeSM: true,
  sizeLG: true,
  sizeMD: true,
  sizeXS: true,
  sizeXXS: true,
  sizeMS: true,
  sizeXL: true,
  sizeXXL: true,
  sizeUnit: true,
  sizeStep: true,
  motionBase: true,
  motionUnit: true
};
const preserve = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true
};
const getComputedToken = (originToken, overrideToken, theme) => {
  const derivativeToken = theme.getDerivativeToken(originToken);
  const {
      override
    } = overrideToken,
    components = __rest(overrideToken, ["override"]);
  // Merge with override
  let mergedDerivativeToken = Object.assign(Object.assign({}, derivativeToken), {
    override
  });
  // Format if needed
  mergedDerivativeToken = formatToken(mergedDerivativeToken);
  if (components) {
    Object.entries(components).forEach(_ref => {
      let [key, value] = _ref;
      const {
          theme: componentTheme
        } = value,
        componentTokens = __rest(value, ["theme"]);
      let mergedComponentToken = componentTokens;
      if (componentTheme) {
        mergedComponentToken = getComputedToken(Object.assign(Object.assign({}, mergedDerivativeToken), componentTokens), {
          override: componentTokens
        }, componentTheme);
      }
      mergedDerivativeToken[key] = mergedComponentToken;
    });
  }
  return mergedDerivativeToken;
};
// ================================== Hook ==================================
function useToken() {
  const {
    token: rootDesignToken,
    hashed,
    theme,
    override,
    cssVar
  } = React.useContext(DesignTokenContext);
  const salt = `${version}-${hashed || ''}`;
  const mergedTheme = theme || defaultTheme;
  const [token, hashId, realToken] = useCacheToken(mergedTheme, [defaultSeedToken, rootDesignToken], {
    salt,
    override,
    getComputedToken,
    // formatToken will not be consumed after 1.15.0 with getComputedToken.
    // But token will break if @ant-design/cssinjs is under 1.15.0 without it
    formatToken,
    cssVar: cssVar && {
      prefix: cssVar.prefix,
      key: cssVar.key,
      unitless,
      ignore,
      preserve
    }
  });
  return [mergedTheme, realToken, hashed ? hashId : '', token, cssVar];
}
;// CONCATENATED MODULE: ./node_modules/antd/node_modules/@ctrl/tinycolor/dist/module/util.js
/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
function module_util_bound01(n, max) {
  if (util_isOnePointZero(n)) {
    n = '100%';
  }
  var isPercent = util_isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
  // Automatically convert percentage into number
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }
  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }
  // Convert into [0, 1] range if it isn't already
  if (max === 360) {
    // If n is a hue given in degrees,
    // wrap around out-of-range values into [0, 360] range
    // then convert into [0, 1].
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    // If n not a hue given in degrees
    // Convert into [0, 1] range if it isn't already.
    n = n % max / parseFloat(String(max));
  }
  return n;
}
/**
 * Force a number between 0 and 1
 * @hidden
 */
function util_clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
function util_isOnePointZero(n) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}
/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
function util_isPercentage(n) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
}
/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */
function util_boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}
/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
function util_convertToPercentage(n) {
  if (n <= 1) {
    return "".concat(Number(n) * 100, "%");
  }
  return n;
}
/**
 * Force a hex value to have 2 characters
 * @hidden
 */
function module_util_pad2(c) {
  return c.length === 1 ? '0' + c : String(c);
}
;// CONCATENATED MODULE: ./node_modules/antd/node_modules/@ctrl/tinycolor/dist/module/conversion.js

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */
function conversion_rgbToRgb(r, g, b) {
  return {
    r: module_util_bound01(r, 255) * 255,
    g: module_util_bound01(g, 255) * 255,
    b: module_util_bound01(b, 255) * 255
  };
}
/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]
 */
function conversion_rgbToHsl(r, g, b) {
  r = module_util_bound01(r, 255);
  g = module_util_bound01(g, 255);
  b = module_util_bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var s = 0;
  var l = (max + min) / 2;
  if (max === min) {
    s = 0;
    h = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l
  };
}
function conversion_hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * (6 * t);
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}
/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function conversion_hslToRgb(h, s, l) {
  var r;
  var g;
  var b;
  h = module_util_bound01(h, 360);
  s = module_util_bound01(s, 100);
  l = module_util_bound01(l, 100);
  if (s === 0) {
    // achromatic
    g = l;
    b = l;
    r = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = conversion_hue2rgb(p, q, h + 1 / 3);
    g = conversion_hue2rgb(p, q, h);
    b = conversion_hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]
 */
function conversion_rgbToHsv(r, g, b) {
  r = module_util_bound01(r, 255);
  g = module_util_bound01(g, 255);
  b = module_util_bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var v = max;
  var d = max - min;
  var s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    v: v
  };
}
/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function conversion_hsvToRgb(h, s, v) {
  h = module_util_bound01(h, 360) * 6;
  s = module_util_bound01(s, 100);
  v = module_util_bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}
/**
 * Converts an RGB color to hex
 *
 * Assumes r, g, and b are contained in the set [0, 255]
 * Returns a 3 or 6 character hex
 */
function conversion_rgbToHex(r, g, b, allow3Char) {
  var hex = [module_util_pad2(Math.round(r).toString(16)), module_util_pad2(Math.round(g).toString(16)), module_util_pad2(Math.round(b).toString(16))];
  // Return a 3 character hex if possible
  if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join('');
}
/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * Assumes r, g, b are contained in the set [0, 255] and
 * a in [0, 1]. Returns a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params
function conversion_rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [module_util_pad2(Math.round(r).toString(16)), module_util_pad2(Math.round(g).toString(16)), module_util_pad2(Math.round(b).toString(16)), module_util_pad2(conversion_convertDecimalToHex(a))];
  // Return a 4 character hex if possible
  if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join('');
}
/**
 * Converts an RGBA color to an ARGB Hex8 string
 * Rarely used, but required for "toFilter()"
 */
function conversion_rgbaToArgbHex(r, g, b, a) {
  var hex = [pad2(conversion_convertDecimalToHex(a)), pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  return hex.join('');
}
/** Converts a decimal to a hex value */
function conversion_convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */
function conversion_convertHexToDecimal(h) {
  return conversion_parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */
function conversion_parseIntFromHex(val) {
  return parseInt(val, 16);
}
function conversion_numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 0xff00) >> 8,
    b: color & 0xff
  };
}
;// CONCATENATED MODULE: ./node_modules/antd/node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
// https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
/**
 * @hidden
 */
var css_color_names_names = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  goldenrod: '#daa520',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavenderblush: '#fff0f5',
  lavender: '#e6e6fa',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};
;// CONCATENATED MODULE: ./node_modules/antd/node_modules/@ctrl/tinycolor/dist/module/format-input.js
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */



/**
 * Given a string or object, convert that input to RGB
 *
 * Possible string inputs:
 * ```
 * "red"
 * "#f00" or "f00"
 * "#ff0000" or "ff0000"
 * "#ff000000" or "ff000000"
 * "rgb 255 0 0" or "rgb (255, 0, 0)"
 * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
 * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
 * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
 * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
 * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
 * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
 * ```
 */
function format_input_inputToRGB(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color === 'string') {
    color = format_input_stringInputToObject(color);
  }
  if (typeof color === 'object') {
    if (format_input_isValidCSSUnit(color.r) && format_input_isValidCSSUnit(color.g) && format_input_isValidCSSUnit(color.b)) {
      rgb = conversion_rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
    } else if (format_input_isValidCSSUnit(color.h) && format_input_isValidCSSUnit(color.s) && format_input_isValidCSSUnit(color.v)) {
      s = util_convertToPercentage(color.s);
      v = util_convertToPercentage(color.v);
      rgb = conversion_hsvToRgb(color.h, s, v);
      ok = true;
      format = 'hsv';
    } else if (format_input_isValidCSSUnit(color.h) && format_input_isValidCSSUnit(color.s) && format_input_isValidCSSUnit(color.l)) {
      s = util_convertToPercentage(color.s);
      l = util_convertToPercentage(color.l);
      rgb = conversion_hslToRgb(color.h, s, l);
      ok = true;
      format = 'hsl';
    }
    if (Object.prototype.hasOwnProperty.call(color, 'a')) {
      a = color.a;
    }
  }
  a = util_boundAlpha(a);
  return {
    ok: ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a
  };
}
// <http://www.w3.org/TR/css3-values/#integers>
var format_input_CSS_INTEGER = '[-\\+]?\\d+%?';
// <http://www.w3.org/TR/css3-values/#number-value>
var format_input_CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
var format_input_CSS_UNIT = "(?:".concat(format_input_CSS_NUMBER, ")|(?:").concat(format_input_CSS_INTEGER, ")");
// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
var format_input_PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(format_input_CSS_UNIT, ")[,|\\s]+(").concat(format_input_CSS_UNIT, ")[,|\\s]+(").concat(format_input_CSS_UNIT, ")\\s*\\)?");
var format_input_PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(format_input_CSS_UNIT, ")[,|\\s]+(").concat(format_input_CSS_UNIT, ")[,|\\s]+(").concat(format_input_CSS_UNIT, ")[,|\\s]+(").concat(format_input_CSS_UNIT, ")\\s*\\)?");
var format_input_matchers = {
  CSS_UNIT: new RegExp(format_input_CSS_UNIT),
  rgb: new RegExp('rgb' + format_input_PERMISSIVE_MATCH3),
  rgba: new RegExp('rgba' + format_input_PERMISSIVE_MATCH4),
  hsl: new RegExp('hsl' + format_input_PERMISSIVE_MATCH3),
  hsla: new RegExp('hsla' + format_input_PERMISSIVE_MATCH4),
  hsv: new RegExp('hsv' + format_input_PERMISSIVE_MATCH3),
  hsva: new RegExp('hsva' + format_input_PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
 */
function format_input_stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (css_color_names_names[color]) {
    color = css_color_names_names[color];
    named = true;
  } else if (color === 'transparent') {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: 'name'
    };
  }
  // Try to match string input using regular expressions.
  // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the tinycolor is initialized with string or object.
  var match = format_input_matchers.rgb.exec(color);
  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }
  match = format_input_matchers.rgba.exec(color);
  if (match) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }
  match = format_input_matchers.hsl.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }
  match = format_input_matchers.hsla.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }
  match = format_input_matchers.hsv.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }
  match = format_input_matchers.hsva.exec(color);
  if (match) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }
  match = format_input_matchers.hex8.exec(color);
  if (match) {
    return {
      r: conversion_parseIntFromHex(match[1]),
      g: conversion_parseIntFromHex(match[2]),
      b: conversion_parseIntFromHex(match[3]),
      a: conversion_convertHexToDecimal(match[4]),
      format: named ? 'name' : 'hex8'
    };
  }
  match = format_input_matchers.hex6.exec(color);
  if (match) {
    return {
      r: conversion_parseIntFromHex(match[1]),
      g: conversion_parseIntFromHex(match[2]),
      b: conversion_parseIntFromHex(match[3]),
      format: named ? 'name' : 'hex'
    };
  }
  match = format_input_matchers.hex4.exec(color);
  if (match) {
    return {
      r: conversion_parseIntFromHex(match[1] + match[1]),
      g: conversion_parseIntFromHex(match[2] + match[2]),
      b: conversion_parseIntFromHex(match[3] + match[3]),
      a: conversion_convertHexToDecimal(match[4] + match[4]),
      format: named ? 'name' : 'hex8'
    };
  }
  match = format_input_matchers.hex3.exec(color);
  if (match) {
    return {
      r: conversion_parseIntFromHex(match[1] + match[1]),
      g: conversion_parseIntFromHex(match[2] + match[2]),
      b: conversion_parseIntFromHex(match[3] + match[3]),
      format: named ? 'name' : 'hex'
    };
  }
  return false;
}
/**
 * Check to see if it looks like a CSS unit
 * (see `matchers` above for definition).
 */
function format_input_isValidCSSUnit(color) {
  return Boolean(format_input_matchers.CSS_UNIT.exec(String(color)));
}
;// CONCATENATED MODULE: ./node_modules/antd/node_modules/@ctrl/tinycolor/dist/module/index.js




var TinyColor = /** @class */function () {
  function TinyColor(color, opts) {
    if (color === void 0) {
      color = '';
    }
    if (opts === void 0) {
      opts = {};
    }
    var _a;
    // If input is already a tinycolor, return itself
    if (color instanceof TinyColor) {
      // eslint-disable-next-line no-constructor-return
      return color;
    }
    if (typeof color === 'number') {
      color = conversion_numberInputToObject(color);
    }
    this.originalInput = color;
    var rgb = format_input_inputToRGB(color);
    this.originalInput = color;
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    this.a = rgb.a;
    this.roundA = Math.round(100 * this.a) / 100;
    this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
    this.gradientType = opts.gradientType;
    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this.r < 1) {
      this.r = Math.round(this.r);
    }
    if (this.g < 1) {
      this.g = Math.round(this.g);
    }
    if (this.b < 1) {
      this.b = Math.round(this.b);
    }
    this.isValid = rgb.ok;
  }
  TinyColor.prototype.isDark = function () {
    return this.getBrightness() < 128;
  };
  TinyColor.prototype.isLight = function () {
    return !this.isDark();
  };
  /**
   * Returns the perceived brightness of the color, from 0-255.
   */
  TinyColor.prototype.getBrightness = function () {
    // http://www.w3.org/TR/AERT#color-contrast
    var rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  };
  /**
   * Returns the perceived luminance of a color, from 0-1.
   */
  TinyColor.prototype.getLuminance = function () {
    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    var rgb = this.toRgb();
    var R;
    var G;
    var B;
    var RsRGB = rgb.r / 255;
    var GsRGB = rgb.g / 255;
    var BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) {
      R = RsRGB / 12.92;
    } else {
      // eslint-disable-next-line prefer-exponentiation-operator
      R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }
    if (GsRGB <= 0.03928) {
      G = GsRGB / 12.92;
    } else {
      // eslint-disable-next-line prefer-exponentiation-operator
      G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }
    if (BsRGB <= 0.03928) {
      B = BsRGB / 12.92;
    } else {
      // eslint-disable-next-line prefer-exponentiation-operator
      B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  /**
   * Returns the alpha value of a color, from 0-1.
   */
  TinyColor.prototype.getAlpha = function () {
    return this.a;
  };
  /**
   * Sets the alpha value on the current color.
   *
   * @param alpha - The new alpha value. The accepted range is 0-1.
   */
  TinyColor.prototype.setAlpha = function (alpha) {
    this.a = util_boundAlpha(alpha);
    this.roundA = Math.round(100 * this.a) / 100;
    return this;
  };
  /**
   * Returns whether the color is monochrome.
   */
  TinyColor.prototype.isMonochrome = function () {
    var s = this.toHsl().s;
    return s === 0;
  };
  /**
   * Returns the object as a HSVA object.
   */
  TinyColor.prototype.toHsv = function () {
    var hsv = conversion_rgbToHsv(this.r, this.g, this.b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v,
      a: this.a
    };
  };
  /**
   * Returns the hsva values interpolated into a string with the following format:
   * "hsva(xxx, xxx, xxx, xx)".
   */
  TinyColor.prototype.toHsvString = function () {
    var hsv = conversion_rgbToHsv(this.r, this.g, this.b);
    var h = Math.round(hsv.h * 360);
    var s = Math.round(hsv.s * 100);
    var v = Math.round(hsv.v * 100);
    return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
  };
  /**
   * Returns the object as a HSLA object.
   */
  TinyColor.prototype.toHsl = function () {
    var hsl = conversion_rgbToHsl(this.r, this.g, this.b);
    return {
      h: hsl.h * 360,
      s: hsl.s,
      l: hsl.l,
      a: this.a
    };
  };
  /**
   * Returns the hsla values interpolated into a string with the following format:
   * "hsla(xxx, xxx, xxx, xx)".
   */
  TinyColor.prototype.toHslString = function () {
    var hsl = conversion_rgbToHsl(this.r, this.g, this.b);
    var h = Math.round(hsl.h * 360);
    var s = Math.round(hsl.s * 100);
    var l = Math.round(hsl.l * 100);
    return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
  };
  /**
   * Returns the hex value of the color.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  TinyColor.prototype.toHex = function (allow3Char) {
    if (allow3Char === void 0) {
      allow3Char = false;
    }
    return conversion_rgbToHex(this.r, this.g, this.b, allow3Char);
  };
  /**
   * Returns the hex value of the color -with a # prefixed.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  TinyColor.prototype.toHexString = function (allow3Char) {
    if (allow3Char === void 0) {
      allow3Char = false;
    }
    return '#' + this.toHex(allow3Char);
  };
  /**
   * Returns the hex 8 value of the color.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  TinyColor.prototype.toHex8 = function (allow4Char) {
    if (allow4Char === void 0) {
      allow4Char = false;
    }
    return conversion_rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
  };
  /**
   * Returns the hex 8 value of the color -with a # prefixed.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  TinyColor.prototype.toHex8String = function (allow4Char) {
    if (allow4Char === void 0) {
      allow4Char = false;
    }
    return '#' + this.toHex8(allow4Char);
  };
  /**
   * Returns the shorter hex value of the color depends on its alpha -with a # prefixed.
   * @param allowShortChar will shorten hex value to 3 or 4 char if possible
   */
  TinyColor.prototype.toHexShortString = function (allowShortChar) {
    if (allowShortChar === void 0) {
      allowShortChar = false;
    }
    return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
  };
  /**
   * Returns the object as a RGBA object.
   */
  TinyColor.prototype.toRgb = function () {
    return {
      r: Math.round(this.r),
      g: Math.round(this.g),
      b: Math.round(this.b),
      a: this.a
    };
  };
  /**
   * Returns the RGBA values interpolated into a string with the following format:
   * "RGBA(xxx, xxx, xxx, xx)".
   */
  TinyColor.prototype.toRgbString = function () {
    var r = Math.round(this.r);
    var g = Math.round(this.g);
    var b = Math.round(this.b);
    return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
  };
  /**
   * Returns the object as a RGBA object.
   */
  TinyColor.prototype.toPercentageRgb = function () {
    var fmt = function (x) {
      return "".concat(Math.round(module_util_bound01(x, 255) * 100), "%");
    };
    return {
      r: fmt(this.r),
      g: fmt(this.g),
      b: fmt(this.b),
      a: this.a
    };
  };
  /**
   * Returns the RGBA relative values interpolated into a string
   */
  TinyColor.prototype.toPercentageRgbString = function () {
    var rnd = function (x) {
      return Math.round(module_util_bound01(x, 255) * 100);
    };
    return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
  };
  /**
   * The 'real' name of the color -if there is one.
   */
  TinyColor.prototype.toName = function () {
    if (this.a === 0) {
      return 'transparent';
    }
    if (this.a < 1) {
      return false;
    }
    var hex = '#' + conversion_rgbToHex(this.r, this.g, this.b, false);
    for (var _i = 0, _a = Object.entries(css_color_names_names); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      if (hex === value) {
        return key;
      }
    }
    return false;
  };
  TinyColor.prototype.toString = function (format) {
    var formatSet = Boolean(format);
    format = format !== null && format !== void 0 ? format : this.format;
    var formattedString = false;
    var hasAlpha = this.a < 1 && this.a >= 0;
    var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
    if (needsAlphaFormat) {
      // Special case for "transparent", all other non-alpha formats
      // will return rgba when there is transparency.
      if (format === 'name' && this.a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === 'rgb') {
      formattedString = this.toRgbString();
    }
    if (format === 'prgb') {
      formattedString = this.toPercentageRgbString();
    }
    if (format === 'hex' || format === 'hex6') {
      formattedString = this.toHexString();
    }
    if (format === 'hex3') {
      formattedString = this.toHexString(true);
    }
    if (format === 'hex4') {
      formattedString = this.toHex8String(true);
    }
    if (format === 'hex8') {
      formattedString = this.toHex8String();
    }
    if (format === 'name') {
      formattedString = this.toName();
    }
    if (format === 'hsl') {
      formattedString = this.toHslString();
    }
    if (format === 'hsv') {
      formattedString = this.toHsvString();
    }
    return formattedString || this.toHexString();
  };
  TinyColor.prototype.toNumber = function () {
    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
  };
  TinyColor.prototype.clone = function () {
    return new TinyColor(this.toString());
  };
  /**
   * Lighten the color a given amount. Providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  TinyColor.prototype.lighten = function (amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.l += amount / 100;
    hsl.l = util_clamp01(hsl.l);
    return new TinyColor(hsl);
  };
  /**
   * Brighten the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  TinyColor.prototype.brighten = function (amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var rgb = this.toRgb();
    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
    return new TinyColor(rgb);
  };
  /**
   * Darken the color a given amount, from 0 to 100.
   * Providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  TinyColor.prototype.darken = function (amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.l -= amount / 100;
    hsl.l = util_clamp01(hsl.l);
    return new TinyColor(hsl);
  };
  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  TinyColor.prototype.tint = function (amount) {
    if (amount === void 0) {
      amount = 10;
    }
    return this.mix('white', amount);
  };
  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  TinyColor.prototype.shade = function (amount) {
    if (amount === void 0) {
      amount = 10;
    }
    return this.mix('black', amount);
  };
  /**
   * Desaturate the color a given amount, from 0 to 100.
   * Providing 100 will is the same as calling greyscale
   * @param amount - valid between 1-100
   */
  TinyColor.prototype.desaturate = function (amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.s -= amount / 100;
    hsl.s = util_clamp01(hsl.s);
    return new TinyColor(hsl);
  };
  /**
   * Saturate the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  TinyColor.prototype.saturate = function (amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.s += amount / 100;
    hsl.s = util_clamp01(hsl.s);
    return new TinyColor(hsl);
  };
  /**
   * Completely desaturates a color into greyscale.
   * Same as calling `desaturate(100)`
   */
  TinyColor.prototype.greyscale = function () {
    return this.desaturate(100);
  };
  /**
   * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
   * Values outside of this range will be wrapped into this range.
   */
  TinyColor.prototype.spin = function (amount) {
    var hsl = this.toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return new TinyColor(hsl);
  };
  /**
   * Mix the current color a given amount with another color, from 0 to 100.
   * 0 means no mixing (return current color).
   */
  TinyColor.prototype.mix = function (color, amount) {
    if (amount === void 0) {
      amount = 50;
    }
    var rgb1 = this.toRgb();
    var rgb2 = new TinyColor(color).toRgb();
    var p = amount / 100;
    var rgba = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b,
      a: (rgb2.a - rgb1.a) * p + rgb1.a
    };
    return new TinyColor(rgba);
  };
  TinyColor.prototype.analogous = function (results, slices) {
    if (results === void 0) {
      results = 6;
    }
    if (slices === void 0) {
      slices = 30;
    }
    var hsl = this.toHsl();
    var part = 360 / slices;
    var ret = [this];
    for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(new TinyColor(hsl));
    }
    return ret;
  };
  /**
   * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
   */
  TinyColor.prototype.complement = function () {
    var hsl = this.toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return new TinyColor(hsl);
  };
  TinyColor.prototype.monochromatic = function (results) {
    if (results === void 0) {
      results = 6;
    }
    var hsv = this.toHsv();
    var h = hsv.h;
    var s = hsv.s;
    var v = hsv.v;
    var res = [];
    var modification = 1 / results;
    while (results--) {
      res.push(new TinyColor({
        h: h,
        s: s,
        v: v
      }));
      v = (v + modification) % 1;
    }
    return res;
  };
  TinyColor.prototype.splitcomplement = function () {
    var hsl = this.toHsl();
    var h = hsl.h;
    return [this, new TinyColor({
      h: (h + 72) % 360,
      s: hsl.s,
      l: hsl.l
    }), new TinyColor({
      h: (h + 216) % 360,
      s: hsl.s,
      l: hsl.l
    })];
  };
  /**
   * Compute how the color would appear on a background
   */
  TinyColor.prototype.onBackground = function (background) {
    var fg = this.toRgb();
    var bg = new TinyColor(background).toRgb();
    var alpha = fg.a + bg.a * (1 - fg.a);
    return new TinyColor({
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
      a: alpha
    });
  };
  /**
   * Alias for `polyad(3)`
   */
  TinyColor.prototype.triad = function () {
    return this.polyad(3);
  };
  /**
   * Alias for `polyad(4)`
   */
  TinyColor.prototype.tetrad = function () {
    return this.polyad(4);
  };
  /**
   * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
   * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
   */
  TinyColor.prototype.polyad = function (n) {
    var hsl = this.toHsl();
    var h = hsl.h;
    var result = [this];
    var increment = 360 / n;
    for (var i = 1; i < n; i++) {
      result.push(new TinyColor({
        h: (h + i * increment) % 360,
        s: hsl.s,
        l: hsl.l
      }));
    }
    return result;
  };
  /**
   * compare color vs current color
   */
  TinyColor.prototype.equals = function (color) {
    return this.toRgbString() === new TinyColor(color).toRgbString();
  };
  return TinyColor;
}();

// kept for backwards compatability with v1
function tinycolor(color, opts) {
  if (color === void 0) {
    color = '';
  }
  if (opts === void 0) {
    opts = {};
  }
  return new TinyColor(color, opts);
}
;// CONCATENATED MODULE: ./node_modules/antd/es/theme/themes/seed.js
const defaultPresetColors = {
  blue: '#1677FF',
  purple: '#722ED1',
  cyan: '#13C2C2',
  green: '#52C41A',
  magenta: '#EB2F96',
  /**
   * @deprecated Use magenta instead
   */
  pink: '#EB2F96',
  red: '#F5222D',
  orange: '#FA8C16',
  yellow: '#FADB14',
  volcano: '#FA541C',
  geekblue: '#2F54EB',
  gold: '#FAAD14',
  lime: '#A0D911'
};
const seedToken = Object.assign(Object.assign({}, defaultPresetColors), {
  // Color
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',
  colorLink: '',
  colorTextBase: '',
  colorBgBase: '',
  // Font
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
'Noto Color Emoji'`,
  fontFamilyCode: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
  fontSize: 14,
  // Line
  lineWidth: 1,
  lineType: 'solid',
  // Motion
  motionUnit: 0.1,
  motionBase: 0,
  motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
  motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
  motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
  motionEaseInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  // Radius
  borderRadius: 6,
  // Size
  sizeUnit: 4,
  sizeStep: 4,
  sizePopupArrow: 16,
  // Control Base
  controlHeight: 32,
  // zIndex
  zIndexBase: 0,
  zIndexPopupBase: 1000,
  // Image
  opacityImage: 1,
  // Wireframe
  wireframe: false,
  // Motion
  motion: true
});
/* harmony default export */ var seed = (seedToken);
;// CONCATENATED MODULE: ./node_modules/antd/es/theme/util/getAlphaColor.js

function isStableColor(color) {
  return color >= 0 && color <= 255;
}
function getAlphaColor(frontColor, backgroundColor) {
  const {
    r: fR,
    g: fG,
    b: fB,
    a: originAlpha
  } = new TinyColor(frontColor).toRgb();
  if (originAlpha < 1) {
    return frontColor;
  }
  const {
    r: bR,
    g: bG,
    b: bB
  } = new TinyColor(backgroundColor).toRgb();
  for (let fA = 0.01; fA <= 1; fA += 0.01) {
    const r = Math.round((fR - bR * (1 - fA)) / fA);
    const g = Math.round((fG - bG * (1 - fA)) / fA);
    const b = Math.round((fB - bB * (1 - fA)) / fA);
    if (isStableColor(r) && isStableColor(g) && isStableColor(b)) {
      return new TinyColor({
        r,
        g,
        b,
        a: Math.round(fA * 100) / 100
      }).toRgbString();
    }
  }
  // fallback
  /* istanbul ignore next */
  return new TinyColor({
    r: fR,
    g: fG,
    b: fB,
    a: 1
  }).toRgbString();
}
/* harmony default export */ var util_getAlphaColor = (getAlphaColor);
;// CONCATENATED MODULE: ./node_modules/antd/es/theme/util/alias.js
var alias_rest = undefined && undefined.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};



/**
 * Seed (designer) > Derivative (designer) > Alias (developer).
 *
 * Merge seed & derivative & override token and generate alias token for developer.
 */
function alias_formatToken(derivativeToken) {
  const {
      override
    } = derivativeToken,
    restToken = alias_rest(derivativeToken, ["override"]);
  const overrideTokens = Object.assign({}, override);
  Object.keys(seed).forEach(token => {
    delete overrideTokens[token];
  });
  const mergedToken = Object.assign(Object.assign({}, restToken), overrideTokens);
  const screenXS = 480;
  const screenSM = 576;
  const screenMD = 768;
  const screenLG = 992;
  const screenXL = 1200;
  const screenXXL = 1600;
  // Motion
  if (mergedToken.motion === false) {
    const fastDuration = '0s';
    mergedToken.motionDurationFast = fastDuration;
    mergedToken.motionDurationMid = fastDuration;
    mergedToken.motionDurationSlow = fastDuration;
  }
  // Generate alias token
  const aliasToken = Object.assign(Object.assign(Object.assign({}, mergedToken), {
    // ============== Background ============== //
    colorFillContent: mergedToken.colorFillSecondary,
    colorFillContentHover: mergedToken.colorFill,
    colorFillAlter: mergedToken.colorFillQuaternary,
    colorBgContainerDisabled: mergedToken.colorFillTertiary,
    // ============== Split ============== //
    colorBorderBg: mergedToken.colorBgContainer,
    colorSplit: util_getAlphaColor(mergedToken.colorBorderSecondary, mergedToken.colorBgContainer),
    // ============== Text ============== //
    colorTextPlaceholder: mergedToken.colorTextQuaternary,
    colorTextDisabled: mergedToken.colorTextQuaternary,
    colorTextHeading: mergedToken.colorText,
    colorTextLabel: mergedToken.colorTextSecondary,
    colorTextDescription: mergedToken.colorTextTertiary,
    colorTextLightSolid: mergedToken.colorWhite,
    colorHighlight: mergedToken.colorError,
    colorBgTextHover: mergedToken.colorFillSecondary,
    colorBgTextActive: mergedToken.colorFill,
    colorIcon: mergedToken.colorTextTertiary,
    colorIconHover: mergedToken.colorText,
    colorErrorOutline: util_getAlphaColor(mergedToken.colorErrorBg, mergedToken.colorBgContainer),
    colorWarningOutline: util_getAlphaColor(mergedToken.colorWarningBg, mergedToken.colorBgContainer),
    // Font
    fontSizeIcon: mergedToken.fontSizeSM,
    // Line
    lineWidthFocus: mergedToken.lineWidth * 3,
    // Control
    lineWidth: mergedToken.lineWidth,
    controlOutlineWidth: mergedToken.lineWidth * 2,
    // Checkbox size and expand icon size
    controlInteractiveSize: mergedToken.controlHeight / 2,
    controlItemBgHover: mergedToken.colorFillTertiary,
    controlItemBgActive: mergedToken.colorPrimaryBg,
    controlItemBgActiveHover: mergedToken.colorPrimaryBgHover,
    controlItemBgActiveDisabled: mergedToken.colorFill,
    controlTmpOutline: mergedToken.colorFillQuaternary,
    controlOutline: util_getAlphaColor(mergedToken.colorPrimaryBg, mergedToken.colorBgContainer),
    lineType: mergedToken.lineType,
    borderRadius: mergedToken.borderRadius,
    borderRadiusXS: mergedToken.borderRadiusXS,
    borderRadiusSM: mergedToken.borderRadiusSM,
    borderRadiusLG: mergedToken.borderRadiusLG,
    fontWeightStrong: 600,
    opacityLoading: 0.65,
    linkDecoration: 'none',
    linkHoverDecoration: 'none',
    linkFocusDecoration: 'none',
    controlPaddingHorizontal: 12,
    controlPaddingHorizontalSM: 8,
    paddingXXS: mergedToken.sizeXXS,
    paddingXS: mergedToken.sizeXS,
    paddingSM: mergedToken.sizeSM,
    padding: mergedToken.size,
    paddingMD: mergedToken.sizeMD,
    paddingLG: mergedToken.sizeLG,
    paddingXL: mergedToken.sizeXL,
    paddingContentHorizontalLG: mergedToken.sizeLG,
    paddingContentVerticalLG: mergedToken.sizeMS,
    paddingContentHorizontal: mergedToken.sizeMS,
    paddingContentVertical: mergedToken.sizeSM,
    paddingContentHorizontalSM: mergedToken.size,
    paddingContentVerticalSM: mergedToken.sizeXS,
    marginXXS: mergedToken.sizeXXS,
    marginXS: mergedToken.sizeXS,
    marginSM: mergedToken.sizeSM,
    margin: mergedToken.size,
    marginMD: mergedToken.sizeMD,
    marginLG: mergedToken.sizeLG,
    marginXL: mergedToken.sizeXL,
    marginXXL: mergedToken.sizeXXL,
    boxShadow: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowSecondary: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowTertiary: `
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)
    `,
    screenXS,
    screenXSMin: screenXS,
    screenXSMax: screenSM - 1,
    screenSM,
    screenSMMin: screenSM,
    screenSMMax: screenMD - 1,
    screenMD,
    screenMDMin: screenMD,
    screenMDMax: screenLG - 1,
    screenLG,
    screenLGMin: screenLG,
    screenLGMax: screenXL - 1,
    screenXL,
    screenXLMin: screenXL,
    screenXLMax: screenXXL - 1,
    screenXXL,
    screenXXLMin: screenXXL,
    boxShadowPopoverArrow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
    boxShadowCard: `
      0 1px 2px -2px ${new TinyColor('rgba(0, 0, 0, 0.16)').toRgbString()},
      0 3px 6px 0 ${new TinyColor('rgba(0, 0, 0, 0.12)').toRgbString()},
      0 5px 12px 4px ${new TinyColor('rgba(0, 0, 0, 0.09)').toRgbString()}
    `,
    boxShadowDrawerRight: `
      -6px 0 16px 0 rgba(0, 0, 0, 0.08),
      -3px 0 6px -4px rgba(0, 0, 0, 0.12),
      -9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowDrawerLeft: `
      6px 0 16px 0 rgba(0, 0, 0, 0.08),
      3px 0 6px -4px rgba(0, 0, 0, 0.12),
      9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowDrawerUp: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowDrawerDown: `
      0 -6px 16px 0 rgba(0, 0, 0, 0.08),
      0 -3px 6px -4px rgba(0, 0, 0, 0.12),
      0 -9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
    boxShadowTabsOverflowLeft: 'inset 10px 0 8px -8px rgba(0, 0, 0, 0.08)',
    boxShadowTabsOverflowRight: 'inset -10px 0 8px -8px rgba(0, 0, 0, 0.08)',
    boxShadowTabsOverflowTop: 'inset 0 10px 8px -8px rgba(0, 0, 0, 0.08)',
    boxShadowTabsOverflowBottom: 'inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08)'
  }), overrideTokens);
  return aliasToken;
}
;// CONCATENATED MODULE: ./components/theme/useToken.ts






const useToken_defaultTheme = (0,external_antdCssinjs_.createTheme)(external_antd_.theme.defaultAlgorithm);
const useToken_preserve = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true
};
const useToken_getComputedToken = (originToken, overrideToken, theme) => {
  const derivativeToken = theme.getDerivativeToken(originToken);
  const {
    override,
    ...components
  } = overrideToken;

  // Merge with override
  let mergedDerivativeToken = {
    ...derivativeToken,
    override
  };

  // Format if needed
  mergedDerivativeToken = alias_formatToken(mergedDerivativeToken);
  if (components) {
    Object.entries(components).forEach(([key, value]) => {
      const {
        theme: componentTheme,
        ...componentTokens
      } = value;
      let mergedComponentToken = componentTokens;
      if (componentTheme) {
        mergedComponentToken = useToken_getComputedToken({
          ...mergedDerivativeToken,
          ...componentTokens
        }, {
          override: componentTokens
        }, componentTheme);
      }
      mergedDerivativeToken[key] = mergedComponentToken;
    });
  }
  return mergedDerivativeToken;
};
function useInternalToken() {
  const {
    token: rootDesignToken,
    hashed,
    theme = useToken_defaultTheme,
    override,
    cssVar
  } = external_React_default().useContext(external_antd_.theme._internalContext);
  const [token, hashId, realToken] = (0,external_antdCssinjs_.useCacheToken)(theme, [external_antd_.theme.defaultSeed, rootDesignToken], {
    salt: `${components_version}-${hashed || ''}`,
    override,
    getComputedToken: useToken_getComputedToken,
    cssVar: cssVar && {
      prefix: cssVar.prefix,
      key: cssVar.key,
      unitless: unitless,
      ignore: ignore,
      preserve: useToken_preserve
    }
  });
  return [theme, realToken, hashed ? hashId : '', token, cssVar];
}
function useToken_useToken() {
  const [theme, token, hashId] = useInternalToken();
  return {
    theme,
    token,
    hashId
  };
}
;// CONCATENATED MODULE: ./components/theme/genStyleUtils.ts



const {
  genStyleHooks,
  genComponentStyleHook,
  genSubStyleComponent
} = util_genStyleUtils({
  usePrefix: () => {
    const {
      getPrefixCls,
      iconPrefixCls
    } = use_x_provider_context();
    return {
      iconPrefixCls,
      rootPrefixCls: getPrefixCls()
    };
  },
  useToken: () => {
    const [theme, realToken, hashId, token, cssVar] = useInternalToken();
    return {
      theme,
      realToken,
      hashId,
      token,
      cssVar
    };
  },
  useCSP: () => {
    const {
      csp
    } = use_x_provider_context();
    return csp ?? {};
  },
  layer: {
    name: 'antdx',
    dependencies: ['antd']
  }
});
;// CONCATENATED MODULE: ./components/attachments/style/fileCard.ts
const genFileCardStyle = token => {
  const {
    componentCls,
    calc
  } = token;
  const cardCls = `${componentCls}-list-card`;
  const cardHeight = calc(token.fontSize).mul(token.lineHeight).mul(2).add(token.paddingSM).add(token.paddingSM).equal();
  return {
    [cardCls]: {
      borderRadius: token.borderRadius,
      position: 'relative',
      background: token.colorFillContent,
      borderWidth: token.lineWidth,
      borderStyle: 'solid',
      borderColor: 'transparent',
      flex: 'none',
      // =============================== Desc ================================
      [`${cardCls}-name,${cardCls}-desc`]: {
        display: 'flex',
        flexWrap: 'nowrap',
        maxWidth: '100%'
      },
      [`${cardCls}-ellipsis-prefix`]: {
        flex: '0 1 auto',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      [`${cardCls}-ellipsis-suffix`]: {
        flex: 'none'
      },
      // ============================= Overview ==============================
      '&-type-overview': {
        padding: calc(token.paddingSM).sub(token.lineWidth).equal(),
        paddingInlineStart: calc(token.padding).add(token.lineWidth).equal(),
        display: 'flex',
        flexWrap: 'nowrap',
        gap: token.paddingXS,
        alignItems: 'flex-start',
        width: 236,
        // Icon
        [`${cardCls}-icon`]: {
          fontSize: calc(token.fontSizeLG).mul(2).equal(),
          lineHeight: 1,
          paddingTop: calc(token.paddingXXS).mul(1.5).equal(),
          flex: 'none'
        },
        // Content
        [`${cardCls}-content`]: {
          flex: 'auto',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        },
        [`${cardCls}-desc`]: {
          color: token.colorTextTertiary
        }
      },
      // ============================== Preview ==============================
      '&-type-preview': {
        width: cardHeight,
        height: cardHeight,
        lineHeight: 1,
        [`&:not(${cardCls}-status-error)`]: {
          border: 0
        },
        // Img
        img: {
          width: '100%',
          height: '100%',
          verticalAlign: 'top',
          objectFit: 'cover',
          borderRadius: 'inherit'
        },
        // Mask
        [`${cardCls}-img-mask`]: {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: `rgba(0, 0, 0, ${token.opacityLoading})`,
          borderRadius: 'inherit'
        },
        // Error
        [`&${cardCls}-status-error`]: {
          [`img, ${cardCls}-img-mask`]: {
            borderRadius: calc(token.borderRadius).sub(token.lineWidth).equal()
          },
          [`${cardCls}-desc`]: {
            paddingInline: token.paddingXXS
          }
        },
        // Progress
        [`${cardCls}-progress`]: {}
      },
      // ============================ Remove Icon ============================
      [`${cardCls}-remove`]: {
        position: 'absolute',
        top: 0,
        insetInlineEnd: 0,
        border: 0,
        padding: token.paddingXXS,
        background: 'transparent',
        lineHeight: 1,
        transform: 'translate(50%, -50%)',
        fontSize: token.fontSize,
        cursor: 'pointer',
        opacity: token.opacityLoading,
        display: 'none',
        '&:dir(rtl)': {
          transform: 'translate(-50%, -50%)'
        },
        '&:hover': {
          opacity: 1
        },
        '&:active': {
          opacity: token.opacityLoading
        }
      },
      [`&:hover ${cardCls}-remove`]: {
        display: 'block'
      },
      // ============================== Status ===============================
      '&-status-error': {
        borderColor: token.colorError,
        [`${cardCls}-desc`]: {
          color: token.colorError
        }
      },
      // ============================== Motion ===============================
      '&-motion': {
        overflow: 'hidden',
        transition: ['opacity', 'width', 'margin', 'padding'].map(prop => `${prop} ${token.motionDurationSlow}`).join(','),
        [`${cardCls}-remove`]: {
          display: 'none !important'
        },
        '&-appear-start': {
          width: 0,
          transition: 'none'
        },
        '&-leave-active': {
          opacity: 0,
          width: 0,
          paddingInline: 0,
          borderInlineWidth: 0,
          marginInlineEnd: calc(token.paddingSM).mul(-1).equal()
        }
      }
    }
  };
};
/* harmony default export */ var fileCard = (genFileCardStyle);
;// CONCATENATED MODULE: ./components/attachments/style/index.ts





// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const anyBoxSizing = {
  '&, *': {
    boxSizing: 'border-box'
  }
};
const genAttachmentsStyle = token => {
  const {
    componentCls,
    calc,
    antCls
  } = token;
  const dropAreaCls = `${componentCls}-drop-area`;
  const placeholderCls = `${componentCls}-placeholder`;
  return {
    // ============================== Full Screen ==============================
    [dropAreaCls]: {
      position: 'absolute',
      inset: 0,
      zIndex: token.zIndexPopupBase,
      ...anyBoxSizing,
      '&-on-body': {
        position: 'fixed',
        inset: 0
      },
      '&-hide-placement': {
        [`${placeholderCls}-inner`]: {
          display: 'none'
        }
      },
      [placeholderCls]: {
        padding: 0
      }
    },
    '&': {
      // ============================= Placeholder =============================
      [placeholderCls]: {
        height: '100%',
        borderRadius: token.borderRadius,
        borderWidth: token.lineWidthBold,
        borderStyle: 'dashed',
        borderColor: 'transparent',
        padding: token.padding,
        position: 'relative',
        backdropFilter: 'blur(10px)',
        background: token.colorBgPlaceholderHover,
        ...anyBoxSizing,
        [`${antCls}-upload-wrapper ${antCls}-upload${antCls}-upload-btn`]: {
          padding: 0
        },
        [`&${placeholderCls}-drag-in`]: {
          borderColor: token.colorPrimaryHover
        },
        [`&${placeholderCls}-disabled`]: {
          opacity: 0.25,
          pointerEvents: 'none'
        },
        [`${placeholderCls}-inner`]: {
          gap: calc(token.paddingXXS).div(2).equal()
        },
        [`${placeholderCls}-icon`]: {
          fontSize: token.fontSizeHeading2,
          lineHeight: 1
        },
        [`${placeholderCls}-title${placeholderCls}-title`]: {
          margin: 0,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight
        },
        [`${placeholderCls}-description`]: {}
      }
    }
  };
};
const genFileListStyle = token => {
  const {
    componentCls,
    calc
  } = token;
  const fileListCls = `${componentCls}-list`;
  const cardHeight = calc(token.fontSize).mul(token.lineHeight).mul(2).add(token.paddingSM).add(token.paddingSM).equal();
  return {
    [componentCls]: {
      position: 'relative',
      width: '100%',
      ...anyBoxSizing,
      // =============================== File List ===============================
      [fileListCls]: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: token.paddingSM,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        color: token.colorText,
        paddingBlock: token.paddingSM,
        paddingInline: token.padding,
        width: '100%',
        background: token.colorBgContainer,
        // Hide scrollbar
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        // Scroll
        '&-overflow-scrollX, &-overflow-scrollY': {
          '&:before, &:after': {
            content: '""',
            position: 'absolute',
            opacity: 0,
            transition: `opacity ${token.motionDurationSlow}`,
            zIndex: 1
          }
        },
        '&-overflow-ping-start:before': {
          opacity: 1
        },
        '&-overflow-ping-end:after': {
          opacity: 1
        },
        '&-overflow-scrollX': {
          overflowX: 'auto',
          overflowY: 'hidden',
          flexWrap: 'nowrap',
          '&:before, &:after': {
            insetBlock: 0,
            width: 8
          },
          '&:before': {
            insetInlineStart: 0,
            background: `linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0));`
          },
          '&:after': {
            insetInlineEnd: 0,
            background: `linear-gradient(to left, rgba(0,0,0,0.06), rgba(0,0,0,0));`
          },
          '&:dir(rtl)': {
            '&:before': {
              background: `linear-gradient(to left, rgba(0,0,0,0.06), rgba(0,0,0,0));`
            },
            '&:after': {
              background: `linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0));`
            }
          }
        },
        '&-overflow-scrollY': {
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: calc(cardHeight).mul(3).equal(),
          '&:before, &:after': {
            insetInline: 0,
            height: 8
          },
          '&:before': {
            insetBlockStart: 0,
            background: `linear-gradient(to bottom, rgba(0,0,0,0.06), rgba(0,0,0,0));`
          },
          '&:after': {
            insetBlockEnd: 0,
            background: `linear-gradient(to top, rgba(0,0,0,0.06), rgba(0,0,0,0));`
          }
        },
        // ======================================================================
        // ==                              Upload                              ==
        // ======================================================================
        '&-upload-btn': {
          width: cardHeight,
          height: cardHeight,
          fontSize: token.fontSizeHeading2,
          color: '#999'
        },
        // ======================================================================
        // ==                             PrevNext                             ==
        // ======================================================================
        '&-prev-btn, &-next-btn': {
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: token.boxShadowTertiary,
          opacity: 0,
          pointerEvents: 'none'
        },
        '&-prev-btn': {
          left: {
            _skip_check_: true,
            value: token.padding
          }
        },
        '&-next-btn': {
          right: {
            _skip_check_: true,
            value: token.padding
          }
        },
        '&:dir(ltr)': {
          [`&${fileListCls}-overflow-ping-start ${fileListCls}-prev-btn`]: {
            opacity: 1,
            pointerEvents: 'auto'
          },
          [`&${fileListCls}-overflow-ping-end ${fileListCls}-next-btn`]: {
            opacity: 1,
            pointerEvents: 'auto'
          }
        },
        '&:dir(rtl)': {
          [`&${fileListCls}-overflow-ping-end ${fileListCls}-prev-btn`]: {
            opacity: 1,
            pointerEvents: 'auto'
          },
          [`&${fileListCls}-overflow-ping-start ${fileListCls}-next-btn`]: {
            opacity: 1,
            pointerEvents: 'auto'
          }
        }
      }
    }
  };
};
const prepareComponentToken = token => {
  const {
    colorBgContainer
  } = token;
  const colorBgPlaceholderHover = new FastColor(colorBgContainer).setA(0.85);
  return {
    colorBgPlaceholderHover: colorBgPlaceholderHover.toRgbString()
  };
};
/* harmony default export */ var attachments_style = (genStyleHooks('Attachments', token => {
  const compToken = statistic_merge(token, {});
  return [genAttachmentsStyle(compToken), genFileListStyle(compToken), fileCard(compToken)];
}, prepareComponentToken));
;// CONCATENATED MODULE: ./components/attachments/util.ts
// Follow code is copy from `antd/components/upload/utils.ts`:

const isImageFileType = type => type.indexOf('image/') === 0;
const MEASURE_SIZE = 200;
function previewImage(file) {
  return new Promise(resolve => {
    if (!file || !file.type || !isImageFileType(file.type)) {
      resolve('');
      return;
    }
    const img = new Image();
    img.onload = () => {
      const {
        width,
        height
      } = img;
      const ratio = width / height;
      const MEASURE_SIZE_WIDTH = ratio > 1 ? MEASURE_SIZE : MEASURE_SIZE * ratio;
      const MEASURE_SIZE_HEIGHT = ratio > 1 ? MEASURE_SIZE / ratio : MEASURE_SIZE;
      const canvas = document.createElement('canvas');
      canvas.width = MEASURE_SIZE_WIDTH;
      canvas.height = MEASURE_SIZE_HEIGHT;
      canvas.style.cssText = `position: fixed; left: 0; top: 0; width: ${MEASURE_SIZE_WIDTH}px; height: ${MEASURE_SIZE_HEIGHT}px; z-index: 9999; display: none;`;
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, MEASURE_SIZE_WIDTH, MEASURE_SIZE_HEIGHT);
      const dataURL = canvas.toDataURL();
      document.body.removeChild(canvas);
      window.URL.revokeObjectURL(img.src);
      resolve(dataURL);
    };
    img.crossOrigin = 'anonymous';
    if (file.type.startsWith('image/svg+xml')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('image/gif')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      img.src = window.URL.createObjectURL(file);
    }
  });
}
;// CONCATENATED MODULE: ./components/attachments/FileList/AudioIcon.tsx

function AudioIcon() {
  return /*#__PURE__*/external_React_default().createElement("svg", {
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink"
  }, /*#__PURE__*/external_React_default().createElement("title", null, "audio"), /*#__PURE__*/external_React_default().createElement("g", {
    stroke: "none",
    "stroke-width": "1",
    fill: "none",
    "fill-rule": "evenodd"
  }, /*#__PURE__*/external_React_default().createElement("path", {
    d: "M14.1178571,4.0125 C14.225,4.11964286 14.2857143,4.26428571 14.2857143,4.41607143 L14.2857143,15.4285714 C14.2857143,15.7446429 14.0303571,16 13.7142857,16 L2.28571429,16 C1.96964286,16 1.71428571,15.7446429 1.71428571,15.4285714 L1.71428571,0.571428571 C1.71428571,0.255357143 1.96964286,0 2.28571429,0 L9.86964286,0 C10.0214286,0 10.1678571,0.0607142857 10.275,0.167857143 L14.1178571,4.0125 Z M10.7315824,7.11216117 C10.7428131,7.15148751 10.7485063,7.19218979 10.7485063,7.23309113 L10.7485063,8.07742614 C10.7484199,8.27364959 10.6183424,8.44607275 10.4296853,8.50003683 L8.32984514,9.09986306 L8.32984514,11.7071803 C8.32986605,12.5367078 7.67249692,13.217028 6.84345686,13.2454634 L6.79068592,13.2463395 C6.12766108,13.2463395 5.53916361,12.8217001 5.33010655,12.1924966 C5.1210495,11.563293 5.33842118,10.8709227 5.86959669,10.4741173 C6.40077221,10.0773119 7.12636292,10.0652587 7.67042486,10.4442027 L7.67020842,7.74937024 L7.68449368,7.74937024 C7.72405122,7.59919041 7.83988806,7.48101083 7.98924584,7.4384546 L10.1880418,6.81004755 C10.42156,6.74340323 10.6648954,6.87865515 10.7315824,7.11216117 Z M9.60714286,1.31785714 L12.9678571,4.67857143 L9.60714286,4.67857143 L9.60714286,1.31785714 Z",
    fill: "currentColor"
  })));
}
;// CONCATENATED MODULE: ./components/attachments/FileList/Progress.tsx


function Progress(props) {
  const {
    percent
  } = props;
  const {
    token
  } = external_antd_.theme.useToken();
  return /*#__PURE__*/external_React_default().createElement(external_antd_.Progress, {
    type: "circle",
    percent: percent,
    size: token.fontSizeHeading2 * 2,
    strokeColor: "#FFF",
    trailColor: "rgba(255, 255, 255, 0.3)",
    format: ptg => /*#__PURE__*/external_React_default().createElement("span", {
      style: {
        color: '#FFF'
      }
    }, (ptg || 0).toFixed(0), "%")
  });
}
;// CONCATENATED MODULE: ./components/attachments/FileList/VideoIcon.tsx

function VideoIcon() {
  return /*#__PURE__*/external_React_default().createElement("svg", {
    width: "1em",
    height: "1em",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink"
  }, /*#__PURE__*/external_React_default().createElement("title", null, "video"), /*#__PURE__*/external_React_default().createElement("g", {
    stroke: "none",
    "stroke-width": "1",
    fill: "none",
    "fill-rule": "evenodd"
  }, /*#__PURE__*/external_React_default().createElement("path", {
    d: "M14.1178571,4.0125 C14.225,4.11964286 14.2857143,4.26428571 14.2857143,4.41607143 L14.2857143,15.4285714 C14.2857143,15.7446429 14.0303571,16 13.7142857,16 L2.28571429,16 C1.96964286,16 1.71428571,15.7446429 1.71428571,15.4285714 L1.71428571,0.571428571 C1.71428571,0.255357143 1.96964286,0 2.28571429,0 L9.86964286,0 C10.0214286,0 10.1678571,0.0607142857 10.275,0.167857143 L14.1178571,4.0125 Z M12.9678571,4.67857143 L9.60714286,1.31785714 L9.60714286,4.67857143 L12.9678571,4.67857143 Z M10.5379461,10.3101106 L6.68957555,13.0059749 C6.59910784,13.0693494 6.47439406,13.0473861 6.41101953,12.9569184 C6.3874624,12.9232903 6.37482581,12.8832269 6.37482581,12.8421686 L6.37482581,7.45043999 C6.37482581,7.33998304 6.46436886,7.25043999 6.57482581,7.25043999 C6.61588409,7.25043999 6.65594753,7.26307658 6.68957555,7.28663371 L10.5379461,9.98249803 C10.6284138,10.0458726 10.6503772,10.1705863 10.5870027,10.2610541 C10.5736331,10.2801392 10.5570312,10.2967411 10.5379461,10.3101106 Z",
    fill: "currentColor"
  })));
}
;// CONCATENATED MODULE: ./components/attachments/FileList/FileListCard.tsx










const EMPTY = '\u00A0';
const DEFAULT_ICON_COLOR = '#8c8c8c';
const IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];
const PRESET_FILE_ICONS = [{
  icon: /*#__PURE__*/external_React_default().createElement(icons_FileExcelFilled, null),
  color: '#22b35e',
  ext: ['xlsx', 'xls']
}, {
  icon: /*#__PURE__*/external_React_default().createElement(icons_FileImageFilled, null),
  color: DEFAULT_ICON_COLOR,
  ext: IMG_EXTS
}, {
  icon: /*#__PURE__*/external_React_default().createElement(icons_FileMarkdownFilled, null),
  color: DEFAULT_ICON_COLOR,
  ext: ['md', 'mdx']
}, {
  icon: /*#__PURE__*/external_React_default().createElement(icons_FilePdfFilled, null),
  color: '#ff4d4f',
  ext: ['pdf']
}, {
  icon: /*#__PURE__*/external_React_default().createElement(icons_FilePptFilled, null),
  color: '#ff6e31',
  ext: ['ppt', 'pptx']
}, {
  icon: /*#__PURE__*/external_React_default().createElement(icons_FileWordFilled, null),
  color: '#1677ff',
  ext: ['doc', 'docx']
}, {
  icon: /*#__PURE__*/external_React_default().createElement(icons_FileZipFilled, null),
  color: '#fab714',
  ext: ['zip', 'rar', '7z', 'tar', 'gz']
}, {
  icon: /*#__PURE__*/external_React_default().createElement(VideoIcon, null),
  color: '#ff4d4f',
  ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv']
}, {
  icon: /*#__PURE__*/external_React_default().createElement(AudioIcon, null),
  color: '#8c8c8c',
  ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg']
}];
function matchExt(suffix, ext) {
  return ext.some(e => suffix.toLowerCase() === `.${e}`);
}
function getSize(size) {
  let retSize = size;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let unitIndex = 0;
  while (retSize >= 1024 && unitIndex < units.length - 1) {
    retSize /= 1024;
    unitIndex++;
  }
  return `${retSize.toFixed(0)} ${units[unitIndex]}`;
}
function FileListCard(props, ref) {
  const {
    prefixCls: customizePrefixCls,
    item,
    onRemove,
    className,
    style
  } = props;
  const context = external_React_default().useContext(AttachmentContext);
  const {
    disabled
  } = context || {};
  const {
    name,
    size,
    percent,
    status = 'done',
    description
  } = item;

  // ============================= Prefix =============================
  const {
    getPrefixCls
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('attachment', customizePrefixCls);
  const cardCls = `${prefixCls}-list-card`;

  // ============================= Style ==============================
  const [wrapCSSVar, hashId, cssVarCls] = attachments_style(prefixCls);

  // ============================== Name ==============================
  const [namePrefix, nameSuffix] = external_React_default().useMemo(() => {
    const nameStr = name || '';
    const match = nameStr.match(/^(.*)\.[^.]+$/);
    return match ? [match[1], nameStr.slice(match[1].length)] : [nameStr, ''];
  }, [name]);
  const isImg = external_React_default().useMemo(() => matchExt(nameSuffix, IMG_EXTS), [nameSuffix]);

  // ============================== Desc ==============================
  const desc = external_React_default().useMemo(() => {
    if (description) {
      return description;
    }
    if (status === 'uploading') {
      return `${percent || 0}%`;
    }
    if (status === 'error') {
      return item.response || EMPTY;
    }
    return size ? getSize(size) : EMPTY;
  }, [status, percent]);

  // ============================== Icon ==============================
  const [icon, iconColor] = external_React_default().useMemo(() => {
    for (const {
      ext,
      icon,
      color
    } of PRESET_FILE_ICONS) {
      if (matchExt(nameSuffix, ext)) {
        return [icon, color];
      }
    }
    return [/*#__PURE__*/external_React_default().createElement(icons_FileTextFilled, {
      key: "defaultIcon"
    }), DEFAULT_ICON_COLOR];
  }, [nameSuffix]);

  // ========================== ImagePreview ==========================
  const [previewImg, setPreviewImg] = external_React_default().useState();
  external_React_default().useEffect(() => {
    if (item.originFileObj) {
      let synced = true;
      previewImage(item.originFileObj).then(url => {
        if (synced) {
          setPreviewImg(url);
        }
      });
      return () => {
        synced = false;
      };
    }
    setPreviewImg(undefined);
  }, [item.originFileObj]);

  // ============================= Render =============================
  let content = null;
  const previewUrl = item.thumbUrl || item.url || previewImg;
  const isImgPreview = isImg && (item.originFileObj || previewUrl);
  if (isImgPreview) {
    // Preview Image style
    content = /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement("img", {
      alt: "preview",
      src: previewUrl
    }), status !== 'done' && /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-img-mask`
    }, status === 'uploading' && percent !== undefined && /*#__PURE__*/external_React_default().createElement(Progress, {
      percent: percent,
      prefixCls: cardCls
    }), status === 'error' && /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-desc`
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-ellipsis-prefix`
    }, desc))));
  } else {
    // Preview Card style
    content = /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-icon`,
      style: {
        color: iconColor
      }
    }, icon), /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-content`
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-name`
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-ellipsis-prefix`
    }, namePrefix ?? EMPTY), /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-ellipsis-suffix`
    }, nameSuffix)), /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-desc`
    }, /*#__PURE__*/external_React_default().createElement("div", {
      className: `${cardCls}-ellipsis-prefix`
    }, desc))));
  }
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(cardCls, {
      [`${cardCls}-status-${status}`]: status,
      [`${cardCls}-type-preview`]: isImgPreview,
      [`${cardCls}-type-overview`]: !isImgPreview
    }, className, hashId, cssVarCls),
    style: style,
    ref: ref
  }, content, !disabled && onRemove && /*#__PURE__*/external_React_default().createElement("button", {
    type: "button",
    className: `${cardCls}-remove`,
    onClick: () => {
      onRemove(item);
    }
  }, /*#__PURE__*/external_React_default().createElement(icons_CloseCircleFilled, null))));
}
/* harmony default export */ var FileList_FileListCard = (/*#__PURE__*/external_React_default().forwardRef(FileListCard));
;// CONCATENATED MODULE: ./components/attachments/FileList/index.tsx








function FileList(props) {
  const {
    prefixCls,
    items,
    onRemove,
    overflow,
    upload,
    listClassName,
    listStyle,
    itemClassName,
    itemStyle
  } = props;
  const listCls = `${prefixCls}-list`;
  const containerRef = external_React_default().useRef(null);
  const [firstMount, setFirstMount] = external_React_default().useState(false);
  const {
    disabled
  } = external_React_default().useContext(AttachmentContext);
  external_React_default().useEffect(() => {
    setFirstMount(true);
    return () => {
      setFirstMount(false);
    };
  }, []);

  // ================================= Scroll =================================
  const [pingStart, setPingStart] = external_React_default().useState(false);
  const [pingEnd, setPingEnd] = external_React_default().useState(false);
  const checkPing = () => {
    const containerEle = containerRef.current;
    if (!containerEle) {
      return;
    }
    if (overflow === 'scrollX') {
      setPingStart(containerEle.scrollLeft !== 0);
      setPingEnd(containerEle.scrollWidth - containerEle.clientWidth !== Math.abs(containerEle.scrollLeft));
    } else if (overflow === 'scrollY') {
      setPingStart(containerEle.scrollTop !== 0);
      setPingEnd(containerEle.scrollHeight - containerEle.clientHeight !== containerEle.scrollTop);
    }
  };
  external_React_default().useEffect(() => {
    checkPing();
  }, [overflow]);
  const onScrollOffset = offset => {
    const containerEle = containerRef.current;
    if (containerEle) {
      containerEle.scrollTo({
        left: containerEle.scrollLeft + offset * containerEle.clientWidth,
        behavior: 'smooth'
      });
    }
  };
  const onScrollLeft = () => {
    onScrollOffset(-1);
  };
  const onScrollRight = () => {
    onScrollOffset(1);
  };

  // ================================= Render =================================
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(listCls, {
      [`${listCls}-overflow-${props.overflow}`]: overflow,
      [`${listCls}-overflow-ping-start`]: pingStart,
      [`${listCls}-overflow-ping-end`]: pingEnd
    }, listClassName),
    ref: containerRef,
    onScroll: checkPing,
    style: listStyle
  }, /*#__PURE__*/external_React_default().createElement(CSSMotionList, {
    keys: items.map(item => ({
      key: item.uid,
      item
    })),
    motionName: `${listCls}-card-motion`,
    component: false,
    motionAppear: firstMount,
    motionLeave: true,
    motionEnter: true
  }, ({
    key,
    item,
    className: motionCls,
    style: motionStyle
  }) => {
    return /*#__PURE__*/external_React_default().createElement(FileList_FileListCard, {
      key: key,
      prefixCls: prefixCls,
      item: item,
      onRemove: onRemove,
      className: classnames_default()(motionCls, itemClassName),
      style: {
        ...motionStyle,
        ...itemStyle
      }
    });
  }), !disabled && /*#__PURE__*/external_React_default().createElement(attachments_SilentUploader, {
    upload: upload
  }, /*#__PURE__*/external_React_default().createElement(external_antd_.Button, {
    className: `${listCls}-upload-btn`,
    type: "dashed"
  }, /*#__PURE__*/external_React_default().createElement(icons_PlusOutlined, {
    className: `${listCls}-upload-btn-icon`
  }))), overflow === 'scrollX' && /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement(external_antd_.Button, {
    size: "small",
    shape: "circle",
    className: `${listCls}-prev-btn`,
    icon: /*#__PURE__*/external_React_default().createElement(icons_LeftOutlined, null),
    onClick: onScrollLeft
  }), /*#__PURE__*/external_React_default().createElement(external_antd_.Button, {
    size: "small",
    shape: "circle",
    className: `${listCls}-next-btn`,
    icon: /*#__PURE__*/external_React_default().createElement(icons_RightOutlined, null),
    onClick: onScrollRight
  })));
}
;// CONCATENATED MODULE: ./components/attachments/PlaceholderUploader.tsx





function Placeholder(props, ref) {
  const {
    prefixCls,
    placeholder = {},
    upload,
    className,
    style
  } = props;
  const placeholderCls = `${prefixCls}-placeholder`;
  const placeholderConfig = placeholder || {};
  const {
    disabled
  } = external_React_default().useContext(AttachmentContext);

  // ============================= Drag =============================
  const [dragIn, setDragIn] = external_React_default().useState(false);
  const onDragEnter = () => {
    setDragIn(true);
  };
  const onDragLeave = e => {
    // Leave the div should end
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragIn(false);
    }
  };
  const onDrop = () => {
    setDragIn(false);
  };

  // ============================ Render ============================
  const node = /*#__PURE__*/external_React_default().isValidElement(placeholder) ? placeholder : /*#__PURE__*/external_React_default().createElement(external_antd_.Flex, {
    align: "center",
    justify: "center",
    vertical: true,
    className: `${placeholderCls}-inner`
  }, /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Text, {
    className: `${placeholderCls}-icon`
  }, placeholderConfig.icon), /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Title, {
    className: `${placeholderCls}-title`,
    level: 5
  }, placeholderConfig.title), /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Text, {
    className: `${placeholderCls}-description`,
    type: "secondary"
  }, placeholderConfig.description));
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(placeholderCls, {
      [`${placeholderCls}-drag-in`]: dragIn,
      [`${placeholderCls}-disabled`]: disabled
    }, className),
    onDragEnter: onDragEnter,
    onDragLeave: onDragLeave,
    onDrop: onDrop,
    "aria-hidden": disabled,
    style: style
  }, /*#__PURE__*/external_React_default().createElement(external_antd_.Upload.Dragger, extends_default()({
    showUploadList: false
  }, upload, {
    ref: ref,
    style: {
      padding: 0,
      border: 0,
      background: 'transparent'
    }
  }), node));
}
/* harmony default export */ var PlaceholderUploader = (/*#__PURE__*/external_React_default().forwardRef(Placeholder));
;// CONCATENATED MODULE: ./components/attachments/index.tsx












function Attachments(props, ref) {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    rootStyle,
    className,
    style,
    items,
    children,
    getDropContainer,
    placeholder,
    onChange,
    overflow,
    disabled,
    classNames = {},
    styles = {},
    ...uploadProps
  } = props;

  // ============================ PrefixCls ============================
  const {
    getPrefixCls,
    direction
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('attachment', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = use_x_component_config('attachments');
  const {
    classNames: contextClassNames,
    styles: contextStyles
  } = contextConfig;

  // ============================= Ref =============================
  const containerRef = external_React_default().useRef(null);
  const uploadRef = external_React_default().useRef(null);
  external_React_default().useImperativeHandle(ref, () => ({
    nativeElement: containerRef.current,
    upload: file => {
      const fileInput = uploadRef.current?.nativeElement?.querySelector('input[type="file"]');

      // Trigger native change event
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', {
          bubbles: true
        }));
      }
    }
  }));

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = attachments_style(prefixCls);
  const cssinjsCls = classnames_default()(hashId, cssVarCls);

  // ============================ Upload ============================
  const [fileList, setFileList] = useMergedState([], {
    value: items
  });
  const triggerChange = useEvent(info => {
    setFileList(info.fileList);
    onChange?.(info);
  });
  const mergedUploadProps = {
    ...uploadProps,
    fileList,
    onChange: triggerChange
  };
  const onItemRemove = item => {
    const newFileList = fileList.filter(fileItem => fileItem.uid !== item.uid);
    triggerChange({
      file: item,
      fileList: newFileList
    });
  };

  // ============================ Render ============================
  let renderChildren;
  const getPlaceholderNode = (type, props, ref) => {
    const placeholderContent = typeof placeholder === 'function' ? placeholder(type) : placeholder;
    return /*#__PURE__*/external_React_default().createElement(PlaceholderUploader, {
      placeholder: placeholderContent,
      upload: mergedUploadProps,
      prefixCls: prefixCls,
      className: classnames_default()(contextClassNames.placeholder, classNames.placeholder),
      style: {
        ...contextStyles.placeholder,
        ...styles.placeholder,
        ...props?.style
      },
      ref: ref
    });
  };
  if (children) {
    renderChildren = /*#__PURE__*/external_React_default().createElement((external_React_default()).Fragment, null, /*#__PURE__*/external_React_default().createElement(attachments_SilentUploader, {
      upload: mergedUploadProps,
      rootClassName: rootClassName,
      ref: uploadRef
    }, children), /*#__PURE__*/external_React_default().createElement(DropArea, {
      getDropContainer: getDropContainer,
      prefixCls: prefixCls,
      className: classnames_default()(cssinjsCls, rootClassName)
    }, getPlaceholderNode('drop')));
  } else {
    const hasFileList = fileList.length > 0;
    renderChildren = /*#__PURE__*/external_React_default().createElement("div", {
      className: classnames_default()(prefixCls, cssinjsCls, {
        [`${prefixCls}-rtl`]: direction === 'rtl'
      }, className, rootClassName),
      style: {
        ...rootStyle,
        ...style
      },
      dir: direction || 'ltr',
      ref: containerRef
    }, /*#__PURE__*/external_React_default().createElement(FileList, {
      prefixCls: prefixCls,
      items: fileList,
      onRemove: onItemRemove,
      overflow: overflow,
      upload: mergedUploadProps,
      listClassName: classnames_default()(contextClassNames.list, classNames.list),
      listStyle: {
        ...contextStyles.list,
        ...styles.list,
        ...(!hasFileList && {
          display: 'none'
        })
      },
      itemClassName: classnames_default()(contextClassNames.item, classNames.item),
      itemStyle: {
        ...contextStyles.item,
        ...styles.item
      }
    }), getPlaceholderNode('inline', hasFileList ? {
      style: {
        display: 'none'
      }
    } : {}, uploadRef), /*#__PURE__*/external_React_default().createElement(DropArea, {
      getDropContainer: getDropContainer || (() => containerRef.current),
      prefixCls: prefixCls,
      className: cssinjsCls
    }, getPlaceholderNode('drop')));
  }
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement(AttachmentContext.Provider, {
    value: {
      disabled
    }
  }, renderChildren));
}
const ForwardAttachments = /*#__PURE__*/external_React_default().forwardRef(Attachments);
if (false) {}
ForwardAttachments.FileCard = FileList_FileListCard;
/* harmony default export */ var attachments = (ForwardAttachments);
// EXTERNAL MODULE: ./node_modules/rc-util/lib/pickAttrs.js
var pickAttrs = __webpack_require__(791);
// EXTERNAL MODULE: ./node_modules/rc-util/lib/utils/get.js
var utils_get = __webpack_require__(125);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/CloseOutlined.js
// This icon file is generated automatically.
var CloseOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "fill-rule": "evenodd",
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"
      }
    }]
  },
  "name": "close",
  "theme": "outlined"
};
/* harmony default export */ var asn_CloseOutlined = (CloseOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/CloseOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var CloseOutlined_CloseOutlined = function CloseOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_CloseOutlined
  }));
};

/**![close](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgZm9jdXNhYmxlPSJmYWxzZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNzk5Ljg2IDE2Ni4zMWMuMDIgMCAuMDQuMDIuMDguMDZsNTcuNjkgNTcuN2MuMDQuMDMuMDUuMDUuMDYuMDhhLjEyLjEyIDAgMDEwIC4wNmMwIC4wMy0uMDIuMDUtLjA2LjA5TDU2OS45MyA1MTJsMjg3LjcgMjg3LjdjLjA0LjA0LjA1LjA2LjA2LjA5YS4xMi4xMiAwIDAxMCAuMDdjMCAuMDItLjAyLjA0LS4wNi4wOGwtNTcuNyA1Ny42OWMtLjAzLjA0LS4wNS4wNS0uMDcuMDZhLjEyLjEyIDAgMDEtLjA3IDBjLS4wMyAwLS4wNS0uMDItLjA5LS4wNkw1MTIgNTY5LjkzbC0yODcuNyAyODcuN2MtLjA0LjA0LS4wNi4wNS0uMDkuMDZhLjEyLjEyIDAgMDEtLjA3IDBjLS4wMiAwLS4wNC0uMDItLjA4LS4wNmwtNTcuNjktNTcuN2MtLjA0LS4wMy0uMDUtLjA1LS4wNi0uMDdhLjEyLjEyIDAgMDEwLS4wN2MwLS4wMy4wMi0uMDUuMDYtLjA5TDQ1NC4wNyA1MTJsLTI4Ny43LTI4Ny43Yy0uMDQtLjA0LS4wNS0uMDYtLjA2LS4wOWEuMTIuMTIgMCAwMTAtLjA3YzAtLjAyLjAyLS4wNC4wNi0uMDhsNTcuNy01Ny42OWMuMDMtLjA0LjA1LS4wNS4wNy0uMDZhLjEyLjEyIDAgMDEuMDcgMGMuMDMgMCAuMDUuMDIuMDkuMDZMNTEyIDQ1NC4wN2wyODcuNy0yODcuN2MuMDQtLjA0LjA2LS4wNS4wOS0uMDZhLjEyLjEyIDAgMDEuMDcgMHoiIC8+PC9zdmc+) */
var CloseOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(CloseOutlined_CloseOutlined);
if (false) {}
/* harmony default export */ var icons_CloseOutlined = (CloseOutlined_RefIcon);
;// CONCATENATED MODULE: ./components/sender/SenderHeader.tsx





const SendHeaderContext = /*#__PURE__*/external_React_.createContext({});
const collapseHeight = () => ({
  height: 0
});
const expandedHeight = ele => ({
  height: ele.scrollHeight
});
function SenderHeader(props) {
  const {
    title,
    onOpenChange,
    open,
    children,
    className,
    style,
    classNames: classes = {},
    styles = {},
    closable,
    forceRender
  } = props;
  const {
    prefixCls
  } = external_React_.useContext(SendHeaderContext);
  const headerCls = `${prefixCls}-header`;
  return /*#__PURE__*/external_React_.createElement(es, {
    motionEnter: true,
    motionLeave: true,
    motionName: `${headerCls}-motion`,
    leavedClassName: `${headerCls}-motion-hidden`,
    onEnterStart: collapseHeight,
    onEnterActive: expandedHeight,
    onLeaveStart: expandedHeight,
    onLeaveActive: collapseHeight,
    visible: open,
    forceRender: forceRender
  }, ({
    className: motionClassName,
    style: motionStyle
  }) => {
    return /*#__PURE__*/external_React_.createElement("div", {
      className: classnames_default()(headerCls, motionClassName, className),
      style: {
        ...motionStyle,
        ...style
      }
    }, (closable !== false || title) && /*#__PURE__*/external_React_.createElement("div", {
      className:
      // We follow antd naming standard here.
      // So the header part is use `-header` suffix.
      // Though its little bit weird for double `-header`.
      classnames_default()(`${headerCls}-header`, classes.header),
      style: {
        ...styles.header
      }
    }, /*#__PURE__*/external_React_.createElement("div", {
      className: `${headerCls}-title`
    }, title), closable !== false && /*#__PURE__*/external_React_.createElement("div", {
      className: `${headerCls}-close`
    }, /*#__PURE__*/external_React_.createElement(external_antd_.Button, {
      type: "text",
      icon: /*#__PURE__*/external_React_.createElement(icons_CloseOutlined, null),
      size: "small",
      onClick: () => {
        onOpenChange?.(!open);
      }
    }))), children && /*#__PURE__*/external_React_.createElement("div", {
      className: classnames_default()(`${headerCls}-content`, classes.content),
      style: {
        ...styles.content
      }
    }, children));
  });
}
;// CONCATENATED MODULE: ./components/sender/components/ActionButton.tsx




const ActionButtonContext = /*#__PURE__*/external_React_.createContext(null);
function ActionButton(props, ref) {
  const {
    className,
    action,
    onClick: outClick,
    ...restProps
  } = props;
  const context = external_React_.useContext(ActionButtonContext);
  const {
    prefixCls,
    disabled: rootDisabled
  } = context;
  const onClick = context[action];
  const mergedDisabled = rootDisabled ?? restProps.disabled ?? context[`${action}Disabled`];
  return /*#__PURE__*/external_React_.createElement(external_antd_.Button, extends_default()({
    type: "text"
  }, restProps, {
    ref: ref,
    onClick: e => {
      if (!mergedDisabled) {
        if (onClick) {
          onClick();
        }
        if (outClick) {
          outClick(e);
        }
      }
    },
    className: classnames_default()(prefixCls, className, {
      [`${prefixCls}-disabled`]: mergedDisabled
    })
  }));
}
/* harmony default export */ var components_ActionButton = (/*#__PURE__*/external_React_.forwardRef(ActionButton));
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/ClearOutlined.js
// This icon file is generated automatically.
var ClearOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "defs",
      "attrs": {},
      "children": [{
        "tag": "style",
        "attrs": {}
      }]
    }, {
      "tag": "path",
      "attrs": {
        "d": "M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6a25.95 25.95 0 0025.6 30.4h723c1.5 0 3-.1 4.4-.4a25.88 25.88 0 0021.2-30zM204 390h272V182h72v208h272v104H204V390zm468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z"
      }
    }]
  },
  "name": "clear",
  "theme": "outlined"
};
/* harmony default export */ var asn_ClearOutlined = (ClearOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/ClearOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var ClearOutlined_ClearOutlined = function ClearOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_ClearOutlined
  }));
};

/**![clear](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHN0eWxlIC8+PC9kZWZzPjxwYXRoIGQ9Ik04OTkuMSA4NjkuNmwtNTMtMzA1LjZIODY0YzE0LjQgMCAyNi0xMS42IDI2LTI2VjM0NmMwLTE0LjQtMTEuNi0yNi0yNi0yNkg2MThWMTM4YzAtMTQuNC0xMS42LTI2LTI2LTI2SDQzMmMtMTQuNCAwLTI2IDExLjYtMjYgMjZ2MTgySDE2MGMtMTQuNCAwLTI2IDExLjYtMjYgMjZ2MTkyYzAgMTQuNCAxMS42IDI2IDI2IDI2aDE3LjlsLTUzIDMwNS42YTI1Ljk1IDI1Ljk1IDAgMDAyNS42IDMwLjRoNzIzYzEuNSAwIDMtLjEgNC40LS40YTI1Ljg4IDI1Ljg4IDAgMDAyMS4yLTMwek0yMDQgMzkwaDI3MlYxODJoNzJ2MjA4aDI3MnYxMDRIMjA0VjM5MHptNDY4IDQ0MFY2NzRjMC00LjQtMy42LTgtOC04aC00OGMtNC40IDAtOCAzLjYtOCA4djE1Nkg0MTZWNjc0YzAtNC40LTMuNi04LTgtOGgtNDhjLTQuNCAwLTggMy42LTggOHYxNTZIMjAyLjhsNDUuMS0yNjBINzc2bDQ1LjEgMjYwSDY3MnoiIC8+PC9zdmc+) */
var ClearOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(ClearOutlined_ClearOutlined);
if (false) {}
/* harmony default export */ var icons_ClearOutlined = (ClearOutlined_RefIcon);
;// CONCATENATED MODULE: ./components/sender/components/ClearButton.tsx




function ClearButton(props, ref) {
  return /*#__PURE__*/external_React_.createElement(components_ActionButton, extends_default()({
    icon: /*#__PURE__*/external_React_.createElement(icons_ClearOutlined, null)
  }, props, {
    action: "onClear",
    ref: ref
  }));
}
/* harmony default export */ var components_ClearButton = (/*#__PURE__*/external_React_.forwardRef(ClearButton));
;// CONCATENATED MODULE: ./components/sender/StopLoading.tsx

const StopLoadingIcon = /*#__PURE__*/(0,external_React_.memo)(props => {
  const {
    className
  } = props;
  return /*#__PURE__*/external_React_default().createElement("svg", {
    color: "currentColor",
    viewBox: "0 0 1000 1000",
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    className: className
  }, /*#__PURE__*/external_React_default().createElement("title", null, "Stop Loading"), /*#__PURE__*/external_React_default().createElement("rect", {
    fill: "currentColor",
    height: "250",
    rx: "24",
    ry: "24",
    width: "250",
    x: "375",
    y: "375"
  }), /*#__PURE__*/external_React_default().createElement("circle", {
    cx: "500",
    cy: "500",
    fill: "none",
    r: "450",
    stroke: "currentColor",
    strokeWidth: "100",
    opacity: "0.45"
  }), /*#__PURE__*/external_React_default().createElement("circle", {
    cx: "500",
    cy: "500",
    fill: "none",
    r: "450",
    stroke: "currentColor",
    strokeWidth: "100",
    strokeDasharray: "600 9999999"
  }, /*#__PURE__*/external_React_default().createElement("animateTransform", {
    attributeName: "transform",
    dur: "1s",
    from: "0 500 500",
    repeatCount: "indefinite",
    to: "360 500 500",
    type: "rotate"
  })));
});
/* harmony default export */ var StopLoading = (StopLoadingIcon);
;// CONCATENATED MODULE: ./components/sender/components/LoadingButton.tsx





function LoadingButton(props, ref) {
  const {
    prefixCls
  } = external_React_.useContext(ActionButtonContext);
  const {
    className
  } = props;
  return /*#__PURE__*/external_React_.createElement(components_ActionButton, extends_default()({
    icon: null,
    color: "primary",
    variant: "text",
    shape: "circle"
  }, props, {
    className: classnames_default()(className, `${prefixCls}-loading-button`),
    action: "onCancel",
    ref: ref
  }), /*#__PURE__*/external_React_.createElement(StopLoading, {
    className: `${prefixCls}-loading-icon`
  }));
}
/* harmony default export */ var components_LoadingButton = (/*#__PURE__*/external_React_.forwardRef(LoadingButton));
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/ArrowUpOutlined.js
// This icon file is generated automatically.
var ArrowUpOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M868 545.5L536.1 163a31.96 31.96 0 00-48.3 0L156 545.5a7.97 7.97 0 006 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"
      }
    }]
  },
  "name": "arrow-up",
  "theme": "outlined"
};
/* harmony default export */ var asn_ArrowUpOutlined = (ArrowUpOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/ArrowUpOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var ArrowUpOutlined_ArrowUpOutlined = function ArrowUpOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_ArrowUpOutlined
  }));
};

/**![arrow-up](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg2OCA1NDUuNUw1MzYuMSAxNjNhMzEuOTYgMzEuOTYgMCAwMC00OC4zIDBMMTU2IDU0NS41YTcuOTcgNy45NyAwIDAwNiAxMy4yaDgxYzQuNiAwIDktMiAxMi4xLTUuNUw0NzQgMzAwLjlWODY0YzAgNC40IDMuNiA4IDggOGg2MGM0LjQgMCA4LTMuNiA4LThWMzAwLjlsMjE4LjkgMjUyLjNjMyAzLjUgNy40IDUuNSAxMi4xIDUuNWg4MWM2LjggMCAxMC41LTggNi0xMy4yeiIgLz48L3N2Zz4=) */
var ArrowUpOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(ArrowUpOutlined_ArrowUpOutlined);
if (false) {}
/* harmony default export */ var icons_ArrowUpOutlined = (ArrowUpOutlined_RefIcon);
;// CONCATENATED MODULE: ./components/sender/components/SendButton.tsx




function SendButton(props, ref) {
  return /*#__PURE__*/external_React_.createElement(components_ActionButton, extends_default()({
    icon: /*#__PURE__*/external_React_.createElement(icons_ArrowUpOutlined, null),
    type: "primary",
    shape: "circle"
  }, props, {
    action: "onSend",
    ref: ref
  }));
}
/* harmony default export */ var components_SendButton = (/*#__PURE__*/external_React_.forwardRef(SendButton));
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/AudioMutedOutlined.js
// This icon file is generated automatically.
var AudioMutedOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "defs",
      "attrs": {},
      "children": [{
        "tag": "style",
        "attrs": {}
      }]
    }, {
      "tag": "path",
      "attrs": {
        "d": "M682 455V311l-76 76v68c-.1 50.7-42 92.1-94 92a95.8 95.8 0 01-52-15l-54 55c29.1 22.4 65.9 36 106 36 93.8 0 170-75.1 170-168z"
      }
    }, {
      "tag": "path",
      "attrs": {
        "d": "M833 446h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254-63 0-120.7-23-165-61l-54 54a334.01 334.01 0 00179 81v102H326c-13.9 0-24.9 14.3-25 32v36c.1 4.4 2.9 8 6 8h408c3.2 0 6-3.6 6-8v-36c0-17.7-11-32-25-32H547V782c165.3-17.9 294-157.9 294-328 0-4.4-3.6-8-8-8zm13.1-377.7l-43.5-41.9a8 8 0 00-11.2.1l-129 129C634.3 101.2 577 64 511 64c-93.9 0-170 75.3-170 168v224c0 6.7.4 13.3 1.2 19.8l-68 68A252.33 252.33 0 01258 454c-.2-4.4-3.8-8-8-8h-60c-4.4 0-8 3.6-8 8 0 53 12.5 103 34.6 147.4l-137 137a8.03 8.03 0 000 11.3l42.7 42.7c3.1 3.1 8.2 3.1 11.3 0L846.2 79.8l.1-.1c3.1-3.2 3-8.3-.2-11.4zM417 401V232c0-50.6 41.9-92 94-92 46 0 84.1 32.3 92.3 74.7L417 401z"
      }
    }]
  },
  "name": "audio-muted",
  "theme": "outlined"
};
/* harmony default export */ var asn_AudioMutedOutlined = (AudioMutedOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/AudioMutedOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var AudioMutedOutlined_AudioMutedOutlined = function AudioMutedOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_AudioMutedOutlined
  }));
};

/**![audio-muted](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHN0eWxlIC8+PC9kZWZzPjxwYXRoIGQ9Ik02ODIgNDU1VjMxMWwtNzYgNzZ2NjhjLS4xIDUwLjctNDIgOTIuMS05NCA5MmE5NS44IDk1LjggMCAwMS01Mi0xNWwtNTQgNTVjMjkuMSAyMi40IDY1LjkgMzYgMTA2IDM2IDkzLjggMCAxNzAtNzUuMSAxNzAtMTY4eiIgLz48cGF0aCBkPSJNODMzIDQ0NmgtNjBjLTQuNCAwLTggMy42LTggOCAwIDE0MC4zLTExMy43IDI1NC0yNTQgMjU0LTYzIDAtMTIwLjctMjMtMTY1LTYxbC01NCA1NGEzMzQuMDEgMzM0LjAxIDAgMDAxNzkgODF2MTAySDMyNmMtMTMuOSAwLTI0LjkgMTQuMy0yNSAzMnYzNmMuMSA0LjQgMi45IDggNiA4aDQwOGMzLjIgMCA2LTMuNiA2LTh2LTM2YzAtMTcuNy0xMS0zMi0yNS0zMkg1NDdWNzgyYzE2NS4zLTE3LjkgMjk0LTE1Ny45IDI5NC0zMjggMC00LjQtMy42LTgtOC04em0xMy4xLTM3Ny43bC00My41LTQxLjlhOCA4IDAgMDAtMTEuMi4xbC0xMjkgMTI5QzYzNC4zIDEwMS4yIDU3NyA2NCA1MTEgNjRjLTkzLjkgMC0xNzAgNzUuMy0xNzAgMTY4djIyNGMwIDYuNy40IDEzLjMgMS4yIDE5LjhsLTY4IDY4QTI1Mi4zMyAyNTIuMzMgMCAwMTI1OCA0NTRjLS4yLTQuNC0zLjgtOC04LThoLTYwYy00LjQgMC04IDMuNi04IDggMCA1MyAxMi41IDEwMyAzNC42IDE0Ny40bC0xMzcgMTM3YTguMDMgOC4wMyAwIDAwMCAxMS4zbDQyLjcgNDIuN2MzLjEgMy4xIDguMiAzLjEgMTEuMyAwTDg0Ni4yIDc5LjhsLjEtLjFjMy4xLTMuMiAzLTguMy0uMi0xMS40ek00MTcgNDAxVjIzMmMwLTUwLjYgNDEuOS05MiA5NC05MiA0NiAwIDg0LjEgMzIuMyA5Mi4zIDc0LjdMNDE3IDQwMXoiIC8+PC9zdmc+) */
var AudioMutedOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(AudioMutedOutlined_AudioMutedOutlined);
if (false) {}
/* harmony default export */ var icons_AudioMutedOutlined = (AudioMutedOutlined_RefIcon);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/AudioOutlined.js
// This icon file is generated automatically.
var AudioOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z"
      }
    }]
  },
  "name": "audio",
  "theme": "outlined"
};
/* harmony default export */ var asn_AudioOutlined = (AudioOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/AudioOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var AudioOutlined_AudioOutlined = function AudioOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_AudioOutlined
  }));
};

/**![audio](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg0MiA0NTRjMC00LjQtMy42LTgtOC04aC02MGMtNC40IDAtOCAzLjYtOCA4IDAgMTQwLjMtMTEzLjcgMjU0LTI1NCAyNTRTMjU4IDU5NC4zIDI1OCA0NTRjMC00LjQtMy42LTgtOC04aC02MGMtNC40IDAtOCAzLjYtOCA4IDAgMTY4LjcgMTI2LjYgMzA3LjkgMjkwIDMyNy42Vjg4NEgzMjYuN2MtMTMuNyAwLTI0LjcgMTQuMy0yNC43IDMydjM2YzAgNC40IDIuOCA4IDYuMiA4aDQwNy42YzMuNCAwIDYuMi0zLjYgNi4yLTh2LTM2YzAtMTcuNy0xMS0zMi0yNC43LTMySDU0OFY3ODIuMWMxNjUuMy0xOCAyOTQtMTU4IDI5NC0zMjguMXpNNTEyIDYyNGM5My45IDAgMTcwLTc1LjIgMTcwLTE2OFYyMzJjMC05Mi44LTc2LjEtMTY4LTE3MC0xNjhzLTE3MCA3NS4yLTE3MCAxNjh2MjI0YzAgOTIuOCA3Ni4xIDE2OCAxNzAgMTY4em0tOTQtMzkyYzAtNTAuNiA0MS45LTkyIDk0LTkyczk0IDQxLjQgOTQgOTJ2MjI0YzAgNTAuNi00MS45IDkyLTk0IDkycy05NC00MS40LTk0LTkyVjIzMnoiIC8+PC9zdmc+) */
var AudioOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(AudioOutlined_AudioOutlined);
if (false) {}
/* harmony default export */ var icons_AudioOutlined = (AudioOutlined_RefIcon);
;// CONCATENATED MODULE: ./components/sender/components/SpeechButton/RecordingIcon.tsx

const SIZE = 1000;
const COUNT = 4;
const RECT_WIDTH = 140;
const RECT_RADIUS = RECT_WIDTH / 2;
const RECT_HEIGHT_MIN = 250;
const RECT_HEIGHT_MAX = 500;
const DURATION = 0.8;
function RecordingIcon({
  className
}) {
  return /*#__PURE__*/external_React_default().createElement("svg", {
    color: "currentColor",
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    className: className
  }, /*#__PURE__*/external_React_default().createElement("title", null, "Speech Recording"), Array.from({
    length: COUNT
  }).map((_, index) => {
    const dest = (SIZE - RECT_WIDTH * COUNT) / (COUNT - 1);
    const x = index * (dest + RECT_WIDTH);
    const yMin = SIZE / 2 - RECT_HEIGHT_MIN / 2;
    const yMax = SIZE / 2 - RECT_HEIGHT_MAX / 2;
    return /*#__PURE__*/external_React_default().createElement("rect", {
      fill: "currentColor",
      rx: RECT_RADIUS,
      ry: RECT_RADIUS,
      height: RECT_HEIGHT_MIN,
      width: RECT_WIDTH,
      x: x,
      y: yMin,
      key: index
    }, /*#__PURE__*/external_React_default().createElement("animate", {
      attributeName: "height",
      values: `${RECT_HEIGHT_MIN}; ${RECT_HEIGHT_MAX}; ${RECT_HEIGHT_MIN}`,
      keyTimes: "0; 0.5; 1",
      dur: `${DURATION}s`,
      begin: `${DURATION / COUNT * index}s`,
      repeatCount: "indefinite"
    }), /*#__PURE__*/external_React_default().createElement("animate", {
      attributeName: "y",
      values: `${yMin}; ${yMax}; ${yMin}`,
      keyTimes: "0; 0.5; 1",
      dur: `${DURATION}s`,
      begin: `${DURATION / COUNT * index}s`,
      repeatCount: "indefinite"
    }));
  }));
}
;// CONCATENATED MODULE: ./components/sender/components/SpeechButton/index.tsx





function SpeechButton(props, ref) {
  const {
    speechRecording,
    onSpeechDisabled,
    prefixCls
  } = external_React_.useContext(ActionButtonContext);
  let icon = null;
  if (speechRecording) {
    icon = /*#__PURE__*/external_React_.createElement(RecordingIcon, {
      className: `${prefixCls}-recording-icon`
    });
  } else if (onSpeechDisabled) {
    icon = /*#__PURE__*/external_React_.createElement(icons_AudioMutedOutlined, null);
  } else {
    icon = /*#__PURE__*/external_React_.createElement(icons_AudioOutlined, null);
  }
  return /*#__PURE__*/external_React_.createElement(components_ActionButton, extends_default()({
    icon: icon,
    color: "primary",
    variant: "text"
  }, props, {
    action: "onSpeech",
    ref: ref
  }));
}
/* harmony default export */ var components_SpeechButton = (/*#__PURE__*/external_React_.forwardRef(SpeechButton));
;// CONCATENATED MODULE: ./components/sender/style/header.ts
const genSenderHeaderStyle = token => {
  const {
    componentCls,
    calc
  } = token;
  const headerCls = `${componentCls}-header`;
  return {
    [componentCls]: {
      [headerCls]: {
        borderBottomWidth: token.lineWidth,
        borderBottomStyle: 'solid',
        borderBottomColor: token.colorBorder,
        // ======================== Header ========================
        '&-header': {
          background: token.colorFillAlter,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          paddingBlock: calc(token.paddingSM).sub(token.lineWidthBold).equal(),
          paddingInlineStart: token.padding,
          paddingInlineEnd: token.paddingXS,
          display: 'flex',
          [`${headerCls}-title`]: {
            flex: 'auto'
          }
        },
        // ======================= Content ========================
        '&-content': {
          padding: token.padding
        },
        // ======================== Motion ========================
        '&-motion': {
          transition: ['height', 'border'].map(prop => `${prop} ${token.motionDurationSlow}`).join(','),
          overflow: 'hidden',
          '&-enter-start, &-leave-active': {
            borderBottomColor: 'transparent'
          },
          '&-hidden': {
            display: 'none'
          }
        }
      }
    }
  };
};
/* harmony default export */ var header = (genSenderHeaderStyle);
;// CONCATENATED MODULE: ./components/sender/style/index.ts





// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const genSenderStyle = token => {
  const {
    componentCls,
    padding,
    paddingSM,
    paddingXS,
    lineWidth,
    lineWidthBold,
    calc
  } = token;
  return {
    [componentCls]: {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: `${token.boxShadowTertiary}`,
      transition: `background ${token.motionDurationSlow}`,
      // Border
      borderRadius: {
        _skip_check_: true,
        value: calc(token.borderRadius).mul(2).equal()
      },
      borderColor: token.colorBorder,
      borderWidth: 0,
      borderStyle: 'solid',
      // Border
      '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        transition: `border-color ${token.motionDurationSlow}`,
        borderRadius: {
          _skip_check_: true,
          value: 'inherit'
        },
        borderStyle: 'inherit',
        borderColor: 'inherit',
        borderWidth: lineWidth
      },
      // Focus
      '&:focus-within': {
        boxShadow: `${token.boxShadowSecondary}`,
        borderColor: token.colorPrimary,
        '&:after': {
          borderWidth: lineWidthBold
        }
      },
      '&-disabled': {
        background: token.colorBgContainerDisabled
      },
      // ============================== RTL ==============================
      [`&${componentCls}-rtl`]: {
        direction: 'rtl'
      },
      // ============================ Content ============================
      [`${componentCls}-content`]: {
        display: 'flex',
        gap: paddingXS,
        width: '100%',
        paddingBlock: paddingSM,
        paddingInlineStart: padding,
        paddingInlineEnd: paddingSM,
        boxSizing: 'border-box',
        alignItems: 'flex-end'
      },
      // ============================ Prefix =============================
      [`${componentCls}-prefix`]: {
        flex: 'none'
      },
      // ============================= Input =============================
      [`${componentCls}-input`]: {
        padding: 0,
        borderRadius: 0,
        flex: 'auto',
        alignSelf: 'center',
        minHeight: 'auto'
      },
      // ============================ Actions ============================
      [`${componentCls}-actions-list`]: {
        flex: 'none',
        display: 'flex',
        '&-presets': {
          gap: token.paddingXS
        }
      },
      [`${componentCls}-actions-btn`]: {
        '&-disabled': {
          opacity: 0.45
        },
        '&-loading-button': {
          padding: 0,
          border: 0
        },
        '&-loading-icon': {
          height: token.controlHeight,
          width: token.controlHeight,
          verticalAlign: 'top'
        },
        '&-recording-icon': {
          height: '1.2em',
          width: '1.2em',
          verticalAlign: 'top'
        }
      }
    }
  };
};
const style_prepareComponentToken = () => ({});
/* harmony default export */ var sender_style = (genStyleHooks('Sender', token => {
  const {
    paddingXS,
    calc
  } = token;
  const SenderToken = statistic_merge(token, {
    SenderContentMaxWidth: `calc(100% - ${(0,external_antdCssinjs_.unit)(calc(paddingXS).add(32).equal())})`
  });
  return [genSenderStyle(SenderToken), header(SenderToken)];
}, style_prepareComponentToken));
;// CONCATENATED MODULE: ./components/sender/useSpeech.ts



// Ensure that the SpeechRecognition API is available in the browser
let SpeechRecognition;
if (!SpeechRecognition && typeof window !== 'undefined') {
  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
}
function useSpeech(onSpeech, allowSpeech) {
  const onEventSpeech = useEvent(onSpeech);

  // ========================== Speech Config ==========================
  const [controlledRecording, onControlledRecordingChange, speechInControlled] = external_React_default().useMemo(() => {
    if (typeof allowSpeech === 'object') {
      return [allowSpeech.recording, allowSpeech.onRecordingChange, typeof allowSpeech.recording === 'boolean'];
    }
    return [undefined, undefined, false];
  }, [allowSpeech]);

  // ======================== Speech Permission ========================
  const [permissionState, setPermissionState] = external_React_default().useState(null);
  external_React_default().useEffect(() => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      let lastPermission = null;
      navigator.permissions.query({
        name: 'microphone'
      }).then(permissionStatus => {
        setPermissionState(permissionStatus.state);

        // Keep the last permission status.
        permissionStatus.onchange = function () {
          setPermissionState(this.state);
        };
        lastPermission = permissionStatus;
      });
      return () => {
        // Avoid memory leaks
        if (lastPermission) {
          lastPermission.onchange = null;
        }
      };
    }
  }, []);

  // Convert permission state to a simple type
  const mergedAllowSpeech = SpeechRecognition && permissionState !== 'denied';

  // ========================== Speech Events ==========================
  const recognitionRef = external_React_default().useRef(null);
  const [recording, setRecording] = useMergedState(false, {
    value: controlledRecording
  });
  const forceBreakRef = external_React_default().useRef(false);
  const ensureRecognition = () => {
    if (mergedAllowSpeech && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => {
        setRecording(true);
      };
      recognition.onend = () => {
        setRecording(false);
      };
      recognition.onresult = event => {
        if (!forceBreakRef.current) {
          const transcript = event.results?.[0]?.[0]?.transcript;
          onEventSpeech(transcript);
        }
        forceBreakRef.current = false;
      };
      recognitionRef.current = recognition;
    }
  };
  const triggerSpeech = useEvent(forceBreak => {
    // Ignore if `forceBreak` but is not recording
    if (forceBreak && !recording) {
      return;
    }
    forceBreakRef.current = forceBreak;
    if (speechInControlled) {
      // If in controlled mode, do nothing
      onControlledRecordingChange?.(!recording);
    } else {
      ensureRecognition();
      if (recognitionRef.current) {
        if (recording) {
          recognitionRef.current.stop();
          onControlledRecordingChange?.(false);
        } else {
          recognitionRef.current.start();
          onControlledRecordingChange?.(true);
        }
      }
    }
  });
  return [mergedAllowSpeech, triggerSpeech, recording];
}
;// CONCATENATED MODULE: ./components/sender/index.tsx

















function getComponent(components, path, defaultComponent) {
  return (0,utils_get/* default */.Z)(components, path) || defaultComponent;
}
function Sender(props, ref) {
  const {
    prefixCls: customizePrefixCls,
    styles = {},
    classNames = {},
    className,
    rootClassName,
    style,
    defaultValue,
    value,
    readOnly,
    submitType = 'enter',
    onSubmit,
    loading,
    components,
    onCancel,
    onChange,
    actions,
    onKeyPress,
    onKeyDown,
    disabled,
    allowSpeech,
    prefix,
    header,
    onPaste,
    onPasteFile,
    ...rest
  } = props;

  // ============================= MISC =============================
  const {
    direction,
    getPrefixCls
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('sender', customizePrefixCls);

  // ============================= Refs =============================
  const containerRef = external_React_default().useRef(null);
  const inputRef = external_React_default().useRef(null);
  const mergedContainerRef = useComposeRef(ref, containerRef);

  // ======================= Component Config =======================
  const contextConfig = use_x_component_config('sender');
  const inputCls = `${prefixCls}-input`;

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = sender_style(prefixCls);
  const mergedCls = classnames_default()(prefixCls, contextConfig.className, className, rootClassName, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-disabled`]: disabled
  });
  const actionBtnCls = `${prefixCls}-actions-btn`;
  const actionListCls = `${prefixCls}-actions-list`;

  // ============================ Value =============================
  const [innerValue, setInnerValue] = useMergedState(defaultValue || '', {
    value
  });
  const triggerValueChange = nextValue => {
    setInnerValue(nextValue);
    if (onChange) {
      onChange(nextValue);
    }
  };

  // ============================ Speech ============================
  const [speechPermission, triggerSpeech, speechRecording] = useSpeech(transcript => {
    triggerValueChange(`${innerValue} ${transcript}`);
  }, allowSpeech);

  // ========================== Components ==========================
  const InputTextArea = getComponent(components, ['input'], external_antd_.Input.TextArea);
  const domProps = (0,pickAttrs/* default */.Z)(rest, {
    attr: true,
    aria: true,
    data: true
  });
  const inputProps = {
    ...domProps,
    ref: inputRef
  };

  // ============================ Events ============================
  const triggerSend = () => {
    if (innerValue && onSubmit && !loading) {
      onSubmit(innerValue);
    }
  };
  const triggerClear = () => {
    triggerValueChange('');
  };

  // ============================ Submit ============================
  const isCompositionRef = external_React_default().useRef(false);
  const onInternalCompositionStart = () => {
    isCompositionRef.current = true;
  };
  const onInternalCompositionEnd = () => {
    isCompositionRef.current = false;
  };
  const onInternalKeyPress = e => {
    const canSubmit = e.key === 'Enter' && !isCompositionRef.current;

    // Check for `submitType` to submit
    switch (submitType) {
      case 'enter':
        if (canSubmit && !e.shiftKey) {
          e.preventDefault();
          triggerSend();
        }
        break;
      case 'shiftEnter':
        if (canSubmit && e.shiftKey) {
          e.preventDefault();
          triggerSend();
        }
        break;
    }
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  // ============================ Paste =============================
  const onInternalPaste = e => {
    // Get file
    const file = e.clipboardData?.files[0];
    if (file && onPasteFile) {
      onPasteFile(file);
      e.preventDefault();
    }
    onPaste?.(e);
  };

  // ============================ Focus =============================
  const onContentMouseDown = e => {
    // If input focused but click on the container,
    // input will lose focus.
    // We call `preventDefault` to prevent this behavior
    if (e.target !== containerRef.current?.querySelector(`.${inputCls}`)) {
      e.preventDefault();
    }
    inputRef.current?.focus();
  };

  // ============================ Action ============================
  let actionNode = /*#__PURE__*/external_React_default().createElement(external_antd_.Flex, {
    className: `${actionListCls}-presets`
  }, allowSpeech && /*#__PURE__*/external_React_default().createElement(components_SpeechButton, null), loading ? /*#__PURE__*/external_React_default().createElement(components_LoadingButton, null) : /*#__PURE__*/external_React_default().createElement(components_SendButton, null));

  // Custom actions
  if (typeof actions === 'function') {
    actionNode = actions(actionNode, {
      components: {
        SendButton: components_SendButton,
        ClearButton: components_ClearButton,
        LoadingButton: components_LoadingButton
      }
    });
  } else if (actions) {
    actionNode = actions;
  }

  // ============================ Render ============================
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement("div", {
    ref: mergedContainerRef,
    className: mergedCls,
    style: {
      ...contextConfig.style,
      ...style
    }
  }, header && /*#__PURE__*/external_React_default().createElement(SendHeaderContext.Provider, {
    value: {
      prefixCls
    }
  }, header), /*#__PURE__*/external_React_default().createElement("div", {
    className: `${prefixCls}-content`,
    onMouseDown: onContentMouseDown
  }, prefix && /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(`${prefixCls}-prefix`, contextConfig.classNames.prefix, classNames.prefix),
    style: {
      ...contextConfig.styles.prefix,
      ...styles.prefix
    }
  }, prefix), /*#__PURE__*/external_React_default().createElement(InputTextArea, extends_default()({}, inputProps, {
    disabled: disabled,
    style: {
      ...contextConfig.styles.input,
      ...styles.input
    },
    className: classnames_default()(inputCls, contextConfig.classNames.input, classNames.input),
    autoSize: {
      maxRows: 8
    },
    value: innerValue,
    onChange: e => {
      triggerValueChange(e.target.value);
      triggerSpeech(true);
    },
    onPressEnter: onInternalKeyPress,
    onCompositionStart: onInternalCompositionStart,
    onCompositionEnd: onInternalCompositionEnd,
    onKeyDown: onKeyDown,
    onPaste: onInternalPaste,
    variant: "borderless",
    readOnly: readOnly
  })), /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(actionListCls, contextConfig.classNames.actions, classNames.actions),
    style: {
      ...contextConfig.styles.actions,
      ...styles.actions
    }
  }, /*#__PURE__*/external_React_default().createElement(ActionButtonContext.Provider, {
    value: {
      prefixCls: actionBtnCls,
      onSend: triggerSend,
      onSendDisabled: !innerValue,
      onClear: triggerClear,
      onClearDisabled: !innerValue,
      onCancel,
      onCancelDisabled: !loading,
      onSpeech: () => triggerSpeech(false),
      onSpeechDisabled: !speechPermission,
      speechRecording,
      disabled
    }
  }, actionNode)))));
}
const ForwardSender = /*#__PURE__*/external_React_default().forwardRef(Sender);
if (false) {}
ForwardSender.Header = SenderHeader;
/* harmony default export */ var sender = (ForwardSender);
// EXTERNAL MODULE: ./node_modules/rc-util/lib/hooks/useLayoutEffect.js
var lib_hooks_useLayoutEffect = __webpack_require__(35);
;// CONCATENATED MODULE: ./components/bubble/hooks/useTypedEffect.ts


function isString(str) {
  return typeof str === 'string';
}

/**
 * Return typed content and typing status when typing is enabled.
 * Or return content directly.
 */
const useTypedEffect = (content, typingEnabled, typingStep, typingInterval) => {
  const [prevContent, setPrevContent] = external_React_.useState('');
  const [typingIndex, setTypingIndex] = external_React_.useState(1);
  const mergedTypingEnabled = typingEnabled && isString(content);

  // Reset typing index when content changed
  (0,lib_hooks_useLayoutEffect["default"])(() => {
    setPrevContent(content);
    if (!mergedTypingEnabled && isString(content)) {
      setTypingIndex(content.length);
    } else if (isString(content) && isString(prevContent) && content.indexOf(prevContent) !== 0) {
      setTypingIndex(1);
    }
  }, [content]);

  // Start typing
  external_React_.useEffect(() => {
    if (mergedTypingEnabled && typingIndex < content.length) {
      const id = setTimeout(() => {
        setTypingIndex(prev => prev + typingStep);
      }, typingInterval);
      return () => {
        clearTimeout(id);
      };
    }
  }, [typingIndex, typingEnabled, content]);
  const mergedTypingContent = mergedTypingEnabled ? content.slice(0, typingIndex) : content;
  return [mergedTypingContent, mergedTypingEnabled && typingIndex < content.length];
};
/* harmony default export */ var hooks_useTypedEffect = (useTypedEffect);
;// CONCATENATED MODULE: ./components/bubble/hooks/useTypingConfig.ts

function useTypingConfig(typing) {
  return external_React_.useMemo(() => {
    if (!typing) {
      return [false, 0, 0];
    }
    let baseConfig = {
      step: 1,
      interval: 50
    };
    if (typeof typing === 'object') {
      baseConfig = {
        ...baseConfig,
        ...typing
      };
    }
    return [true, baseConfig.step, baseConfig.interval];
  }, [typing]);
}
/* harmony default export */ var hooks_useTypingConfig = (useTypingConfig);
;// CONCATENATED MODULE: ./components/bubble/loading.tsx

const Loading = ({
  prefixCls
}) => /*#__PURE__*/external_React_default().createElement("span", {
  className: `${prefixCls}-dot`
}, /*#__PURE__*/external_React_default().createElement("i", {
  className: `${prefixCls}-dot-item`,
  key: `item-${1}`
}), /*#__PURE__*/external_React_default().createElement("i", {
  className: `${prefixCls}-dot-item`,
  key: `item-${2}`
}), /*#__PURE__*/external_React_default().createElement("i", {
  className: `${prefixCls}-dot-item`,
  key: `item-${3}`
}));
/* harmony default export */ var bubble_loading = (Loading);
;// CONCATENATED MODULE: ./components/bubble/style/content.ts

const genVariantStyle = token => {
  const {
    componentCls,
    paddingSM,
    padding
  } = token;
  return {
    [componentCls]: {
      [`${componentCls}-content`]: {
        // Shared: filled, outlined, shadow
        '&-filled,&-outlined,&-shadow': {
          padding: `${(0,external_antdCssinjs_.unit)(paddingSM)} ${(0,external_antdCssinjs_.unit)(padding)}`,
          borderRadius: token.borderRadiusLG
        },
        // Filled:
        '&-filled': {
          backgroundColor: token.colorFillContent
        },
        // Outlined:
        '&-outlined': {
          border: `1px solid ${token.colorBorderSecondary}`
        },
        // Shadow:
        '&-shadow': {
          boxShadow: token.boxShadowTertiary
        }
      }
    }
  };
};
const genShapeStyle = token => {
  const {
    componentCls,
    fontSize,
    lineHeight,
    paddingSM,
    padding,
    calc
  } = token;
  const halfRadius = calc(fontSize).mul(lineHeight).div(2).add(paddingSM).equal();
  const contentCls = `${componentCls}-content`;
  return {
    [componentCls]: {
      [contentCls]: {
        // round:
        '&-round': {
          borderRadius: {
            _skip_check_: true,
            value: halfRadius
          },
          paddingInline: calc(padding).mul(1.25).equal()
        }
      },
      // corner:
      [`&-start ${contentCls}-corner`]: {
        borderStartStartRadius: token.borderRadiusXS
      },
      [`&-end ${contentCls}-corner`]: {
        borderStartEndRadius: token.borderRadiusXS
      }
    }
  };
};
;// CONCATENATED MODULE: ./components/bubble/style/list.ts
const genBubbleListStyle = token => {
  const {
    componentCls,
    padding
  } = token;
  return {
    [`${componentCls}-list`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: padding,
      overflowY: 'auto'
    }
  };
};
/* harmony default export */ var list = (genBubbleListStyle);
;// CONCATENATED MODULE: ./components/bubble/style/index.ts





const loadingMove = new external_antdCssinjs_.Keyframes('loadingMove', {
  '0%': {
    transform: 'translateY(0)'
  },
  '10%': {
    transform: 'translateY(4px)'
  },
  '20%': {
    transform: 'translateY(0)'
  },
  '30%': {
    transform: 'translateY(-4px)'
  },
  '40%': {
    transform: 'translateY(0)'
  }
});
const cursorBlink = new external_antdCssinjs_.Keyframes('cursorBlink', {
  '0%': {
    opacity: 1
  },
  '50%': {
    opacity: 0
  },
  '100%': {
    opacity: 1
  }
});

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const genBubbleStyle = token => {
  const {
    componentCls,
    fontSize,
    lineHeight,
    paddingSM,
    colorText,
    calc
  } = token;
  return {
    [componentCls]: {
      display: 'flex',
      columnGap: paddingSM,
      maxWidth: '100%',
      [`&${componentCls}-end`]: {
        justifyContent: 'end',
        flexDirection: 'row-reverse'
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl'
      },
      [`&${componentCls}-typing ${componentCls}-content:last-child::after`]: {
        content: '"|"',
        fontWeight: 900,
        userSelect: 'none',
        opacity: 1,
        marginInlineStart: '0.1em',
        animationName: cursorBlink,
        animationDuration: '0.8s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear'
      },
      // ============================ Avatar =============================
      [`& ${componentCls}-avatar`]: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignSelf: 'flex-start'
      },
      // ======================== Header & Footer ========================
      [`& ${componentCls}-header, & ${componentCls}-footer`]: {
        fontSize: fontSize,
        lineHeight: lineHeight,
        color: token.colorText
      },
      [`& ${componentCls}-header`]: {
        marginBottom: token.paddingXXS
      },
      [`& ${componentCls}-footer`]: {
        marginTop: paddingSM
      },
      // =========================== Content =============================
      [`& ${componentCls}-content-wrapper`]: {
        flex: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      },
      [`& ${componentCls}-content`]: {
        position: 'relative',
        boxSizing: 'border-box',
        color: colorText,
        fontSize: token.fontSize,
        lineHeight: token.lineHeight,
        minHeight: calc(paddingSM).mul(2).add(calc(lineHeight).mul(fontSize)).equal(),
        wordBreak: 'break-word',
        [`& ${componentCls}-dot`]: {
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          columnGap: token.marginXS,
          padding: `0 ${(0,external_antdCssinjs_.unit)(token.paddingXXS)}`,
          '&-item': {
            backgroundColor: token.colorPrimary,
            borderRadius: '100%',
            width: 4,
            height: 4,
            animationName: loadingMove,
            animationDuration: '2s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            '&:nth-child(1)': {
              animationDelay: '0s'
            },
            '&:nth-child(2)': {
              animationDelay: '0.2s'
            },
            '&:nth-child(3)': {
              animationDelay: '0.4s'
            }
          }
        }
      }
    }
  };
};
const bubble_style_prepareComponentToken = () => ({});
/* harmony default export */ var bubble_style = (genStyleHooks('Bubble', token => {
  const bubbleToken = statistic_merge(token, {});
  return [genBubbleStyle(bubbleToken), list(bubbleToken), genVariantStyle(bubbleToken), genShapeStyle(bubbleToken)];
}, bubble_style_prepareComponentToken));
;// CONCATENATED MODULE: ./components/bubble/Bubble.tsx










const BubbleContext = /*#__PURE__*/external_React_default().createContext({});
const Bubble = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    classNames = {},
    styles = {},
    avatar,
    placement = 'start',
    loading = false,
    loadingRender,
    typing,
    content = '',
    messageRender,
    variant = 'filled',
    shape,
    onTypingComplete,
    header,
    footer,
    ...otherHtmlProps
  } = props;
  const {
    onUpdate
  } = external_React_default().useContext(BubbleContext);

  // ============================= Refs =============================
  const divRef = external_React_default().useRef(null);
  external_React_default().useImperativeHandle(ref, () => ({
    nativeElement: divRef.current
  }));

  // ============================ Prefix ============================
  const {
    direction,
    getPrefixCls
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('bubble', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = use_x_component_config('bubble');

  // ============================ Typing ============================
  const [typingEnabled, typingStep, typingInterval] = hooks_useTypingConfig(typing);
  const [typedContent, isTyping] = hooks_useTypedEffect(content, typingEnabled, typingStep, typingInterval);
  external_React_default().useEffect(() => {
    onUpdate?.();
  }, [typedContent]);
  const triggerTypingCompleteRef = external_React_default().useRef(false);
  external_React_default().useEffect(() => {
    if (!isTyping && !loading) {
      // StrictMode will trigger this twice,
      // So we need a flag to avoid that
      if (!triggerTypingCompleteRef.current) {
        triggerTypingCompleteRef.current = true;
        onTypingComplete?.();
      }
    } else {
      triggerTypingCompleteRef.current = false;
    }
  }, [isTyping, loading]);

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = bubble_style(prefixCls);
  const mergedCls = classnames_default()(prefixCls, rootClassName, contextConfig.className, className, hashId, cssVarCls, `${prefixCls}-${placement}`, {
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-typing`]: isTyping && !loading && !messageRender
  });

  // ============================ Avatar ============================
  const avatarNode = /*#__PURE__*/external_React_default().isValidElement(avatar) ? avatar : /*#__PURE__*/external_React_default().createElement(external_antd_.Avatar, avatar);

  // =========================== Content ============================
  const mergedContent = messageRender ? messageRender(typedContent) : typedContent;

  // ============================ Render ============================
  let contentNode;
  if (loading) {
    contentNode = loadingRender ? loadingRender() : /*#__PURE__*/external_React_default().createElement(bubble_loading, {
      prefixCls: prefixCls
    });
  } else {
    contentNode = mergedContent;
  }
  let fullContent = /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      ...contextConfig.styles.content,
      ...styles.content
    },
    className: classnames_default()(`${prefixCls}-content`, `${prefixCls}-content-${variant}`, shape && `${prefixCls}-content-${shape}`, contextConfig.classNames.content, classNames.content)
  }, contentNode);
  if (header || footer) {
    fullContent = /*#__PURE__*/external_React_default().createElement("div", {
      className: `${prefixCls}-content-wrapper`
    }, header && /*#__PURE__*/external_React_default().createElement("div", {
      className: classnames_default()(`${prefixCls}-header`, contextConfig.classNames.header, classNames.header),
      style: {
        ...contextConfig.styles.header,
        ...styles.header
      }
    }, header), fullContent, footer && /*#__PURE__*/external_React_default().createElement("div", {
      className: classnames_default()(`${prefixCls}-footer`, contextConfig.classNames.footer, classNames.footer),
      style: {
        ...contextConfig.styles.footer,
        ...styles.footer
      }
    }, footer));
  }
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement("div", extends_default()({
    style: {
      ...contextConfig.style,
      ...style
    },
    className: mergedCls
  }, otherHtmlProps, {
    ref: divRef
  }), avatar && /*#__PURE__*/external_React_default().createElement("div", {
    style: {
      ...contextConfig.styles.avatar,
      ...styles.avatar
    },
    className: classnames_default()(`${prefixCls}-avatar`, contextConfig.classNames.avatar, classNames.avatar)
  }, avatarNode), fullContent));
};
const ForwardBubble = /*#__PURE__*/external_React_default().forwardRef(Bubble);
if (false) {}
/* harmony default export */ var bubble_Bubble = (ForwardBubble);
;// CONCATENATED MODULE: ./components/bubble/hooks/useDisplayData.ts


function useDisplayData(items) {
  const [displayCount, setDisplayCount] = external_React_default().useState(items.length);
  const displayList = external_React_default().useMemo(() => items.slice(0, displayCount), [items, displayCount]);
  const displayListLastKey = external_React_default().useMemo(() => {
    const lastItem = displayList[displayList.length - 1];
    return lastItem ? lastItem.key : null;
  }, [displayList]);

  // When `items` changed, we replaced with latest one
  external_React_default().useEffect(() => {
    if (displayList.length && displayList.every((item, index) => item.key === items[index]?.key)) {
      return;
    }
    if (displayList.length === 0) {
      setDisplayCount(1);
    } else {
      // Find diff index
      for (let i = 0; i < displayList.length; i += 1) {
        if (displayList[i].key !== items[i]?.key) {
          setDisplayCount(i);
          break;
        }
      }
    }
  }, [items]);

  // Continue to show if last one finished typing
  const onTypingComplete = useEvent(key => {
    if (key === displayListLastKey) {
      setDisplayCount(displayCount + 1);
    }
  });
  return [displayList, onTypingComplete];
}
;// CONCATENATED MODULE: ./components/bubble/hooks/useListData.ts

function useListData(items, roles) {
  const getRoleBubbleProps = external_React_.useCallback(bubble => {
    if (typeof roles === 'function') {
      return roles(bubble);
    }
    if (roles) {
      return roles[bubble.role] || {};
    }
    return {};
  }, [roles]);
  return external_React_.useMemo(() => (items || []).map((bubbleData, i) => {
    const mergedKey = bubbleData.key ?? `preset_${i}`;
    return {
      ...getRoleBubbleProps(bubbleData),
      ...bubbleData,
      key: mergedKey
    };
  }), [items, getRoleBubbleProps]);
}
;// CONCATENATED MODULE: ./components/bubble/BubbleList.tsx










const BubbleList = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    items,
    autoScroll = true,
    roles,
    ...restProps
  } = props;
  const domProps = (0,pickAttrs/* default */.Z)(restProps, {
    attr: true,
    aria: true
  });

  // ============================= Refs =============================
  const listRef = external_React_.useRef(null);
  const bubbleRefs = external_React_.useRef({});

  // ============================ Prefix ============================
  const {
    getPrefixCls
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('bubble', customizePrefixCls);
  const listPrefixCls = `${prefixCls}-list`;
  const [wrapCSSVar, hashId, cssVarCls] = bubble_style(prefixCls);

  // ============================ Typing ============================
  const [initialized, setInitialized] = external_React_.useState(false);
  external_React_.useEffect(() => {
    setInitialized(true);
    return () => {
      setInitialized(false);
    };
  }, []);

  // ============================= Data =============================
  const mergedData = useListData(items, roles);
  const [displayData, onTypingComplete] = useDisplayData(mergedData);

  // ============================ Scroll ============================
  // Is current scrollTop at the end. User scroll will make this false.
  const [scrollReachEnd, setScrollReachEnd] = external_React_.useState(true);
  const [updateCount, setUpdateCount] = external_React_.useState(0);
  const onInternalScroll = e => {
    const target = e.target;
    setScrollReachEnd(target.scrollTop + target.clientHeight === target.scrollHeight);
  };
  external_React_.useEffect(() => {
    if (autoScroll && listRef.current && scrollReachEnd) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight
      });
    }
  }, [updateCount]);

  // Always scroll to bottom when data change
  external_React_.useEffect(() => {
    if (autoScroll) {
      // New date come, the origin last one is the second last one
      const lastItemKey = displayData[displayData.length - 2]?.key;
      const bubbleInst = bubbleRefs.current[lastItemKey];

      // Auto scroll if last 2 item is visible
      if (bubbleInst) {
        const {
          nativeElement
        } = bubbleInst;
        const {
          top,
          bottom
        } = nativeElement.getBoundingClientRect();
        const {
          top: listTop,
          bottom: listBottom
        } = listRef.current.getBoundingClientRect();
        const isVisible = top < listBottom && bottom > listTop;
        if (isVisible) {
          setUpdateCount(c => c + 1);
          setScrollReachEnd(true);
        }
      }
    }
  }, [displayData.length]);

  // ========================== Outer Ref ===========================
  external_React_.useImperativeHandle(ref, () => ({
    nativeElement: listRef.current,
    scrollTo: ({
      key,
      offset,
      behavior = 'smooth',
      block
    }) => {
      if (typeof offset === 'number') {
        // Offset scroll
        listRef.current.scrollTo({
          top: offset,
          behavior
        });
      } else if (key !== undefined) {
        // Key scroll
        const bubbleInst = bubbleRefs.current[key];
        if (bubbleInst) {
          // Block current auto scrolling
          const index = displayData.findIndex(dataItem => dataItem.key === key);
          setScrollReachEnd(index === displayData.length - 1);

          // Do native scroll
          bubbleInst.nativeElement.scrollIntoView({
            behavior,
            block
          });
        }
      }
    }
  }));

  // =========================== Context ============================
  // When bubble content update, we try to trigger `autoScroll` for sync
  const onBubbleUpdate = useEvent(() => {
    if (autoScroll) {
      setUpdateCount(c => c + 1);
    }
  });
  const context = external_React_.useMemo(() => ({
    onUpdate: onBubbleUpdate
  }), []);

  // ============================ Render ============================
  return wrapCSSVar( /*#__PURE__*/external_React_.createElement(BubbleContext.Provider, {
    value: context
  }, /*#__PURE__*/external_React_.createElement("div", extends_default()({}, domProps, {
    className: classnames_default()(listPrefixCls, rootClassName, className, hashId, cssVarCls, {
      [`${listPrefixCls}-reach-end`]: scrollReachEnd
    }),
    ref: listRef,
    onScroll: onInternalScroll
  }), displayData.map(({
    key,
    ...bubble
  }) => /*#__PURE__*/external_React_.createElement(bubble_Bubble, extends_default()({}, bubble, {
    key: key,
    ref: node => {
      if (node) {
        bubbleRefs.current[key] = node;
      } else {
        delete bubbleRefs.current[key];
      }
    },
    typing: initialized ? bubble.typing : false,
    onTypingComplete: () => {
      bubble.onTypingComplete?.();
      onTypingComplete(key);
    }
  }))))));
};
const ForwardBubbleList = /*#__PURE__*/external_React_.forwardRef(BubbleList);
if (false) {}
/* harmony default export */ var bubble_BubbleList = (ForwardBubbleList);
;// CONCATENATED MODULE: ./components/bubble/index.tsx


bubble_Bubble.List = bubble_BubbleList;
/* harmony default export */ var bubble = (bubble_Bubble);
;// CONCATENATED MODULE: ./components/conversations/GroupTitle.tsx



// User should not care about internal state.
// Which should pass by context instead.
const GroupTitleContext = /*#__PURE__*/external_React_default().createContext(null);
const GroupTitle = ({
  children
}) => {
  const {
    prefixCls
  } = external_React_default().useContext(GroupTitleContext);
  return /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(`${prefixCls}-group-title`)
  }, children && /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Text, null, children));
};
/* harmony default export */ var conversations_GroupTitle = (GroupTitle);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons-svg/es/asn/EllipsisOutlined.js
// This icon file is generated automatically.
var EllipsisOutlined = {
  "icon": {
    "tag": "svg",
    "attrs": {
      "viewBox": "64 64 896 896",
      "focusable": "false"
    },
    "children": [{
      "tag": "path",
      "attrs": {
        "d": "M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z"
      }
    }]
  },
  "name": "ellipsis",
  "theme": "outlined"
};
/* harmony default export */ var asn_EllipsisOutlined = (EllipsisOutlined);
;// CONCATENATED MODULE: ./node_modules/@ant-design/icons/es/icons/EllipsisOutlined.js

// GENERATE BY ./scripts/generate.ts
// DON NOT EDIT IT MANUALLY




var EllipsisOutlined_EllipsisOutlined = function EllipsisOutlined(props, ref) {
  return /*#__PURE__*/external_React_.createElement(AntdIcon, _extends({}, props, {
    ref: ref,
    icon: asn_EllipsisOutlined
  }));
};

/**![ellipsis](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE3NiA1MTFhNTYgNTYgMCAxMDExMiAwIDU2IDU2IDAgMTAtMTEyIDB6bTI4MCAwYTU2IDU2IDAgMTAxMTIgMCA1NiA1NiAwIDEwLTExMiAwem0yODAgMGE1NiA1NiAwIDEwMTEyIDAgNTYgNTYgMCAxMC0xMTIgMHoiIC8+PC9zdmc+) */
var EllipsisOutlined_RefIcon = /*#__PURE__*/external_React_.forwardRef(EllipsisOutlined_EllipsisOutlined);
if (false) {}
/* harmony default export */ var icons_EllipsisOutlined = (EllipsisOutlined_RefIcon);
;// CONCATENATED MODULE: ./components/conversations/Item.tsx






const stopPropagation = e => {
  e.stopPropagation();
};
const ConversationsItem = props => {
  const {
    prefixCls,
    info,
    className,
    direction,
    onClick,
    active,
    menu,
    ...restProps
  } = props;
  const domProps = (0,pickAttrs/* default */.Z)(restProps, {
    aria: true,
    data: true,
    attr: true
  });

  // ============================= MISC =============================
  const {
    disabled
  } = info;

  // =========================== Ellipsis ===========================
  const [inEllipsis, onEllipsis] = external_React_default().useState(false);

  // =========================== Tooltip ============================
  const [opened, setOpened] = external_React_default().useState(false);

  // ============================ Style =============================
  const mergedCls = classnames_default()(className, `${prefixCls}-item`, {
    [`${prefixCls}-item-active`]: active && !disabled
  }, {
    [`${prefixCls}-item-disabled`]: disabled
  });

  // ============================ Events ============================
  const onInternalClick = () => {
    if (!disabled && onClick) {
      onClick(info);
    }
  };
  const onOpenChange = open => {
    if (open) {
      setOpened(!open);
    }
  };

  // ============================ Render ============================
  return /*#__PURE__*/external_React_default().createElement(external_antd_.Tooltip, {
    title: info.label,
    open: inEllipsis && opened,
    onOpenChange: setOpened,
    placement: direction === 'rtl' ? 'left' : 'right'
  }, /*#__PURE__*/external_React_default().createElement("li", extends_default()({}, domProps, {
    className: mergedCls,
    onClick: onInternalClick
  }), info.icon && /*#__PURE__*/external_React_default().createElement("div", {
    className: `${prefixCls}-icon`
  }, info.icon), /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Text, {
    className: `${prefixCls}-label`,
    ellipsis: {
      onEllipsis
    }
  }, info.label), menu && !disabled && /*#__PURE__*/external_React_default().createElement(external_antd_.Dropdown, {
    menu: menu,
    placement: direction === 'rtl' ? 'bottomLeft' : 'bottomRight',
    trigger: ['click'],
    disabled: disabled,
    onOpenChange: onOpenChange
  }, /*#__PURE__*/external_React_default().createElement(icons_EllipsisOutlined, {
    onClick: stopPropagation,
    disabled: disabled,
    className: `${prefixCls}-menu-icon`
  }))));
};
/* harmony default export */ var Item = (ConversationsItem);
// EXTERNAL MODULE: ./node_modules/rc-util/lib/hooks/useMergedState.js
var hooks_useMergedState = __webpack_require__(578);
;// CONCATENATED MODULE: ./components/conversations/hooks/useGroupable.ts

/**
 * 🔥 Only for handling ungrouped data. Do not use it for any other purpose! 🔥
 */
const __UNGROUPED = '__ungrouped';
const useGroupable = (groupable, items = []) => {
  const [enableGroup, sort, title] = external_React_default().useMemo(() => {
    if (!groupable) {
      return [false, undefined, undefined];
    }
    let baseConfig = {
      sort: undefined,
      title: undefined
    };
    if (typeof groupable === 'object') {
      baseConfig = {
        ...baseConfig,
        ...groupable
      };
    }
    return [true, baseConfig.sort, baseConfig.title];
  }, [groupable]);
  return external_React_default().useMemo(() => {
    // 未开启分组模式直接返回
    if (!enableGroup) {
      const groupList = [{
        name: __UNGROUPED,
        data: items,
        title: undefined
      }];
      return [groupList, enableGroup];
    }

    // 1. 将 data 做数据分组，填充 groupMap
    const groupMap = items.reduce((acc, item) => {
      const group = item.group || __UNGROUPED;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    }, {});

    // 2. 存在 sort 时对 groupKeys 排序
    const groupKeys = sort ? Object.keys(groupMap).sort(sort) : Object.keys(groupMap);

    // 3. groupMap 转 groupList
    const groupList = groupKeys.map(group => ({
      name: group === __UNGROUPED ? undefined : group,
      title,
      data: groupMap[group]
    }));
    return [groupList, enableGroup];
  }, [items, groupable]);
};
/* harmony default export */ var hooks_useGroupable = (useGroupable);
;// CONCATENATED MODULE: ./components/conversations/style/index.ts




// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const genConversationsStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingXXS,
      overflowY: 'auto',
      padding: token.paddingSM,
      [`&${componentCls}-rtl`]: {
        direction: 'rtl'
      },
      // 会话列表
      [`& ${componentCls}-list`]: {
        display: 'flex',
        gap: token.paddingXXS,
        flexDirection: 'column',
        [`& ${componentCls}-item`]: {
          paddingInlineStart: token.paddingXL
        },
        [`& ${componentCls}-label`]: {
          color: token.colorTextDescription
        }
      },
      // 会话列表项
      [`& ${componentCls}-item`]: {
        display: 'flex',
        height: token.controlHeightLG,
        minHeight: token.controlHeightLG,
        gap: token.paddingXS,
        padding: `0 ${(0,external_antdCssinjs_.unit)(token.paddingXS)}`,
        alignItems: 'center',
        borderRadius: token.borderRadiusLG,
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        // 悬浮样式
        '&:hover': {
          backgroundColor: token.colorBgTextHover
        },
        // 选中样式
        '&-active': {
          backgroundColor: token.colorBgTextHover,
          [`& ${componentCls}-label, ${componentCls}-menu-icon`]: {
            color: token.colorText
          }
        },
        // 禁用样式
        '&-disabled': {
          cursor: 'not-allowed',
          [`& ${componentCls}-label`]: {
            color: token.colorTextDisabled
          }
        },
        // 悬浮、选中时激活操作菜单
        '&:hover, &-active': {
          [`& ${componentCls}-menu-icon`]: {
            opacity: 1
          }
        }
      },
      // 会话名
      [`& ${componentCls}-label`]: {
        flex: 1,
        color: token.colorText
      },
      // 会话操作菜单
      [`& ${componentCls}-menu-icon`]: {
        opacity: 0,
        fontSize: token.fontSizeXL
      },
      // 会话图标
      [`& ${componentCls}-group-title`]: {
        display: 'flex',
        alignItems: 'center',
        height: token.controlHeightLG,
        minHeight: token.controlHeightLG,
        padding: `0 ${(0,external_antdCssinjs_.unit)(token.paddingXS)}`
      }
    }
  };
};
const conversations_style_prepareComponentToken = () => ({});
/* harmony default export */ var conversations_style = (genStyleHooks('Conversations', token => {
  const compToken = statistic_merge(token, {});
  return genConversationsStyle(compToken);
}, conversations_style_prepareComponentToken));
;// CONCATENATED MODULE: ./components/conversations/index.tsx












/**
 * @desc 会话列表组件参数
 * @descEN Props for the conversation list component
 */

const Conversations = props => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    items,
    activeKey,
    defaultActiveKey,
    onActiveChange,
    menu,
    styles = {},
    classNames = {},
    groupable,
    className,
    style,
    ...restProps
  } = props;
  const domProps = (0,pickAttrs/* default */.Z)(restProps, {
    attr: true,
    aria: true,
    data: true
  });

  // ============================ ActiveKey ============================
  const [mergedActiveKey, setMergedActiveKey] = (0,hooks_useMergedState/* default */.Z)(defaultActiveKey, {
    value: activeKey
  });

  // ============================ Groupable ============================
  const [groupList, enableGroup] = hooks_useGroupable(groupable, items);

  // ============================ Prefix ============================
  const {
    getPrefixCls,
    direction
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('conversations', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = use_x_component_config('conversations');

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = conversations_style(prefixCls);
  const mergedCls = classnames_default()(prefixCls, contextConfig.className, className, rootClassName, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl'
  });

  // ============================ Events ============================
  const onConversationItemClick = info => {
    setMergedActiveKey(info.key);
    if (onActiveChange) {
      onActiveChange(info.key);
    }
  };

  // ============================ Render ============================
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement("ul", extends_default()({}, domProps, {
    style: {
      ...contextConfig.style,
      ...style
    },
    className: mergedCls
  }), groupList.map((groupInfo, groupIndex) => {
    const convItems = groupInfo.data.map((convInfo, convIndex) => /*#__PURE__*/external_React_default().createElement(Item, {
      key: convInfo.key || `key-${convIndex}`,
      info: convInfo,
      prefixCls: prefixCls,
      direction: direction,
      className: classnames_default()(classNames.item, contextConfig.classNames.item),
      style: {
        ...contextConfig.styles.item,
        ...styles.item
      },
      menu: typeof menu === 'function' ? menu(convInfo) : menu,
      active: mergedActiveKey === convInfo.key,
      onClick: onConversationItemClick
    }));

    // With group to show the title
    if (enableGroup) {
      return /*#__PURE__*/external_React_default().createElement("li", {
        key: groupInfo.name || `key-${groupIndex}`
      }, /*#__PURE__*/external_React_default().createElement(GroupTitleContext.Provider, {
        value: {
          prefixCls
        }
      }, groupInfo.title?.(groupInfo.name, {
        components: {
          GroupTitle: conversations_GroupTitle
        }
      }) || /*#__PURE__*/external_React_default().createElement(conversations_GroupTitle, {
        key: groupInfo.name
      }, groupInfo.name)), /*#__PURE__*/external_React_default().createElement("ul", {
        className: `${prefixCls}-list`
      }, convItems));
    }
    return convItems;
  })));
};
if (false) {}
/* harmony default export */ var conversations = (Conversations);
;// CONCATENATED MODULE: ./components/prompts/style/index.ts




// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const genPromptsStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      // ======================== Prompt ========================
      '&, & *': {
        boxSizing: 'border-box'
      },
      maxWidth: '100%',
      [`&${componentCls}-rtl`]: {
        direction: 'rtl'
      },
      [`& ${componentCls}-title`]: {
        marginBlockStart: 0,
        fontWeight: 'normal',
        color: token.colorTextTertiary
      },
      [`& ${componentCls}-list`]: {
        display: 'flex',
        gap: token.paddingSM,
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        listStyle: 'none',
        paddingInlineStart: 0,
        marginBlock: 0,
        alignItems: 'stretch',
        '&-wrap': {
          flexWrap: 'wrap'
        },
        '&-vertical': {
          flexDirection: 'column',
          alignItems: 'flex-start'
        }
      },
      // ========================= Item =========================
      [`${componentCls}-item`]: {
        flex: 'none',
        display: 'flex',
        gap: token.paddingXS,
        height: 'auto',
        paddingBlock: token.paddingSM,
        paddingInline: token.padding,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        transition: ['border', 'background'].map(p => `${p} ${token.motionDurationSlow}`).join(','),
        border: `${(0,external_antdCssinjs_.unit)(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
        [`&:not(${componentCls}-item-has-nest)`]: {
          '&:hover': {
            cursor: 'pointer',
            background: token.colorFillTertiary
          },
          '&:active': {
            background: token.colorFill
          }
        },
        [`${componentCls}-content`]: {
          flex: 'auto',
          minWidth: 0,
          display: 'flex',
          gap: token.paddingXXS,
          flexDirection: 'column',
          alignItems: 'flex-start'
        },
        [`${componentCls}-icon, ${componentCls}-label, ${componentCls}-desc`]: {
          margin: 0,
          padding: 0,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          textAlign: 'start',
          whiteSpace: 'normal'
        },
        [`${componentCls}-label`]: {
          color: token.colorTextHeading,
          fontWeight: 500
        },
        [`${componentCls}-label + ${componentCls}-desc`]: {
          color: token.colorTextTertiary
        },
        // Disabled
        [`&${componentCls}-item-disabled`]: {
          pointerEvents: 'none',
          background: token.colorBgContainerDisabled,
          [`${componentCls}-label, ${componentCls}-desc`]: {
            color: token.colorTextTertiary
          }
        }
      }
    }
  };
};
const genNestStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      // ========================= Parent =========================
      [`${componentCls}-item-has-nest`]: {
        [`> ${componentCls}-content`]: {
          // gap: token.paddingSM,

          [`> ${componentCls}-label`]: {
            fontSize: token.fontSizeLG,
            lineHeight: token.lineHeightLG
          }
        }
      },
      // ========================= Nested =========================
      [`&${componentCls}-nested`]: {
        marginTop: token.paddingXS,
        // ======================== Prompt ========================
        alignSelf: 'stretch',
        [`${componentCls}-list`]: {
          alignItems: 'stretch'
        },
        // ========================= Item =========================
        [`${componentCls}-item`]: {
          border: 0,
          background: token.colorFillQuaternary
        }
      }
    }
  };
};
const prompts_style_prepareComponentToken = () => ({});
/* harmony default export */ var prompts_style = (genStyleHooks('Prompts', token => {
  const compToken = statistic_merge(token, {});
  return [genPromptsStyle(compToken), genNestStyle(compToken)];
}, prompts_style_prepareComponentToken));
;// CONCATENATED MODULE: ./components/prompts/index.tsx







const Prompts = props => {
  const {
    prefixCls: customizePrefixCls,
    title,
    className,
    items,
    onItemClick,
    vertical,
    wrap,
    rootClassName,
    styles = {},
    classNames = {},
    style,
    ...htmlProps
  } = props;

  // ============================ PrefixCls ============================
  const {
    getPrefixCls,
    direction
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('prompts', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = use_x_component_config('prompts');

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = prompts_style(prefixCls);
  const mergedCls = classnames_default()(prefixCls, contextConfig.className, className, rootClassName, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl'
  });
  const mergedListCls = classnames_default()(`${prefixCls}-list`, contextConfig.classNames.list, classNames.list, {
    [`${prefixCls}-list-wrap`]: wrap
  }, {
    [`${prefixCls}-list-vertical`]: vertical
  });

  // ============================ Render ============================
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement("div", extends_default()({}, htmlProps, {
    className: mergedCls,
    style: {
      ...style,
      ...contextConfig.style
    }
  }), title && /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Title, {
    level: 5,
    className: classnames_default()(`${prefixCls}-title`, contextConfig.classNames.title, classNames.title),
    style: {
      ...contextConfig.styles.title,
      ...styles.title
    }
  }, title), /*#__PURE__*/external_React_default().createElement("div", {
    className: mergedListCls,
    style: {
      ...contextConfig.styles.list,
      ...styles.list
    }
  }, items?.map((info, index) => {
    const isNest = info.children && info.children.length > 0;
    return /*#__PURE__*/external_React_default().createElement("div", {
      key: info.key || `key_${index}`,
      style: {
        ...contextConfig.styles.item,
        ...styles.item
      },
      className: classnames_default()(`${prefixCls}-item`, contextConfig.classNames.item, classNames.item, {
        [`${prefixCls}-item-disabled`]: info.disabled,
        [`${prefixCls}-item-has-nest`]: isNest
      }),
      onClick: () => {
        if (!isNest && onItemClick) {
          onItemClick({
            data: info
          });
        }
      }
    }, info.icon && /*#__PURE__*/external_React_default().createElement("div", {
      className: `${prefixCls}-icon`
    }, info.icon), /*#__PURE__*/external_React_default().createElement("div", {
      className: classnames_default()(`${prefixCls}-content`, contextConfig.classNames.itemContent, classNames.itemContent),
      style: {
        ...contextConfig.styles.itemContent,
        ...styles.itemContent
      }
    }, info.label && /*#__PURE__*/external_React_default().createElement("h6", {
      className: `${prefixCls}-label`
    }, info.label), info.description && /*#__PURE__*/external_React_default().createElement("p", {
      className: `${prefixCls}-desc`
    }, info.description), isNest && /*#__PURE__*/external_React_default().createElement(Prompts, {
      className: `${prefixCls}-nested`,
      items: info.children,
      vertical: true,
      onItemClick: onItemClick,
      classNames: {
        list: classNames.subList,
        item: classNames.subItem
      },
      styles: {
        list: styles.subList,
        item: styles.subItem
      }
    })));
  }))));
};
if (false) {}
/* harmony default export */ var prompts = (Prompts);
;// CONCATENATED MODULE: ./components/_util/motion.ts


// ================== Collapse Motion ==================
const getCollapsedHeight = () => ({
  height: 0,
  opacity: 0
});
const getRealHeight = node => {
  const {
    scrollHeight
  } = node;
  return {
    height: scrollHeight,
    opacity: 1
  };
};
const getCurrentHeight = node => ({
  height: node ? node.offsetHeight : 0
});
const skipOpacityTransition = (_, event) => event?.deadline === true || event.propertyName === 'height';
const initCollapseMotion = (rootCls = defaultPrefixCls) => ({
  motionName: `${rootCls}-motion-collapse`,
  onAppearStart: getCollapsedHeight,
  onEnterStart: getCollapsedHeight,
  onAppearActive: getRealHeight,
  onEnterActive: getRealHeight,
  onLeaveStart: getCurrentHeight,
  onLeaveActive: getCollapsedHeight,
  onAppearEnd: skipOpacityTransition,
  onEnterEnd: skipOpacityTransition,
  onLeaveEnd: skipOpacityTransition,
  motionDeadline: 500
});
/* harmony default export */ var motion = (initCollapseMotion);
;// CONCATENATED MODULE: ./components/thought-chain/hooks/useCollapsible.ts



const useCollapsible = (collapsible, prefixCls, rootPrefixCls) => {
  // ============================ Collapsible ============================
  const [enableCollapse, customizeExpandedKeys, customizeOnExpand] = external_React_default().useMemo(() => {
    let baseConfig = {
      expandedKeys: [],
      onExpand: () => {}
    };
    if (!collapsible) {
      return [false, baseConfig.expandedKeys, baseConfig.onExpand];
    }
    if (typeof collapsible === 'object') {
      baseConfig = {
        ...baseConfig,
        ...collapsible
      };
    }
    return [true, baseConfig.expandedKeys, baseConfig.onExpand];
  }, [collapsible]);

  // ============================ ExpandedKeys ============================
  const [mergedExpandedKeys, setMergedExpandedKeys] = (0,hooks_useMergedState/* default */.Z)(customizeExpandedKeys);

  // ============================ Event ============================
  const onItemExpand = curKey => {
    setMergedExpandedKeys(preKeys => {
      const keys = preKeys.includes(curKey) ? preKeys.filter(key => key !== curKey) : [...preKeys, curKey];
      customizeOnExpand?.(keys);
      return keys;
    });
  };

  // ============================ Motion ============================
  const collapseMotion = external_React_default().useMemo(() => {
    if (!enableCollapse) return {};
    return {
      ...motion(rootPrefixCls),
      motionAppear: false,
      leavedClassName: `${prefixCls}-content-hidden`
    };
  }, [rootPrefixCls, prefixCls, enableCollapse]);

  // ============================ Return ============================
  return [enableCollapse, mergedExpandedKeys, enableCollapse ? onItemExpand : undefined, collapseMotion];
};
/* harmony default export */ var hooks_useCollapsible = (useCollapsible);
;// CONCATENATED MODULE: ./node_modules/antd/es/style/motion/collapse.js
const genCollapseMotion = token => ({
  [token.componentCls]: {
    // For common/openAnimation
    [`${token.antCls}-motion-collapse-legacy`]: {
      overflow: 'hidden',
      '&-active': {
        transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`
      }
    },
    [`${token.antCls}-motion-collapse`]: {
      overflow: 'hidden',
      transition: `height ${token.motionDurationMid} ${token.motionEaseInOut},
        opacity ${token.motionDurationMid} ${token.motionEaseInOut} !important`
    }
  }
});
/* harmony default export */ var collapse = (genCollapseMotion);
;// CONCATENATED MODULE: ./components/thought-chain/Item.tsx







let THOUGHT_CHAIN_ITEM_STATUS = /*#__PURE__*/function (THOUGHT_CHAIN_ITEM_STATUS) {
  THOUGHT_CHAIN_ITEM_STATUS["PENDING"] = "pending";
  THOUGHT_CHAIN_ITEM_STATUS["SUCCESS"] = "success";
  THOUGHT_CHAIN_ITEM_STATUS["ERROR"] = "error";
  return THOUGHT_CHAIN_ITEM_STATUS;
}({});
const ThoughtChainNodeContext = /*#__PURE__*/external_React_default().createContext(null);
const ThoughtChainNode = props => {
  const {
    info = {},
    nextStatus,
    onClick,
    ...restProps
  } = props;
  const domProps = (0,pickAttrs/* default */.Z)(restProps, {
    attr: true,
    aria: true,
    data: true
  });

  // ================= ThoughtChainNodeContext ====================
  const {
    prefixCls,
    collapseMotion,
    enableCollapse,
    expandedKeys,
    direction,
    classNames = {},
    styles = {}
  } = external_React_default().useContext(ThoughtChainNodeContext);

  // ============================ Info ============================
  const id = external_React_default().useId();
  const {
    key = id,
    icon,
    title,
    extra,
    content,
    footer,
    status,
    description
  } = info;

  // ============================ Style ============================
  const itemCls = `${prefixCls}-item`;

  // ============================ Event ============================
  const onThoughtChainNodeClick = () => onClick?.(key);

  // ============================ Content Open ============================
  const contentOpen = expandedKeys?.includes(key);

  // ============================ Render ============================
  return /*#__PURE__*/external_React_default().createElement("div", extends_default()({}, domProps, {
    className: classnames_default()(itemCls, {
      [`${itemCls}-${status}${nextStatus ? `-${nextStatus}` : ''}`]: status
    }, props.className),
    style: props.style
  }), /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(`${itemCls}-header`, classNames.itemHeader),
    style: styles.itemHeader,
    onClick: onThoughtChainNodeClick
  }, /*#__PURE__*/external_React_default().createElement(external_antd_.Avatar, {
    icon: icon,
    className: `${itemCls}-icon`
  }), /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(`${itemCls}-header-box`, {
      [`${itemCls}-collapsible`]: enableCollapse && content
    })
  }, /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Text, {
    strong: true,
    ellipsis: {
      tooltip: {
        placement: direction === 'rtl' ? 'topRight' : 'topLeft',
        title
      }
    },
    className: `${itemCls}-title`
  }, enableCollapse && content && (direction === 'rtl' ? /*#__PURE__*/external_React_default().createElement(icons_LeftOutlined, {
    className: `${itemCls}-collapse-icon`,
    rotate: contentOpen ? -90 : 0
  }) : /*#__PURE__*/external_React_default().createElement(icons_RightOutlined, {
    className: `${itemCls}-collapse-icon`,
    rotate: contentOpen ? 90 : 0
  })), title), description && /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Text, {
    className: `${itemCls}-desc`,
    ellipsis: {
      tooltip: {
        placement: direction === 'rtl' ? 'topRight' : 'topLeft',
        title: description
      }
    },
    type: "secondary"
  }, description)), extra && /*#__PURE__*/external_React_default().createElement("div", {
    className: `${itemCls}-extra`
  }, extra)), content && /*#__PURE__*/external_React_default().createElement(es, extends_default()({}, collapseMotion, {
    visible: enableCollapse ? contentOpen : true
  }), ({
    className: motionClassName,
    style
  }, motionRef) => /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(`${itemCls}-content`, motionClassName),
    ref: motionRef,
    style: style
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(`${itemCls}-content-box`, classNames.itemContent),
    style: styles.itemContent
  }, content))), footer && /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(`${itemCls}-footer`, classNames.itemFooter),
    style: styles.itemFooter
  }, footer));
};
/* harmony default export */ var thought_chain_Item = (ThoughtChainNode);
;// CONCATENATED MODULE: ./components/thought-chain/style/index.ts






// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const genThoughtChainItemStatusStyle = token => {
  const {
    componentCls
  } = token;
  const itemCls = `${componentCls}-item`;
  const colors = {
    [THOUGHT_CHAIN_ITEM_STATUS.PENDING]: token.colorPrimaryText,
    [THOUGHT_CHAIN_ITEM_STATUS.SUCCESS]: token.colorSuccessText,
    [THOUGHT_CHAIN_ITEM_STATUS.ERROR]: token.colorErrorText
  };
  const statuses = Object.keys(colors);
  return statuses.reduce((acc, status) => {
    const statusColor = colors[status];
    statuses.forEach(nextStatus => {
      const itemStatusCls = `& ${itemCls}-${status}-${nextStatus}`;
      const lastBeforePseudoStyle = status === nextStatus ? {} : {
        backgroundColor: 'none !important',
        backgroundImage: `linear-gradient(${statusColor}, ${colors[nextStatus]})`
      };
      acc[itemStatusCls] = {
        [`& ${itemCls}-icon, & > *::before`]: {
          backgroundColor: `${statusColor} !important`
        },
        '& > :last-child::before': lastBeforePseudoStyle
      };
    });
    return acc;
  }, {});
};
const genThoughtChainItemBeforePseudoStyle = token => {
  const {
    calc,
    componentCls
  } = token;
  const itemCls = `${componentCls}-item`;
  const beforePseudoBaseStyle = {
    content: '""',
    width: calc(token.lineWidth).mul(2).equal(),
    display: 'block',
    position: 'absolute',
    insetInlineEnd: 'none',
    backgroundColor: token.colorTextPlaceholder
  };
  return {
    '& > :last-child > :last-child': {
      '&::before': {
        display: 'none !important'
      },
      [`&${itemCls}-footer`]: {
        '&::before': {
          display: 'block !important',
          bottom: 0
        }
      }
    },
    [`& > ${itemCls}`]: {
      [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
        position: 'relative',
        '&::before': {
          bottom: `${token.calc(token.itemGap).mul(-1).equal()}`
        }
      },
      [`& ${itemCls}-header, & ${itemCls}-content`]: {
        marginInlineStart: calc(token.itemSize).mul(-1).equal(),
        '&::before': {
          ...beforePseudoBaseStyle,
          insetInlineStart: calc(token.itemSize).div(2).sub(token.lineWidth).equal()
        }
      },
      [`& ${itemCls}-header::before`]: {
        top: token.itemSize,
        bottom: `${token.calc(token.itemGap).mul(-2).equal()}`
      },
      [`& ${itemCls}-content::before`]: {
        top: '100%'
      },
      [`& ${itemCls}-footer::before`]: {
        ...beforePseudoBaseStyle,
        top: 0,
        insetInlineStart: calc(token.itemSize).div(-2).sub(token.lineWidth).equal()
      }
    }
  };
};
const genThoughtChainItemStyle = token => {
  const {
    componentCls
  } = token;
  const itemCls = `${componentCls}-item`;
  return {
    [itemCls]: {
      display: 'flex',
      flexDirection: 'column',
      [`& ${itemCls}-collapsible`]: {
        cursor: 'pointer'
      },
      [`& ${itemCls}-header`]: {
        display: 'flex',
        marginBottom: token.itemGap,
        gap: token.itemGap,
        alignItems: 'flex-start',
        [`& ${itemCls}-icon`]: {
          height: token.itemSize,
          width: token.itemSize,
          fontSize: token.itemFontSize
        },
        [`& ${itemCls}-extra`]: {
          height: token.itemSize,
          maxHeight: token.itemSize
        },
        [`& ${itemCls}-header-box`]: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          [`& ${itemCls}-title`]: {
            height: token.itemSize,
            lineHeight: token.itemSize,
            maxHeight: token.itemSize,
            fontSize: token.itemFontSize,
            [`& ${itemCls}-collapse-icon`]: {
              marginInlineEnd: token.marginXS
            }
          },
          [`& ${itemCls}-desc`]: {
            fontSize: token.itemFontSize
          }
        }
      },
      [`& ${itemCls}-content`]: {
        [`& ${itemCls}-content-hidden`]: {
          display: 'none'
        },
        [`& ${itemCls}-content-box`]: {
          padding: token.itemGap,
          display: 'inline-block',
          maxWidth: `calc(100% - ${token.itemSize})`,
          borderRadius: token.borderRadiusLG,
          backgroundColor: token.colorBgContainer,
          border: `${(0,external_antdCssinjs_.unit)(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`
        }
      },
      [`& ${itemCls}-footer`]: {
        marginTop: token.itemGap,
        display: 'inline-flex'
      }
    }
  };
};
const genThoughtChainSizeStyle = (token, size = 'middle') => {
  const {
    componentCls
  } = token;
  const sizeTokens = {
    large: {
      itemSize: token.itemSizeLG,
      itemGap: token.itemGapLG,
      itemFontSize: token.itemFontSizeLG
    },
    middle: {
      itemSize: token.itemSize,
      itemGap: token.itemGap,
      itemFontSize: token.itemFontSize
    },
    small: {
      itemSize: token.itemSizeSM,
      itemGap: token.itemGapSM,
      itemFontSize: token.itemFontSizeSM
    }
  }[size];
  return {
    [`&${componentCls}-${size}`]: {
      paddingInlineStart: sizeTokens.itemSize,
      gap: sizeTokens.itemGap,
      ...genThoughtChainItemStyle({
        ...token,
        ...sizeTokens
      }),
      ...genThoughtChainItemBeforePseudoStyle({
        ...token,
        ...sizeTokens
      })
    }
  };
};
const genThoughtChainStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      ...genThoughtChainItemStatusStyle(token),
      ...genThoughtChainSizeStyle(token),
      ...genThoughtChainSizeStyle(token, 'large'),
      ...genThoughtChainSizeStyle(token, 'small'),
      [`&${componentCls}-rtl`]: {
        direction: 'rtl'
      }
    }
  };
};
/* harmony default export */ var thought_chain_style = (genStyleHooks('ThoughtChain', token => {
  const compToken = statistic_merge(token, {
    // small size tokens
    itemFontSizeSM: token.fontSizeSM,
    itemSizeSM: token.calc(token.controlHeightXS).add(token.controlHeightSM).div(2).equal(),
    itemGapSM: token.marginSM,
    // default size tokens
    itemFontSize: token.fontSize,
    itemSize: token.calc(token.controlHeightSM).add(token.controlHeight).div(2).equal(),
    itemGap: token.margin,
    // large size tokens
    itemFontSizeLG: token.fontSizeLG,
    itemSizeLG: token.calc(token.controlHeight).add(token.controlHeightLG).div(2).equal(),
    itemGapLG: token.marginLG
  });
  return [genThoughtChainStyle(compToken), collapse(compToken)];
}));
;// CONCATENATED MODULE: ./components/thought-chain/index.tsx









const ThoughtChain = props => {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    items,
    collapsible,
    styles = {},
    style,
    classNames = {},
    size = 'middle',
    ...restProps
  } = props;
  const domProps = (0,pickAttrs/* default */.Z)(restProps, {
    attr: true,
    aria: true,
    data: true
  });

  // ============================ Prefix ============================
  const {
    getPrefixCls,
    direction
  } = use_x_provider_context();
  const rootPrefixCls = getPrefixCls();
  const prefixCls = getPrefixCls('thought-chain', customizePrefixCls);

  // ===================== Component Config =========================
  const contextConfig = use_x_component_config('thoughtChain');

  // ============================ UseCollapsible ============================
  const [enableCollapse, expandedKeys, onItemExpand, collapseMotion] = hooks_useCollapsible(collapsible, prefixCls, rootPrefixCls);

  // ============================ Style ============================
  const [wrapCSSVar, hashId, cssVarCls] = thought_chain_style(prefixCls);
  const mergedCls = classnames_default()(className, rootClassName, prefixCls, contextConfig.className, hashId, cssVarCls, {
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, `${prefixCls}-${size}`);

  // ============================ Render ============================
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement("div", extends_default()({}, domProps, {
    className: mergedCls,
    style: {
      ...contextConfig.style,
      ...style
    }
  }), /*#__PURE__*/external_React_default().createElement(ThoughtChainNodeContext.Provider, {
    value: {
      prefixCls,
      enableCollapse,
      collapseMotion,
      expandedKeys,
      direction,
      classNames: {
        itemHeader: classnames_default()(contextConfig.classNames.itemHeader, classNames.itemHeader),
        itemContent: classnames_default()(contextConfig.classNames.itemContent, classNames.itemContent),
        itemFooter: classnames_default()(contextConfig.classNames.itemFooter, classNames.itemFooter)
      },
      styles: {
        itemHeader: {
          ...contextConfig.styles.itemHeader,
          ...styles.itemHeader
        },
        itemContent: {
          ...contextConfig.styles.itemContent,
          ...styles.itemContent
        },
        itemFooter: {
          ...contextConfig.styles.itemFooter,
          ...styles.itemFooter
        }
      }
    }
  }, items?.map((item, index) => /*#__PURE__*/external_React_default().createElement(thought_chain_Item, {
    key: item.key || `key_${index}`,
    className: classnames_default()(contextConfig.classNames.item, classNames.item),
    style: {
      ...contextConfig.styles.item,
      ...styles.item
    },
    info: {
      ...item,
      icon: item.icon || index + 1
    },
    onClick: onItemExpand,
    nextStatus: items[index + 1]?.status || item.status
  })))));
};
if (false) {}
/* harmony default export */ var thought_chain = (ThoughtChain);
;// CONCATENATED MODULE: ./components/suggestion/style/index.ts



// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const genSuggestionStyle = token => {
  const {
    componentCls,
    antCls
  } = token;
  return {
    [componentCls]: {
      [`${antCls}-cascader-menus ${antCls}-cascader-menu`]: {
        height: 'auto'
      },
      [`${componentCls}-item`]: {
        '&-icon': {
          marginInlineEnd: token.paddingXXS
        },
        '&-extra': {
          marginInlineStart: token.padding
        }
      },
      [`&${componentCls}-block`]: {
        [`${componentCls}-item-extra`]: {
          marginInlineStart: 'auto'
        }
      }
    }
  };
};
const suggestion_style_prepareComponentToken = () => ({});
/* harmony default export */ var suggestion_style = (genStyleHooks('Suggestion', token => {
  const SuggestionToken = statistic_merge(token, {});
  return genSuggestionStyle(SuggestionToken);
}, suggestion_style_prepareComponentToken));
;// CONCATENATED MODULE: ./components/suggestion/useActive.ts



/**
 * Since Cascader not support ref active, we use `value` to mock the active item.
 */
function useActive(items, open, rtl, onSelect, onCancel) {
  const [activePaths, setActivePaths] = external_React_default().useState([]);

  /** Get items by column index */
  const getItems = (colIndex, paths = activePaths) => {
    let currentItems = items;
    for (let i = 0; i < colIndex - 1; i += 1) {
      const activePath = paths[i];
      const activeItem = currentItems.find(item => item.value === activePath);
      if (!activeItem) {
        break;
      }
      currentItems = activeItem.children || [];
    }
    return currentItems;
  };
  const getValues = paths => {
    return paths.map((path, index) => {
      const currentItems = getItems(index + 1, paths);
      const currentItem = currentItems.find(item => item.value === path);
      return currentItem?.value;
    });
  };
  const offsetRow = offset => {
    const currentColIndex = activePaths.length || 1;
    const currentItems = getItems(currentColIndex);
    const currentRowIndex = currentItems.findIndex(item => item.value === activePaths[currentColIndex - 1]);
    const itemCount = currentItems.length;
    const nextItem = currentItems[(currentRowIndex + offset + itemCount) % itemCount];
    setActivePaths([...activePaths.slice(0, currentColIndex - 1), nextItem.value]);
  };
  const offsetPrev = () => {
    if (activePaths.length > 1) {
      setActivePaths(activePaths.slice(0, activePaths.length - 1));
    }
  };
  const offsetNext = () => {
    const nextItems = getItems(activePaths.length + 1);
    if (nextItems.length) {
      setActivePaths([...activePaths, nextItems[0].value]);
    }
  };
  const onKeyDown = useEvent(e => {
    if (!open) {
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        offsetRow(1);
        e.preventDefault();
        break;
      case 'ArrowUp':
        offsetRow(-1);
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (rtl) {
          offsetPrev();
        } else {
          offsetNext();
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        if (rtl) {
          offsetNext();
        } else {
          offsetPrev();
        }
        e.preventDefault();
        break;
      case 'Enter':
        // Submit if not have children
        if (!getItems(activePaths.length + 1).length) {
          onSelect(getValues(activePaths));
        }
        e.preventDefault();
        break;
      case 'Escape':
        onCancel();
        e.preventDefault();
        break;
    }
  });
  external_React_default().useEffect(() => {
    if (open) {
      setActivePaths([items[0].value]);
    }
  }, [open]);
  return [activePaths, onKeyDown];
}
;// CONCATENATED MODULE: ./components/suggestion/index.tsx








function Suggestion(props) {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    children,
    open,
    onOpenChange,
    items,
    onSelect,
    block
  } = props;

  // ============================= MISC =============================
  const {
    direction,
    getPrefixCls
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('suggestion', customizePrefixCls);
  const itemCls = `${prefixCls}-item`;
  const isRTL = direction === 'rtl';

  // ===================== Component Config =========================
  const contextConfig = use_x_component_config('suggestion');

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = suggestion_style(prefixCls);

  // =========================== Trigger ============================
  const [mergedOpen, setOpen] = useMergedState(false, {
    value: open
  });
  const [info, setInfo] = (0,external_React_.useState)();
  const triggerOpen = nextOpen => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  const onTrigger = useEvent(nextInfo => {
    if (nextInfo === false) {
      triggerOpen(false);
    } else {
      setInfo(nextInfo);
      triggerOpen(true);
    }
  });
  const onClose = () => {
    triggerOpen(false);
  };

  // ============================ Items =============================
  const itemList = external_React_default().useMemo(() => typeof items === 'function' ? items(info) : items, [items, info]);

  // =========================== Cascader ===========================
  const optionRender = node => {
    return /*#__PURE__*/external_React_default().createElement(external_antd_.Flex, {
      className: itemCls
    }, node.icon && /*#__PURE__*/external_React_default().createElement("div", {
      className: `${itemCls}-icon`
    }, node.icon), node.label, node.extra && /*#__PURE__*/external_React_default().createElement("div", {
      className: `${itemCls}-extra`
    }, node.extra));
  };
  const onInternalChange = valuePath => {
    if (onSelect) {
      onSelect(valuePath[valuePath.length - 1]);
    }
    triggerOpen(false);
  };

  // ============================= a11y =============================
  const [activePath, onKeyDown] = useActive(itemList, mergedOpen, isRTL, onInternalChange, onClose);

  // =========================== Children ===========================
  const childNode = children?.({
    onTrigger,
    onKeyDown
  });

  // ============================ Render ============================
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement(external_antd_.Cascader, {
    options: itemList,
    open: mergedOpen,
    value: activePath,
    placement: isRTL ? 'topRight' : 'topLeft',
    onDropdownVisibleChange: nextOpen => {
      if (!nextOpen) {
        onClose();
      }
    },
    optionRender: optionRender,
    rootClassName: classnames_default()(rootClassName, prefixCls, hashId, cssVarCls, {
      [`${prefixCls}-block`]: block
    }),
    onChange: onInternalChange,
    dropdownMatchSelectWidth: block
  }, /*#__PURE__*/external_React_default().createElement("div", {
    className: classnames_default()(prefixCls, contextConfig.className, rootClassName, className, `${prefixCls}-wrapper`, hashId, cssVarCls),
    style: {
      ...contextConfig.style,
      ...style
    }
  }, childNode)));
}
if (false) {}
/* harmony default export */ var suggestion = (Suggestion);
;// CONCATENATED MODULE: ./components/welcome/style/index.ts



// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default

const genWelcomeStyle = token => {
  const {
    componentCls,
    calc
  } = token;
  const titleHeight = calc(token.fontSizeHeading3).mul(token.lineHeightHeading3).equal();
  const descHeight = calc(token.fontSize).mul(token.lineHeight).equal();
  return {
    [componentCls]: {
      gap: token.padding,
      // ======================== Icon ========================
      [`${componentCls}-icon`]: {
        height: calc(titleHeight).add(descHeight).add(token.paddingXXS).equal(),
        display: 'flex',
        img: {
          height: '100%'
        }
      },
      // ==================== Content Wrap ====================
      [`${componentCls}-content-wrapper`]: {
        gap: token.paddingXS,
        flex: 'auto',
        minWidth: 0,
        [`${componentCls}-title-wrapper`]: {
          gap: token.paddingXS
        },
        [`${componentCls}-title`]: {
          margin: 0
        },
        [`${componentCls}-extra`]: {
          marginInlineStart: 'auto'
        }
      }
    }
  };
};
const style_genVariantStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [componentCls]: {
      // ======================== Filled ========================
      '&-filled': {
        paddingInline: token.padding,
        paddingBlock: token.paddingSM,
        background: token.colorFillContent,
        borderRadius: token.borderRadiusLG
      },
      // ====================== Borderless ======================
      '&-borderless': {
        [`${componentCls}-title`]: {
          fontSize: token.fontSizeHeading3,
          lineHeight: token.lineHeightHeading3
        }
      }
    }
  };
};
const welcome_style_prepareComponentToken = () => ({});
/* harmony default export */ var welcome_style = (genStyleHooks('Welcome', token => {
  const compToken = statistic_merge(token, {});
  return [genWelcomeStyle(compToken), style_genVariantStyle(compToken)];
}, welcome_style_prepareComponentToken));
;// CONCATENATED MODULE: ./components/welcome/index.tsx






function Welcome(props, ref) {
  const {
    prefixCls: customizePrefixCls,
    rootClassName,
    className,
    style,
    variant = 'filled',
    // Semantic
    classNames = {},
    styles = {},
    // Layout
    icon,
    title,
    description,
    extra
  } = props;

  // ============================= MISC =============================
  const {
    direction,
    getPrefixCls
  } = use_x_provider_context();
  const prefixCls = getPrefixCls('welcome', customizePrefixCls);

  // ======================= Component Config =======================
  const contextConfig = use_x_component_config('welcome');

  // ============================ Styles ============================
  const [wrapCSSVar, hashId, cssVarCls] = welcome_style(prefixCls);

  // ============================= Icon =============================
  const iconNode = external_React_default().useMemo(() => {
    if (!icon) {
      return null;
    }
    let iconEle = icon;
    if (typeof icon === 'string' && icon.startsWith('http')) {
      iconEle = /*#__PURE__*/external_React_default().createElement("img", {
        src: icon,
        alt: "icon"
      });
    }
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: classnames_default()(`${prefixCls}-icon`, contextConfig.classNames.icon, classNames.icon),
      style: styles.icon
    }, iconEle);
  }, [icon]);
  const titleNode = external_React_default().useMemo(() => {
    if (!title) {
      return null;
    }
    return /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Title, {
      level: 4,
      className: classnames_default()(`${prefixCls}-title`, contextConfig.classNames.title, classNames.title),
      style: styles.title
    }, title);
  }, [title]);
  const extraNode = external_React_default().useMemo(() => {
    if (!extra) {
      return null;
    }
    return /*#__PURE__*/external_React_default().createElement("div", {
      className: classnames_default()(`${prefixCls}-extra`, contextConfig.classNames.extra, classNames.extra),
      style: styles.extra
    }, extra);
  }, [extra]);

  // ============================ Render ============================
  return wrapCSSVar( /*#__PURE__*/external_React_default().createElement(external_antd_.Flex, {
    ref: ref,
    className: classnames_default()(prefixCls, contextConfig.className, className, rootClassName, hashId, cssVarCls, `${prefixCls}-${variant}`, {
      [`${prefixCls}-rtl`]: direction === 'rtl'
    }),
    style: style
  }, iconNode, /*#__PURE__*/external_React_default().createElement(external_antd_.Flex, {
    vertical: true,
    className: `${prefixCls}-content-wrapper`
  }, extra ? /*#__PURE__*/external_React_default().createElement(external_antd_.Flex, {
    align: "flex-start",
    className: `${prefixCls}-title-wrapper`
  }, titleNode, extraNode) : titleNode, description && /*#__PURE__*/external_React_default().createElement(external_antd_.Typography.Text, {
    className: classnames_default()(`${prefixCls}-description`, contextConfig.classNames.description, classNames.description),
    style: styles.description
  }, description))));
}
const ForwardWelcome = /*#__PURE__*/external_React_default().forwardRef(Welcome);
if (false) {}
/* harmony default export */ var welcome = (ForwardWelcome);
;// CONCATENATED MODULE: ./components/x-provider/index.tsx





const XProvider = props => {
  const {
    attachments,
    bubble,
    conversations,
    prompts,
    sender,
    suggestion,
    thoughtChain,
    welcome,
    theme,
    ...antdConfProps
  } = props;
  const {
    theme: parentTheme
  } = use_x_provider_context();
  const xProviderProps = external_React_default().useMemo(() => {
    return {
      attachments,
      bubble,
      conversations,
      prompts,
      sender,
      suggestion,
      thoughtChain,
      welcome
    };
  }, [attachments, bubble, conversations, prompts, sender, suggestion, thoughtChain, welcome]);
  const mergedTheme = external_React_default().useMemo(() => {
    const concatTheme = {
      ...parentTheme,
      ...theme
    };
    return concatTheme;
  }, [parentTheme, theme]);
  return /*#__PURE__*/external_React_default().createElement(context.Provider, {
    value: xProviderProps
  }, /*#__PURE__*/external_React_default().createElement(external_antd_.ConfigProvider, extends_default()({}, antdConfProps, {
    // Note:  we can not set `cssVar` by default.
    //        Since when developer not wrap with XProvider,
    //        the generate css is still using css var but no css var injected.
    // Origin comment: antdx enable cssVar by default, and antd v6 will enable cssVar by default
    // theme={{ cssVar: true, ...antdConfProps?.theme }}
    theme: mergedTheme
  })));
};

if (false) {}
/* harmony default export */ var x_provider = (XProvider);
;// CONCATENATED MODULE: ./components/useXChat/useSyncState.ts

function useSyncState_useSyncState(defaultValue) {
  const [state, setState] = external_React_default().useState(defaultValue);
  const stateRef = external_React_default().useRef(state);
  stateRef.current = state;
  const getState = external_React_default().useCallback(() => stateRef.current, []);
  return [state, setState, getState];
}
;// CONCATENATED MODULE: ./components/useXChat/index.ts



function toArray(item) {
  return Array.isArray(item) ? item : [item];
}
function useXChat(config) {
  const {
    defaultMessages,
    agent,
    requestFallback,
    requestPlaceholder,
    parser
  } = config;

  // ========================= Agent Messages =========================
  const idRef = external_React_default().useRef(0);
  const [messages, setMessages, getMessages] = useSyncState_useSyncState(() => (defaultMessages || []).map((info, index) => ({
    id: `default_${index}`,
    status: 'local',
    ...info
  })));
  const createMessage = (message, status) => {
    const msg = {
      id: `msg_${idRef.current}`,
      message,
      status
    };
    idRef.current += 1;
    return msg;
  };

  // ========================= BubbleMessages =========================
  const parsedMessages = external_React_default().useMemo(() => {
    const list = [];
    messages.forEach(agentMsg => {
      const rawParsedMsg = parser ? parser(agentMsg.message) : agentMsg.message;
      const bubbleMsgs = toArray(rawParsedMsg);
      bubbleMsgs.forEach((bubbleMsg, bubbleMsgIndex) => {
        let key = agentMsg.id;
        if (bubbleMsgs.length > 1) {
          key = `${key}_${bubbleMsgIndex}`;
        }
        list.push({
          id: key,
          message: bubbleMsg,
          status: agentMsg.status
        });
      });
    });
    return list;
  }, [messages]);

  // ============================ Request =============================
  const getFilteredMessages = msgs => msgs.filter(info => info.status !== 'loading' && info.status !== 'error').map(info => info.message);

  // For agent to use. Will filter out loading and error message
  const getRequestMessages = () => getFilteredMessages(getMessages());
  const onRequest = useEvent(message => {
    if (!agent) throw new Error('The agent parameter is required when using the onRequest method in an agent generated by useXAgent.');
    let loadingMsgId = null;

    // Add placeholder message
    setMessages(ori => {
      let nextMessages = [...ori, createMessage(message, 'local')];
      if (requestPlaceholder) {
        let placeholderMsg;
        if (typeof requestPlaceholder === 'function') {
          // typescript has bug that not get real return type when use `typeof function` check
          placeholderMsg = requestPlaceholder(message, {
            messages: getFilteredMessages(nextMessages)
          });
        } else {
          placeholderMsg = requestPlaceholder;
        }
        const loadingMsg = createMessage(placeholderMsg, 'loading');
        loadingMsgId = loadingMsg.id;
        nextMessages = [...nextMessages, loadingMsg];
      }
      return nextMessages;
    });

    // Request
    let updatingMsgId = null;
    const updateMessage = (message, status) => {
      let msg = getMessages().find(info => info.id === updatingMsgId);
      if (!msg) {
        // Create if not exist
        msg = createMessage(message, status);
        setMessages(ori => {
          const oriWithoutPending = ori.filter(info => info.id !== loadingMsgId);
          return [...oriWithoutPending, msg];
        });
        updatingMsgId = msg.id;
      } else {
        // Update directly
        setMessages(ori => {
          return ori.map(info => {
            if (info.id === updatingMsgId) {
              return {
                ...info,
                message,
                status
              };
            }
            return info;
          });
        });
      }
      return msg;
    };
    agent.request({
      message,
      messages: getRequestMessages()
    }, {
      onUpdate: message => {
        updateMessage(message, 'loading');
      },
      onSuccess: message => {
        updateMessage(message, 'success');
      },
      onError: async error => {
        if (requestFallback) {
          let fallbackMsg;

          // Update as error
          if (typeof requestFallback === 'function') {
            // typescript has bug that not get real return type when use `typeof function` check
            fallbackMsg = await requestFallback(message, {
              error,
              messages: getRequestMessages()
            });
          } else {
            fallbackMsg = requestFallback;
          }
          setMessages(ori => [...ori.filter(info => info.id !== loadingMsgId && info.id !== updatingMsgId), createMessage(fallbackMsg, 'error')]);
        } else {
          // Remove directly
          setMessages(ori => {
            return ori.filter(info => info.id !== loadingMsgId && info.id !== updatingMsgId);
          });
        }
      }
    });
  });
  return {
    onRequest,
    messages,
    parsedMessages,
    setMessages
  };
}
;// CONCATENATED MODULE: ./components/x-stream/index.ts
/**
 * @description default separator for {@link splitStream}
 */
const DEFAULT_STREAM_SEPARATOR = '\n\n';
/**
 * @description Default separator for {@link splitPart}
 * @example "event: delta\ndata: {\"key\": \"value\"}"
 */
const DEFAULT_PART_SEPARATOR = '\n';
/**
 * @description Default separator for key value, A colon (`:`) is used to separate keys from values
 * @example "event: delta"
 */
const DEFAULT_KV_SEPARATOR = ':';

/**
 * Check if a string is not empty or only contains whitespace characters
 */
const isValidString = str => (str ?? '').trim() !== '';

/**
 * @description A TransformStream inst that splits a stream into parts based on {@link DEFAULT_STREAM_SEPARATOR}
 * @example
 *
 * `event: delta
 * data: { content: 'hello' }
 *
 * event: delta
 * data: { key: 'world!' }
 *
 * `
 */
function splitStream() {
  // Buffer to store incomplete data chunks between transformations
  let buffer = '';
  return new TransformStream({
    transform(streamChunk, controller) {
      buffer += streamChunk;

      // Split the buffer based on the separator
      const parts = buffer.split(DEFAULT_STREAM_SEPARATOR);

      // Enqueue all complete parts except for the last incomplete one
      parts.slice(0, -1).forEach(part => {
        // Skip empty parts
        if (isValidString(part)) {
          controller.enqueue(part);
        }
      });

      // Save the last incomplete part back to the buffer for the next chunk
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      // If there's any remaining data in the buffer, enqueue it as the final part
      if (isValidString(buffer)) {
        controller.enqueue(buffer);
      }
    }
  });
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#fields
 */

/**
 * @example
 * const sseObject = {
 *    event: 'delta',
 *    data: '{ key: "world!" }',
 * };
 */

/**
 * @description A TransformStream inst that transforms a part string into {@link SSEOutput}
 * @example part string
 *
 * "event: delta\ndata: { key: 'world!' }\n"
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 *
 * When handling responses with `Content-Type: text/event-stream`, the following standard practices are commonly observed:
 * - Double newline characters (`\n\n`) are used to separate individual events.
 * - Single newline characters (`\n`) are employed to separate line within an event.
 */
function splitPart() {
  return new TransformStream({
    transform(partChunk, controller) {
      // Split the chunk into key-value pairs using the partSeparator
      const lines = partChunk.split(DEFAULT_PART_SEPARATOR);
      const sseEvent = lines.reduce((acc, line) => {
        const separatorIndex = line.indexOf(DEFAULT_KV_SEPARATOR);
        if (separatorIndex === -1) {
          throw new Error(`The key-value separator "${DEFAULT_KV_SEPARATOR}" is not found in the sse line chunk!`);
        }

        // Extract the key from the beginning of the line up to the separator
        const key = line.slice(0, separatorIndex);

        // The colon is used for comment lines, skip directly
        if (!isValidString(key)) return acc;

        // Extract the value from the line after the separator
        const value = line.slice(separatorIndex + 1);
        return {
          ...acc,
          [key]: value
        };
      }, {});
      if (Object.keys(sseEvent).length === 0) return;

      // Reduce the key-value pairs into a single object and enqueue
      controller.enqueue(sseEvent);
    }
  });
}
/**
 * @description Transform Uint8Array binary stream to {@link SSEOutput} by default
 * @warning The `XStream` only support the `utf-8` encoding. More encoding support maybe in the future.
 */
async function* XStream(options) {
  const {
    readableStream,
    transformStream
  } = options;
  if (!(readableStream instanceof ReadableStream)) {
    throw new Error('The options.readableStream must be an instance of ReadableStream.');
  }

  // Default encoding is `utf-8`
  const decoderStream = new TextDecoderStream();
  const stream = transformStream ?
  /**
   * Uint8Array binary -> string -> Output
   */
  readableStream.pipeThrough(decoderStream).pipeThrough(transformStream) :
  /**
   * Uint8Array binary -> string -> SSE part string -> Default Output {@link SSEOutput}
   */
  readableStream.pipeThrough(decoderStream).pipeThrough(splitStream()).pipeThrough(splitPart());
  const reader = stream.getReader();
  while (reader instanceof ReadableStreamDefaultReader) {
    const {
      value,
      done
    } = await reader.read();
    if (done) break;
    if (!value) continue;

    // Transformed data through all transform pipes
    yield value;
  }
}
/* harmony default export */ var x_stream = (XStream);
;// CONCATENATED MODULE: ./components/x-request/x-fetch.ts
const XFetch = async (baseURL, options = {}) => {
  const {
    fetch: fetchFn = globalThis.fetch,
    middlewares = {},
    ...requestInit
  } = options;
  if (typeof fetchFn !== 'function') {
    throw new Error('The options.fetch must be a typeof fetch function!');
  }

  /** ---------------------- request init ---------------------- */
  let fetchArgs = [baseURL, requestInit];

  /** ---------------------- request middleware ---------------------- */
  if (typeof middlewares.onRequest === 'function') {
    const modifiedFetchArgs = await middlewares.onRequest(...fetchArgs);
    fetchArgs = modifiedFetchArgs;
  }

  /** ---------------------- fetch ---------------------- */
  let response = await fetchFn(...fetchArgs);

  /** ---------------------- response middleware ---------------------- */
  if (typeof middlewares.onResponse === 'function') {
    const modifiedResponse = await middlewares.onResponse(response);
    if (!(modifiedResponse instanceof Response)) {
      throw new Error('The options.onResponse must return a Response instance!');
    }
    response = modifiedResponse;
  }

  /** ---------------------- response check ---------------------- */
  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }
  if (!response.body) {
    throw new Error('The response body is empty.');
  }

  /** ---------------------- return ---------------------- */
  return response;
};
/* harmony default export */ var x_fetch = (XFetch);
;// CONCATENATED MODULE: ./components/x-request/index.ts



/**
 * Compatible with the parameters of OpenAI's chat.completions.create,
 * with plans to support more parameters and adapters in the future
 */

class XRequestClass {
  baseURL;
  model;
  defaultHeaders;
  customOptions;
  static instanceBuffer = new Map();
  constructor(options) {
    const {
      baseURL,
      model,
      dangerouslyApiKey,
      ...customOptions
    } = options;
    this.baseURL = options.baseURL;
    this.model = options.model;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(options.dangerouslyApiKey && {
        Authorization: options.dangerouslyApiKey
      })
    };
    this.customOptions = customOptions;
  }
  static init(options) {
    const id = options.baseURL;
    if (!id || typeof id !== 'string') throw new Error('The baseURL is not valid!');
    if (!XRequestClass.instanceBuffer.has(id)) {
      XRequestClass.instanceBuffer.set(id, new XRequestClass(options));
    }
    return XRequestClass.instanceBuffer.get(id);
  }
  create = async (params, callbacks, transformStream) => {
    const {
      onSuccess,
      onError,
      onUpdate
    } = callbacks || {};
    const requestInit = {
      method: 'POST',
      body: JSON.stringify({
        model: this.model,
        ...params
      }),
      headers: this.defaultHeaders
    };
    try {
      const response = await x_fetch(this.baseURL, {
        fetch: this.customOptions.fetch,
        ...requestInit
      });
      const contentType = response.headers.get('content-type') || '';
      const chunks = [];
      if (contentType.includes('text/event-stream')) {
        for await (const chunk of x_stream({
          readableStream: response.body,
          transformStream
        })) {
          chunks.push(chunk);
          onUpdate?.(chunk);
        }
      } else if (contentType.includes('application/json')) {
        const chunk = await response.json();
        chunks.push(chunk);
        onUpdate?.(chunk);
      } else {
        throw new Error(`The response content-type: ${contentType} is not support!`);
      }
      onSuccess?.(chunks);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error!');
      onError?.(err);
      throw err;
    }
  };
}
const XRequest = XRequestClass.init;
/* harmony default export */ var x_request = (XRequest);
;// CONCATENATED MODULE: ./components/useXAgent/index.ts


let uuid = 0;

/** This is a wrap class to avoid developer can get too much on origin object */
class XAgent {
  config;
  requestingMap = {};
  constructor(config) {
    this.config = config;
  }
  finishRequest(id) {
    delete this.requestingMap[id];
  }
  request = (info, callbacks) => {
    const {
      request
    } = this.config;
    const {
      onUpdate,
      onSuccess,
      onError
    } = callbacks;
    const id = uuid;
    uuid += 1;
    this.requestingMap[id] = true;
    request?.(info, {
      // Status should be unique.
      // One get success or error should not get more message
      onUpdate: message => {
        if (this.requestingMap[id]) {
          onUpdate(message);
        }
      },
      onSuccess: message => {
        if (this.requestingMap[id]) {
          onSuccess(message);
          this.finishRequest(id);
        }
      },
      onError: error => {
        if (this.requestingMap[id]) {
          onError(error);
          this.finishRequest(id);
        }
      }
    });
  };
  isRequesting() {
    return Object.keys(this.requestingMap).length > 0;
  }
}
function useXAgent(config) {
  const {
    request,
    ...restConfig
  } = config;
  return external_React_default().useMemo(() => [new XAgent({
    request: request || x_request({
      baseURL: restConfig.baseURL,
      model: restConfig.model,
      dangerouslyApiKey: restConfig.dangerouslyApiKey
    }).create,
    ...restConfig
  })], []);
}
;// CONCATENATED MODULE: ./components/index.ts














}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});