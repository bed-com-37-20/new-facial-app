import React from 'react'
import style from "../Layout.module.css"

interface SimpleLayoutProps {
    children: React.ReactNode
}

function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <div className={style.LayoutContainer}>
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
export { SimpleLayout }
