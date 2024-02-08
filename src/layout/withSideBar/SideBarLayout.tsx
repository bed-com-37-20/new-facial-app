import React from 'react'
import style from "../Layout.module.css"
import { SideBarLayoutProps } from '../../types/layout/SideBarLayoutTypes'
import { SideBar } from '../../components/layout'

export default function SideBarLayout({ children }: SideBarLayoutProps): React.ReactElement {
    return (
        <div className={style.layoutContainer}>
            <SideBar />
            <main className={style.mainContentContainer}>{children}</main>
        </div>
    )
}
