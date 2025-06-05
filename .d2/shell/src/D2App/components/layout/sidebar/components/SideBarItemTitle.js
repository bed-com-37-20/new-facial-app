import React from 'react';
import style from "../SideBar.module.css";
export default function SideBarItemTitle(_ref) {
  let {
    title
  } = _ref;
  return /*#__PURE__*/React.createElement("span", {
    className: style.sideBarItemTitle
  }, title);
}