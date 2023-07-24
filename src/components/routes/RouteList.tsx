import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout, SimpleLayout, FullLayout } from "../../layout"
import { Cards, ButtonsPage, Home, Modal} from "../../pages";
import TableComponent from "../../pages/table/Table";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/home" replace />
        },
        {
            path: "/home",
            layout: SideBarLayout,
            component: Home
        },
        {
            path: "/table",
            layout: FullLayout,
            component: () => <TableComponent />
        },
        {
            path: "/buttons",
            layout: SideBarLayout,
            component: ButtonsPage
        },
        {
            path: "/cards",
            layout: SideBarLayout,
            component: Cards
        },
        {
            path: "/modal",
            layout: SideBarLayout,
            component: Modal
        }
    ]
}
