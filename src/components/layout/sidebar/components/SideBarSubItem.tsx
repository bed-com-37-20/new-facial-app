import React from 'react';
import style from "../SideBar.module.css"
import { Badge } from '../../../badge';
import classNames from 'classnames';
import { useConfig } from '@dhis2/app-runtime';
import { MenuDataItemProps } from '../../../../types/menu/MenuTypes';
import { useLocation } from 'react-router-dom';

export default function SideBarSubItem({ sidebarIcon, title, showBadge, disabled, route, appName,program,leftLabel }: MenuDataItemProps) {
    const { baseUrl } = useConfig()
    const location = useLocation()

    return (
        <a href={`${baseUrl}/api/apps/${appName}/index.html#/${route}`} className={style.subItemLink}>
            <li className={location.pathname.slice(1) === route ? style.sideBarSubItemContainerActive : classNames(style.sideBarSubItemContainer, (Boolean(disabled)) && style.sideBarDisabledSubItem)}>
                <img src={sidebarIcon} /> <span className={style.sideBarSubItemLabel}>{title}</span>
                {showBadge ? <div className={style.badgeContainer}><Badge value='10' /></div> : null}
                <div className={style.tooltipContainer}>
                    {title}
                </div>
            </li>
        </a>
    )
}
