import React from 'react'
import { MenuItem } from "@dhis2/ui"
import { type MenuItemTypes } from '../../types/menu/MenuItemTypes'

function Item(menuItens: MenuItemTypes[]): React.ReactElement {
    return (
        <>
            {
                menuItens.map(menuIten => (
                    < MenuItem key={menuIten.id} label="Menu item" />
                ))
            }
        </>
    )
}
export { Item }
