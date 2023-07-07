import React from 'react'
import style from "./SideBar.module.css"
import { SideBarItem } from './SideBarItem'
import { sideBarData } from "./data/sideBarData"

function SideBar(): React.ReactElement {
    return (
        <aside className={style.SideBarContainer}>
            {
                sideBarData().map((element, index) => (
                    <SideBarItem key={index} title={element.title} subItems={element.subItem} />
                ))
            }
        </aside>
    )
} export { SideBar }
