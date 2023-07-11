import React from 'react'
import { type LayoutProps } from '../../types/layout/LayoutTypes'
import style from "../Layout.module.css"
import { MainHeader } from '../../components'

function HeadBarLayout({ children }: LayoutProps) {
    return (
        <div className={style.HeadBarLayoutContainer}>
            <MainHeader />
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
export { HeadBarLayout }
