import {
  PrimeReact,
  Tooltip,
  useMountEffect,
  useUnmountEffect,
  useUpdateEffect
} from "./chunk-5V5YKI3M.js";
import "./chunk-2MRMY2VI.js";
import {
  DomHandler,
  IconUtils,
  ObjectUtils,
  classNames
} from "./chunk-YPJCFCBD.js";
import {
  require_react
} from "./chunk-6DDWND5A.js";
import {
  __toESM
} from "./chunk-4EOJPDL2.js";

// node_modules/primereact/button/button.esm.js
var React2 = __toESM(require_react());

// node_modules/primereact/ripple/ripple.esm.js
var React = __toESM(require_react());
var Ripple = React.memo(React.forwardRef(function() {
  var inkRef = React.useRef(null);
  var targetRef = React.useRef(null);
  var getTarget = function getTarget2() {
    return inkRef.current && inkRef.current.parentElement;
  };
  var bindEvents = function bindEvents2() {
    if (targetRef.current) {
      targetRef.current.addEventListener("mousedown", onMouseDown);
      DomHandler.isTouchDevice() && targetRef.current.addEventListener("touchstart", onTouchStart);
    }
  };
  var unbindEvents = function unbindEvents2() {
    if (targetRef.current) {
      targetRef.current.removeEventListener("mousedown", onMouseDown);
      DomHandler.isTouchDevice() && targetRef.current.removeEventListener("touchstart", onTouchStart);
    }
  };
  var onTouchStart = function onTouchStart2(event) {
    var offset = DomHandler.getOffset(targetRef.current);
    var offsetX = event.targetTouches[0].pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(inkRef.current) / 2;
    var offsetY = event.targetTouches[0].pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(inkRef.current) / 2;
    activateRipple(offsetX, offsetY);
  };
  var onMouseDown = function onMouseDown2(event) {
    if (DomHandler.isTouchDevice()) {
      return;
    }
    var offset = DomHandler.getOffset(targetRef.current);
    var offsetX = event.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(inkRef.current) / 2;
    var offsetY = event.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(inkRef.current) / 2;
    activateRipple(offsetX, offsetY);
  };
  var activateRipple = function activateRipple2(offsetX, offsetY) {
    if (!inkRef.current || getComputedStyle(inkRef.current, null).display === "none") {
      return;
    }
    DomHandler.removeClass(inkRef.current, "p-ink-active");
    setDimensions();
    inkRef.current.style.top = offsetY + "px";
    inkRef.current.style.left = offsetX + "px";
    DomHandler.addClass(inkRef.current, "p-ink-active");
  };
  var onAnimationEnd = function onAnimationEnd2(event) {
    DomHandler.removeClass(event.currentTarget, "p-ink-active");
  };
  var setDimensions = function setDimensions2() {
    if (inkRef.current && !DomHandler.getHeight(inkRef.current) && !DomHandler.getWidth(inkRef.current)) {
      var d = Math.max(DomHandler.getOuterWidth(targetRef.current), DomHandler.getOuterHeight(targetRef.current));
      inkRef.current.style.height = d + "px";
      inkRef.current.style.width = d + "px";
    }
  };
  useMountEffect(function() {
    if (inkRef.current) {
      targetRef.current = getTarget();
      setDimensions();
      bindEvents();
    }
  });
  useUpdateEffect(function() {
    if (inkRef.current && !targetRef.current) {
      targetRef.current = getTarget();
      setDimensions();
      bindEvents();
    }
  });
  useUnmountEffect(function() {
    if (inkRef.current) {
      targetRef.current = null;
      unbindEvents();
    }
  });
  return PrimeReact.ripple ? React.createElement("span", {
    role: "presentation",
    ref: inkRef,
    className: "p-ink",
    onAnimationEnd
  }) : null;
}));
Ripple.displayName = "Ripple";

