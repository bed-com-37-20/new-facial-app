import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout, SimpleLayout } from "../../layout"
import { Home } from "../../pages";
import EnrollmentPage from "../../api/enrollments";
import Attendances from "../../api/attendance/attendances";
import ExamTracking from "../../api/attendance/ExamTracking";
import Report from "../../api/reports/report";
import AttendanceListener from "../../api/AttendanceListener";

export default function RouteList() {
    return [
        {
            path: "/",
            // layout: SimpleLayout,
            layout: SideBarLayout,
            component: () => <Home/>
        },
        {
            path: "/api/attendance/attendances",
            layout: SideBarLayout,
            component: ()=> <Attendances/>
        },
        ,
        {
            path: "/api/attendance/ExamTracking",
            layout: SideBarLayout,
            component: ()=> <ExamTracking/>
        },
        ,
        {
            path: "/api/reports/report",
            layout: SideBarLayout,
            component: ()=> <Report/>
        },
        {
            path: "/api/enrollments",
            layout: SideBarLayout,
            component: ()=> <EnrollmentPage/>
        },

        {
            path: "/api/AttendanceListener",
            layout: SideBarLayout,
            component: ()=> <AttendanceListener/>
        }
      
      
    ]
}
