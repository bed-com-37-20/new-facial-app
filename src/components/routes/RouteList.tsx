import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout, SimpleLayout } from "../../layout"
import { Home } from "../../pages";
import EnrollmentPage from "../../api/enrollments";

export default function RouteList() {
    return [
        {
            path: "/",
            // layout: SimpleLayout,
            layout: SideBarLayout,
            component: () => <Home/>
        },
        // {
        //     path: "/home",
        //     layout: SideBarLayout,
        //     component: ()=> <Home/>
        // },
        {
            path: "/api/enrollments",
            layout: SideBarLayout,
            component: ()=> <EnrollmentPage/>
        },
      
      
    ]
}
