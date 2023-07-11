import React from 'react'
import style from "../Layout.module.css"
import { SideBar } from '../../components'
import { type LayoutProps } from '../../types/layout/LayoutTypes'

function SideBarLayout({ children }: LayoutProps): React.ReactElement {
    return (
        <div className={style.LayoutContainer}>
            <SideBar />
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
export { SideBarLayout }
