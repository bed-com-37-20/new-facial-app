import React from 'react'
import style from "../Layout.module.css"
import { SideBarLayoutProps } from '../../types/common/components'
import { SideBar } from '../../components/layout'

export default function SideBarLayout({ children }: SideBarLayoutProps): React.ReactElement {
    return (
        <div className={style.layoutContainer}>
            <SideBar />
            <main className={style.mainContentContainer}>{children}</main>
        </div>
    )
}
