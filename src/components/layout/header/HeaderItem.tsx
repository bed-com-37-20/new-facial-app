import React from 'react'
import style from "./MainHeader.module.css"
import { type HeadBarTypes } from '../../../types/header/HeadBarTypes'

function HeaderItem({ label, value, icon }: HeadBarTypes): React.ReactElement {
    return (
        <section className={style.HeaderItemContainer}>
            <div className={style.HeaderIntenContent}>
                <span className={style.HeaderItemLabel}>{label}</span>
                <span className={style.HeaderItemValue}>{value}</span>
                <img src={icon} />
            </div>
        </section>
    )
}
export { HeaderItem }
