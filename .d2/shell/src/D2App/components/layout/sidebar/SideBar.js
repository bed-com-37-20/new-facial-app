import React, { useState } from 'react';
import style from "./SideBar.module.css";
import SideBarItem from './components/SideBarItem';
import SibeBarCollapseButton from './components/SibeBarCollapseButton';
import { useMenuData } from '../../../hooks/menu/useMenuData';
export default function SideBar() {
  var _menuData$filter;
  const {
    menuData
  } = useMenuData();
  const [collapsed, setCollapsed] = useState(false);
  return /*#__PURE__*/React.createElement("aside", {
    className: collapsed ? style.sideBarContainerCollapsed : style.sideBarContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: style.sideBarMenu
  }, menuData === null || menuData === void 0 ? void 0 : (_menuData$filter = menuData.filter(element => element.displayInMenu)) === null || _menuData$filter === void 0 ? void 0 : _menuData$filter.map((element, index) => /*#__PURE__*/React.createElement(SideBarItem, {
    key: index,
    title: element.title,
    subItem: element.subItem
  }))), /*#__PURE__*/React.createElement(SibeBarCollapseButton, {
    collapsed: collapsed,
    setCollapsed: setCollapsed
  }));
}