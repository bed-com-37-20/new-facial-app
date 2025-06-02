// import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout, SimpleLayout } from "../../layout"
import { Home } from "../../pages";
import EnrollmentPage from "../../api/enrollment/enrollments";
import Report from "../../api/reports/report";
import NewExam from "../../api/examPage/newExam";
import SelectStudents from "../../api/examPage/select-students";
import ImageUploadForm from "../../api/filestore";
import Attendance from "../../api/attendance";

export default function RouteList() {
    return [
        {
            path: "/",
            // layout: SimpleLayout,
            layout: SideBarLayout,
            component: () => <Home />
        },
        {
            path: "/api/reports/report",
            layout: SideBarLayout,
            component: () => <Report />
        },
        {
            path: "/api/enrollment/enrollments",
            layout: SideBarLayout,
            component: () => <EnrollmentPage />
        },
        {
            path: "/api/examPage/newExam",
            layout: SideBarLayout,
            component: () => <NewExam />
        },
        {
            path: "/api/examPage/select-students",
            layout: SideBarLayout,
            component: () => <SelectStudents />
        }, {
            path: "/api/attendance",
            layout: SideBarLayout,
            component: () => <Attendance />
        }



    ]
}
