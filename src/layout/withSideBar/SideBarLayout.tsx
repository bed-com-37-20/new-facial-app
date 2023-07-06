import React from 'react'
import { Outlet } from 'react-router-dom'

function SideBarLayout(): React.ReactElement {
    return (
        <>{Outlet}</>
    )
}
export { SideBarLayout }
