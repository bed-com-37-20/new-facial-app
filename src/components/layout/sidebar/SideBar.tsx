import React, { useState } from 'react'
import style from "./SideBar.module.css"
import SideBarItem from './components/SideBarItem'
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"
import SibeBarCollapseButton from './components/SibeBarCollapseButton';

export default function SideBar(): React.ReactElement {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <aside className={collapsed ? style.sideBarContainerCollapsed : style.sideBarContainer}>
            <div className={style.sideBarMenu}>
                {
                    sideBarData().map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseButton collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
