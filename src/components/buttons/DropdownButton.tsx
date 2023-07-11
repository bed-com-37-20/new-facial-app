import { Button } from '@dhis2/ui'
import React from 'react'
import { getTypesOfButton } from '../../utils/commons/getTypesButtons.js';
import style from './button.module.css'
import { OptionSet } from '../../types/generated/models.js';

interface ButtonProps {
    children?: React.ReactNode
    name: string
    options?: OptionSet[]
}
function DropdownButtonComponent(props: ButtonProps): React.ReactElement {
    const { children, name } = props
    return (
        <Button className={style[getTypesOfButton(props)]} {...props} >
           {children}
            {name}
        </Button>
    )
}

export default DropdownButtonComponent
