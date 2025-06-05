import React from "react";
import { SideBarLayout } from "../../layout";
import { Home } from "../../pages";
import EnrollmentPage from "../../api/enrollments";
import Attendances from "../../api/attendance/attendances";
import ExamTracking from "../../api/attendance/ExamTracking";
import Report from "../../api/reports/report";
export default function RouteList() {
  return [{
    path: "/",
    // layout: SimpleLayout,
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Home, null)
  }, {
    path: "/api/attendance/attendances",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Attendances, null)
  },, {
    path: "/api/attendance/ExamTracking",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(ExamTracking, null)
  },, {
    path: "/api/reports/report",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Report, null)
  }, {
    path: "/api/enrollments",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(EnrollmentPage, null)
  }];
}