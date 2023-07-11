import chevronDown from "../../../assets/images/headbar/chevron-down.svg"
import { type HeadBarTypes } from "../../../types/headBar/HeadBarTypes"

function headBarData(): HeadBarTypes[] {
    return [
        {
            label: "School",
            value: "Primary School ABCD",
            icon: chevronDown
        },
        {
            label: "Grade",
            value: "Grade 1",
            icon: chevronDown
        },
        {
            label: "School",
            value: "All",
            icon: chevronDown
        }
    ]
}
export {headBarData}
