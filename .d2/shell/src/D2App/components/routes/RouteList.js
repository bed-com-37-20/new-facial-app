// import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout } from "../../layout";
import { Home } from "../../pages";
import EnrollmentPage from "../../api/enrollment/enrollments";
import Report from "../../api/reports/report";
import NewExam from "../../api/examPage/newExam";
import SelectStudents from "../../api/examPage/ExamForm";
import Attendance from "../../api/attendance/attendance";
import ExamForm from "../../api/examPage/ExamForm";
export default function RouteList() {
  return [{
    path: "/",
    // layout: SimpleLayout,
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Home, null)
  }, {
    path: "/api/reports/report",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Report, null)
  }, {
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
    path: "/api/attendance/attendance",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(Attendance, null)
  }, {
    path: "/api/examPage/ExamForm",
    layout: SideBarLayout,
    component: () => /*#__PURE__*/React.createElement(ExamForm, null)
  }];
}