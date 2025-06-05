import React from 'react';
import style from "./Badge.module.css";
export default function Badge(_ref) {
  let {
    value
  } = _ref;
  return /*#__PURE__*/React.createElement("span", {
    className: style.badgeContainer
  }, value);
}