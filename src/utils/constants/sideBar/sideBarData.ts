import gauge from "../../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import { type SideBarItemProps } from "../../../types/sideBar/SideBarTypes"

function sideBarData (): SideBarItemProps[] {
    return [
        {
            title: "Components",
            subItems: [
                {
                    icon: listAdd,
                    label: "Cards",
                    showBadge: false,
                    route: "/cards"
                },
                {
                    icon: glyph,
                    label: "Buttons",
                    showBadge: false,
                    route: "/buttons"
                },
                {
                    icon: gauge,
                    label: "Modal",
                    showBadge: false,
                    route: "/modal"
                },
                {
                    icon: logOut,
                    label: "Table",
                    showBadge: false,
                    route: "/table"
                },
                {
                    icon: fileDocument,
                    label: "Tags",
                    showBadge: false,
                    route: "/tags"
                },
                {
                    icon: fileDocument,
                    label: "Titles",
                    showBadge: false,
                    route: "/text"
                }
            ]
        }
    ]
}
export {sideBarData}
