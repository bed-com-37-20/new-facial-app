import gauge from "../../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import userGroup from "../../../assets/images/sidebar/user-group.svg"
import { type SideBarItemProps } from "../../../types/sideBar/SideBarTypes"

function sideBarData (): SideBarItemProps[] {
    return [
        {
            title: "Students",
            subItems: [
                {
                    icon: listAdd,
                    label: "Enrollment",
                    showBadge: false,
                    disabled: false,
                    route: "/home"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                },
                {
                    icon: fileDocument,
                    label: "Performance",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                },
                {
                    icon: gauge,
                    label: "Final result",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: true,
                    disabled: true,
                    route: "#"
                }
            ]
        },
        {
            title: "Staff",
            subItems: [
                {
                    icon: userGroup,
                    label: "Teacher registry",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                },
                {
                    icon: userGroup,
                    label: "Non-teacher registry",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                }
            ]
        },
        {
            title: "Academic Year",
            subItems: [
                {
                    icon: listAdd,
                    label: "School Calendar",
                    showBadge: false,
                    disabled: true,
                    route: "#"
                }
            ]
        }
    ]
}
export {sideBarData}
