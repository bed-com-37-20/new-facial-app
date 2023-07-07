import React from 'react'
import style from "./SideBar.module.css"
import { SideBarItemTitle } from './SideBarItemTitle'
import { SideBarSubItem } from './SideBarSubItem'
import { type SideBarItemProps } from './type/SideBarTypes'

function SideBarItem({ title, subItems }: SideBarItemProps): React.ReactElement {
    return (
        <section className={style.SideBarItemContainer}>
            <SideBarItemTitle title={title} />
            <ul className={style.SideBarItemListContainer}>
                {subItems.map((subItem, index) => (
                    <SideBarSubItem key={index} icon={subItem.icon} label={subItem.label} showBadge={subItem.showBadge} />
                ))}
            </ul>
        </section>
    )
}
export { SideBarItem }
