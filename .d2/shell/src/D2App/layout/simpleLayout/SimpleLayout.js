import React from 'react';
import style from "../Layout.module.css";
export default function SimpleLayout(_ref) {
  let {
    children
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: style.layoutContainer
  }, /*#__PURE__*/React.createElement("main", {
    className: style.mainContentContainer
  }, children));
}