import React from 'react'
import style from "./SideBar.module.css"

interface SideBarItemTitleProps {
  title: string
}

function SideBarItemTitle({ title }: SideBarItemTitleProps): React.ReactElement {
  return (
    <span className={style.SideBarItemTitle}>{title}</span>
  )
}
export { SideBarItemTitle }
