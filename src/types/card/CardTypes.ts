interface DashboardCardProps {
    title: string
    subItem: CardSubItemProps[]
}

interface CardSubItemProps {
    icon: React.ReactElement
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