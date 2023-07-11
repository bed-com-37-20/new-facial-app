import React from 'react'
import style from "./MainHeader.module.css"
import { headBarData } from '../../../utils/constants/headBar/headBarData'
import { HeaderItem } from './HeaderItem'
import info from "../../../assets/images/headbar/info.svg"

function MainHeader(): React.ReactElement {
    return (
        <nav className={style.MainHeaderContainer}>
            {headBarData().map((haderItem, index) => (
                <>
                    <HeaderItem icon={haderItem.icon} key={index} label={haderItem.label} value={haderItem.value} />
                </>
            ))}
            <section className={style.AcademicYear}>
                <h5>Academic Year <span>2023</span></h5>
                <img src={info} />
            </section>
        </nav>
    )
}
export { MainHeader }
