interface MenuDataProps {
    title: string
    displayInDashboard?: boolean
    subItem: MenuDataItemProps[]
}

interface MenuDataItemProps {
    dashBoardIcon: string
    sidebarIcon:string
    title: string
    leftLabel: string
    program: string
    formLink: string
    showBadge:boolean
    value?: string
    route: string
    disabled?: boolean
    appName: string
}

export type {MenuDataProps, MenuDataItemProps}