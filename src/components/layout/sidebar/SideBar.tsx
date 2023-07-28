import React, { useState } from 'react'
import style from "./SideBar.module.css"
import SideBarItem from './SideBarItem'
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"

export default function SideBar(): React.ReactElement {
    const [collapsed] = useState<boolean>(false);

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            {
                sideBarData().map((element, index) => (
                    <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                ))
            }
        </aside>
    )
}
