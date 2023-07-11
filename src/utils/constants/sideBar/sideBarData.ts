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
                    showBadge: false
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false
                },
                {
                    icon: fileDocument,
                    label: "Performance",
                    showBadge: false
                },
                {
                    icon: gauge,
                    label: "Final result",
                    showBadge: false
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: true
                }
            ]
        },
        {
            title: "Staff",
            subItems: [
                {
                    icon: userGroup,
                    label: "Teacher registry",
                    showBadge: false
                },
                {
                    icon: userGroup,
                    label: "Non-teacher registry",
                    showBadge: false
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false
                }
            ]
        },
        {
            title: "Academic Year",
            subItems: [
                {
                    icon: listAdd,
                    label: "School Calendar",
                    showBadge: false
                }
            ]
        }
    ]
}
export {sideBarData}
