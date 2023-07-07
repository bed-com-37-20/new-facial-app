import React from 'react'

type HeadProps = {
    children?: React.ReactNode,
    innerRef?: (instance: any) => void,
    className?: string,
}

function HeadTable(props: HeadProps): React.ReactElement {
    return (
        <thead>
            {props.children}
        </thead>
    )
}

export default HeadTable