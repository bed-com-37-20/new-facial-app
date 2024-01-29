import React from 'react'
import style from "../Layout.module.css"
import { SimpleLayoutProps } from '../../types/common/components'

export default function SimpleLayout({ children }:  SimpleLayoutProps) {
    return (
        <div className={style.LayoutContainer}>
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
