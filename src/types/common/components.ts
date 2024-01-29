interface SideBarItemProps {
    title: string
    subItems: SideBarSubItemProps[]
}

interface SideBarItemTitleProps {
    title: string
}

interface SideBarSubItemProps {
    label: string
    showBadge: boolean
    icon: string
    disabled: boolean
    route: string
    appName: string
}

interface SideBarCollapseProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}

export type { SideBarItemProps, SideBarItemTitleProps, SideBarSubItemProps, SideBarCollapseProps }


interface DashboardCardProps {
    title: string
    subItem: CardSubItemProps[]
}

interface CardSubItemProps {
    icon: string
    title: string
    leftLabel: string
    program: string
    formLink: string
    value?: string
    listLink: string
    disabled?: boolean
    appName: string
}


export type { DashboardCardProps, CardSubItemProps }


interface BadgeProps {
    value: string
}

export { type BadgeProps }

interface SubtitleProps {
    label: string
}

export { type SubtitleProps }

interface TitleProps {
    label: string
}

export { type TitleProps }

interface WithPaddingProps {
    padding?: string
    children?: React.ReactNode
}

export { type WithPaddingProps }

interface SimpleLayoutProps {
    children: React.ReactNode
}

export { type SimpleLayoutProps }

interface SideBarLayoutProps {
    children: React.ReactNode
}

export { type SideBarLayoutProps }

interface MenuDataProps {
    title: string
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