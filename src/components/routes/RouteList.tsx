import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout, SimpleLayout } from "../../layout"
import { DashboardCards } from "../../pages";

function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/home" replace />
        },
        {
            path: "/home",
            layout: SideBarLayout,
            component: () => <span>Home</span>
        },
        {
            path: "/card",
            layout: SimpleLayout,
            component: DashboardCards
        }
    ]
}
export { RouteList }
