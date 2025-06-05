// import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout } from "../../layout";
import { Home } from "../../pages";
import EnrollmentPage from "../../api/enrollment/enrollments";
import NewExam from "../../api/examPage/newExam";
import SelectStudents from "../../api/examPage/select-students";
import Attendance from "../../api/attendance";
import Report from "../../api/reports/report";

export default function RouteList() {
  return [{
    path: "/",
    // layout: SimpleLayout,
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Home, null)
  },
  {
      path: "/api/reports/report",
      layout: SideBarLayout,
      component: () => <Report />
  },
  {
    path: "/api/enrollment/enrollments",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(EnrollmentPage, null)
  }, {
    path: "/api/examPage/newExam",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(NewExam, null)
  }, {
    path: "/api/examPage/select-students",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(SelectStudents, null)
  }, {
    path: "/api/attendance",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Attendance, null)
  }];
}