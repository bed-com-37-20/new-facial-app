import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import RouteList from './RouteList';
export default function Router() {
  return /*#__PURE__*/React.createElement(HashRouter, null, /*#__PURE__*/React.createElement(Routes, null, RouteList().map((route, index) => route && /*#__PURE__*/React.createElement(Route, {
    key: index,
    path: route.path,
    element: /*#__PURE__*/React.createElement(route.layout, null, route.component())
  }))));
}