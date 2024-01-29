import React from 'react';
import style from "../SideBar.module.css"
import { Badge } from '../../../badge';
import { type SideBarSubItemProps } from '../../../../types/common/components';
import classNames from 'classnames';
import { useConfig } from '@dhis2/app-runtime';
import { Badge } from '../../../badge';

export default function SideBarSubItem({ icon, label, showBadge, disabled, route, appName }: SideBarSubItemProps) {
    const { baseUrl } = useConfig()

    return (
        <a href={`${baseUrl}/api/apps/${appName}/index.html#/${route}`} className={style.subItemLink}>
            <li className={location.hash.slice(1) === route ? style.sideBarSubItemContainerActive : classNames(style.sideBarSubItemContainer, (Boolean(disabled)) && style.sideBarDisabledSubItem)}>
                <img src={icon} /> <span className={style.sideBarSubItemLabel}>{label}</span>
                {showBadge ? <div className={style.badgeContainer}><Badge value='10' /></div> : null}
                <div className={style.tooltipContainer}>
                    {label}
                </div>
            </li>
        </a>
    )
}
