import React from 'react';
import style from "./SideBar.module.css"
import { Badge } from '../../badge/Badge';
import { type SideBarSubItemProps } from '../../../types/sideBar/SideBarTypes';

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
