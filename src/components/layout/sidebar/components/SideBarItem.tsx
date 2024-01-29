import React from 'react'
import style from "../SideBar.module.css"
import SideBarItemTitle from './SideBarItemTitle'
import SideBarSubItem from './SideBarSubItem'
import { type SideBarItemProps } from '../../../../types/common/components'

export default function SideBarItem({ title, subItems }: SideBarItemProps): React.ReactElement {
    return (
        <section className={style.sideBarItemContainer}>
            <SideBarItemTitle title={title} />
            <ul className={style.sideBarItemListContainer}>
                {subItems.map((subItem, index) => (
                    <SideBarSubItem route={subItem.route} key={index} icon={subItem.icon} label={subItem.label} showBadge={subItem.showBadge} disabled={subItem.disabled} appName={subItem.appName} />
                ))}
            </ul>
        </section>
    )
}
