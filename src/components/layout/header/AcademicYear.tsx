import React from 'react'
import info from "../../../assets/images/headbar/info.svg"
import style from "./MainHeader.module.css"

function AcademicYear() {
    return (
        <section className={style.AcademicYear}>
            <h5>Academic Year <span>2023</span></h5>
            <img src={info} />
        </section>
    )
}
export { AcademicYear }
