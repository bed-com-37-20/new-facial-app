import React from 'react'
import style from "../Layout.module.css"
import { SimpleLayoutProps } from '../../types/common/components'

export default function SimpleLayout({ children }:  SimpleLayoutProps) {
    return (
        <div className={style.layoutContainer}>
            <main className={style.mainContentContainer}>{children}</main>
        </div>
    )
}
