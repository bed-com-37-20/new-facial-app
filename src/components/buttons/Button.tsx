import { Button } from '@dhis2/ui'
import React from 'react'
import { getTypesOfButton } from '../../utils/commons/getTypesButtons.js';
import style from './button.module.css'

interface ButtonProps {
    children?: React.ReactNode
    name: string
}
function ButtonComponent(props: ButtonProps): React.ReactElement {
    const { children, name } = props
    return (
        <Button className={style[getTypesOfButton(props)]} {...props} >
           {children}
            {name}
        </Button>
    )
}

export default ButtonComponent
