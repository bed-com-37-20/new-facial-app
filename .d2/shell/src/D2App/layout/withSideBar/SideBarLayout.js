import React from 'react';
import style from "../Layout.module.css";
import { SideBar } from '../../components/layout';
export default function SideBarLayout(_ref) {
  let {
    children
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: style.layoutContainer
  }, /*#__PURE__*/React.createElement(SideBar, null), /*#__PURE__*/React.createElement("main", {
    className: style.mainContentContainer
  }, children));
}