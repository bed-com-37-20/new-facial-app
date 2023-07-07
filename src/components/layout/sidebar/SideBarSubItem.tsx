import React from 'react';
import style from "./SideBar.module.css"
import { Badge } from '../../badge/Badge';

interface SideBarSubItemProps {
    label: string
    showBadge: boolean
    icon: string
}

function SideBarSubItem({ icon, label, showBadge }: SideBarSubItemProps) {
    return (
        <li className={style.SideBarSubItemContainer}>
            <img src={icon} />
            <span>{label}</span>
            {showBadge ? <div className={style.BadgeContainer}><Badge value='10' /></div> : null}
        </li>
    )
}
export { SideBarSubItem, type SideBarSubItemProps }
