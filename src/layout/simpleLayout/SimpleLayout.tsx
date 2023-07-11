import React from 'react'
import style from "../Layout.module.css"
import { type LayoutProps } from '../../types/layout/LayoutTypes'

function SimpleLayout({ children }: LayoutProps) {
    return (
        <div className={style.LayoutContainer}>
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
export { SimpleLayout }
