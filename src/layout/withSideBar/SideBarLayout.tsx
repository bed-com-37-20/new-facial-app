import React from 'react'
import style from "../Layout.module.css"
import { SideBar } from '../../components'
import { SideBarLayoutProps } from '../../types/common/components'

export default function SideBarLayout({ children }: SideBarLayoutProps): React.ReactElement {
    return (
        <div className={style.LayoutContainer}>
            <SideBar />
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
