import {
  ObjectUtils,
  classNames
} from "./chunk-YPJCFCBD.js";
import {
  require_react
} from "./chunk-6DDWND5A.js";
import {
  __toESM
} from "./chunk-4EOJPDL2.js";

// node_modules/primereact/divider/divider.esm.js
var React = __toESM(require_react());
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
var DividerBase = {
  defaultProps: {
    __TYPE: "Divider",
    align: null,
    layout: "horizontal",
    type: "solid",
    style: null,
    className: null,
    children: void 0
  },
  getProps: function getProps(props) {
    return ObjectUtils.getMergedProps(props, DividerBase.defaultProps);
  },
  getOtherProps: function getOtherProps(props) {
    return ObjectUtils.getDiffProps(props, DividerBase.defaultProps);
  }
};
var Divider = React.forwardRef(function(inProps, ref) {
  var props = DividerBase.getProps(inProps);
  var elementRef = React.useRef(null);
  var horizontal = props.layout === "horizontal";
  var vertical = props.layout === "vertical";
  var otherProps = DividerBase.getOtherProps(props);
  var className = classNames("p-divider p-component p-divider-".concat(props.layout, " p-divider-").concat(props.type), {
    "p-divider-left": horizontal && (!props.align || props.align === "left"),
    "p-divider-right": horizontal && props.align === "right",
    "p-divider-center": horizontal && props.align === "center" || vertical && (!props.align || props.align === "center"),
    "p-divider-top": vertical && props.align === "top",
    "p-divider-bottom": vertical && props.align === "bottom"
  }, props.className);
  React.useImperativeHandle(ref, function() {
    return {
      props,
      getElement: function getElement() {
        return elementRef.current;
      }
    };
  });
  return React.createElement("div", _extends({
    ref: elementRef,
    className,
    style: props.style,
    role: "separator"
  }, otherProps), React.createElement("div", {
    className: "p-divider-content"
  }, props.children));
});
Divider.displayName = "Divider";
export {
  Divider
};
//# sourceMappingURL=primereact_divider.js.map
