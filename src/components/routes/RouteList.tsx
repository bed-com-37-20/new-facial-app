import { Navigate } from "react-router-dom";
import React from "react";
import { SideBarLayout, SimpleLayout, HeadBarLayout } from "../../layout"
import { Cards, Buttons, Home, Modal} from "../../pages";
import TableComponent from "../../pages/table/Table";

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
            component: Home
        },
        {
            path: "/table",
            layout: HeadBarLayout,
            component: () => <TableComponent />
        },
        {
            path: "/buttons",
            layout: SideBarLayout,
            component: Buttons
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
export { RouteList }
