import React from 'react'
import style from "./MainHeader.module.css"
import { DropdownButton, FlyoutMenu } from "@dhis2/ui"
import { type HeadBarTypes } from '../../../types/headBar/HeadBarTypes'
import { SimpleSearch } from '../../search'
import { OrgUnitTree } from '../../orgUnitTree'

function HeaderItem({ label, value, placeholder }: HeadBarTypes): React.ReactElement {
    return (
        <DropdownButton
            className={style.HeaderItemContainer}
            component={
                <FlyoutMenu>
                    <SimpleSearch placeholder={placeholder}>
                        <OrgUnitTree />
                    </SimpleSearch>
                </FlyoutMenu>
            }>
            <h5>{label} <span>{value}</span></h5>
        </DropdownButton>
    )
}
export { HeaderItem }