// node_modules/primereact/button/button.esm.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var ButtonBase = {
  defaultProps: {
    __TYPE: "Button",
    label: null,
    icon: null,
    iconPos: "left",
    badge: null,
    severity: null,
    rounded: false,
    raised: false,
    outlined: false,
    text: false,
    link: false,
    badgeClassName: null,
    tooltip: null,
    size: null,
    tooltipOptions: null,
    disabled: false,
    loading: false,
    loadingIcon: "pi pi-spinner pi-spin",
    visible: true,
    children: void 0
  },
  getProps: function getProps(props) {
    return ObjectUtils.getMergedProps(props, ButtonBase.defaultProps);
  },
  getOtherProps: function getOtherProps(props) {
    return ObjectUtils.getDiffProps(props, ButtonBase.defaultProps);
  }
};
var Button = React2.memo(React2.forwardRef(function(inProps, ref) {
  var _classNames2;
  var props = ButtonBase.getProps(inProps);
  var elementRef = React2.useRef(ref);
  React2.useEffect(function() {
    ObjectUtils.combinedRefs(elementRef, ref);
  }, [elementRef, ref]);
  if (props.visible === false) {
    return null;
  }
  var createIcon = function createIcon2() {
    var icon2 = props.loading ? props.loadingIcon : props.icon;
    var className2 = classNames("p-button-icon p-c", _defineProperty({
      "p-button-loading-icon": props.loading
    }, "p-button-icon-".concat(props.iconPos), props.label));
    return IconUtils.getJSXIcon(icon2, {
      className: className2
    }, {
      props
    });
  };
  var createLabel = function createLabel2() {
    if (props.label) {
      return React2.createElement("span", {
        className: "p-button-label p-c"
      }, props.label);
    }
    return !props.children && !props.label && React2.createElement("span", {
      className: "p-button-label p-c",
      dangerouslySetInnerHTML: {
        __html: "&nbsp;"
      }
    });
  };
  var createBadge = function createBadge2() {
    if (props.badge) {
      var badgeClassName = classNames("p-badge", props.badgeClassName);
      return React2.createElement("span", {
        className: badgeClassName
      }, props.badge);
    }
    return null;
  };
  var disabled = props.disabled || props.loading;
  var showTooltip = !disabled || props.tooltipOptions && props.tooltipOptions.showOnDisabled;
  var hasTooltip = ObjectUtils.isNotEmpty(props.tooltip) && showTooltip;
  var otherProps = ButtonBase.getOtherProps(props);
  var sizeMapping = {
    large: "lg",
    small: "sm"
  };
  var size = sizeMapping[props.size];
  var className = classNames("p-button p-component", props.className, (_classNames2 = {
    "p-button-icon-only": (props.icon || props.loading && props.loadingIcon) && !props.label && !props.children,
    "p-button-vertical": (props.iconPos === "top" || props.iconPos === "bottom") && props.label,
    "p-disabled": disabled,
    "p-button-loading": props.loading,
    "p-button-outlined": props.outlined,
    "p-button-raised": props.raised,
    "p-button-link": props.link,
    "p-button-text": props.text,
    "p-button-rounded": props.rounded,
    "p-button-loading-label-only": props.loading && !props.icon && props.label
  }, _defineProperty(_classNames2, "p-button-loading-".concat(props.iconPos), props.loading && props.loadingIcon && props.label), _defineProperty(_classNames2, "p-button-".concat(size), size), _defineProperty(_classNames2, "p-button-".concat(props.severity), props.severity), _classNames2));
  var icon = createIcon();
  var label = createLabel();
  var badge = createBadge();
  var defaultAriaLabel = props.label ? props.label + (props.badge ? " " + props.badge : "") : props["aria-label"];
  return React2.createElement(React2.Fragment, null, React2.createElement("button", _extends({
    ref: elementRef,
    "aria-label": defaultAriaLabel
  }, otherProps, {
    className,
    disabled
  }), icon, label, props.children, badge, React2.createElement(Ripple, null)), hasTooltip && React2.createElement(Tooltip, _extends({
    target: elementRef,
    content: props.tooltip
  }, props.tooltipOptions)));
}));
Button.displayName = "Button";
export {
  Button
};
//# sourceMappingURL=primereact_button.js.map
