import React from 'react'
import style from "../Layout.module.css"
interface SideBarLayoutProps {
    children: React.ReactNode
}

function SideBarLayout({ children }: SideBarLayoutProps): React.ReactElement {
    return (
        <div className={style.LayoutContainer}>
            <>Sidebar</>
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}
export { SideBarLayout }
