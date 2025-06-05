import React from 'react';
import style from "../SideBar.module.css";
import SideBarItemTitle from './SideBarItemTitle';
import SideBarSubItem from './SideBarSubItem';
export default function SideBarItem(_ref) {
  let {
    title,
    subItem
  } = _ref;
  return /*#__PURE__*/React.createElement("section", {
    className: style.sideBarItemContainer
  }, /*#__PURE__*/React.createElement(SideBarItemTitle, {
    title: title
  }), /*#__PURE__*/React.createElement("ul", {
    className: style.sideBarItemListContainer
  }, subItem === null || subItem === void 0 ? void 0 : subItem.filter(item => item.displayInMenu).map((item, index) => /*#__PURE__*/React.createElement(SideBarSubItem, {
    program: "",
    leftLabel: "",
    dashBoardIcon: "",
    formLink: "",
    route: item.route,
    key: index,
    sidebarIcon: item.sidebarIcon,
    title: item.title,
    showBadge: item.showBadge,
    disabled: item.disabled,
    appName: item.appName
  }))));
}