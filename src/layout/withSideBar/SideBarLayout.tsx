import React from 'react'
import style from "../Layout.module.css"
import { SideBar } from '../../components'
import { SideBarLayoutProps } from '../../types/common/components'

export default function SideBarLayout({ children }: SideBarLayoutProps): React.ReactElement {
    return (
        <div className={style.layoutContainer}>
            <SideBar />
            <main className={style.mainContentContainer}>{children}</main>
        </div>
    )
}
