import React from 'react'
import style from "./MainHeader.module.css"
import { headBarData } from '../../../utils/constants/headBar/headBarData'
import { HeaderItem } from './HeaderItem'
import { AcademicYear } from './AcademicYear'

function MainHeader(): React.ReactElement {
    return (
        <nav className={style.MainHeaderContainer}>
            {headBarData().map((haderItem, index) => (
                <HeaderItem key={index} placeholder={haderItem.placeholder} label={haderItem.label} value={haderItem.value} />
            ))}
            <AcademicYear />
        </nav>
    )
}
export { MainHeader }
