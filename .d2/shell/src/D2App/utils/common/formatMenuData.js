export function formatMenuData(menuData, appsList) {
  var _menuData$filter, _menuData$filter2;
  menuData === null || menuData === void 0 ? void 0 : (_menuData$filter = menuData.filter(menuItem => menuItem.displayInDashboard)) === null || _menuData$filter === void 0 ? void 0 : _menuData$filter.map(menuItem => {
    var _menuItem$subItem;
    menuItem === null || menuItem === void 0 ? void 0 : (_menuItem$subItem = menuItem.subItem) === null || _menuItem$subItem === void 0 ? void 0 : _menuItem$subItem.map(menuSubItem => {
      menuSubItem.displayInMenu = Boolean(appsList === null || appsList === void 0 ? void 0 : appsList.find(app => app.key === menuSubItem.appName));
    });
  });
  menuData === null || menuData === void 0 ? void 0 : (_menuData$filter2 = menuData.filter(menuItem => menuItem.displayInDashboard)) === null || _menuData$filter2 === void 0 ? void 0 : _menuData$filter2.map(menuItem => {
    var _menuItem$subItem2;
    menuItem.displayInMenu = !Boolean(menuItem === null || menuItem === void 0 ? void 0 : (_menuItem$subItem2 = menuItem.subItem) === null || _menuItem$subItem2 === void 0 ? void 0 : _menuItem$subItem2.every(menuSubItem => !menuSubItem.displayInMenu));
  });
  return menuData;
}