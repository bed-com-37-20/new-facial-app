import React from 'react'
import style from "../Layout.module.css"
import { SideBar } from '../../components'

interface SideBarLayoutProps {
    children: React.ReactNode
}

function SideBarLayout({ children }: SideBarLayoutProps): React.ReactElement {
    return (
        <div className={style.LayoutContainer}>
            <SideBar />
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
export { SideBarLayout }
