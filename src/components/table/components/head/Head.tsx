import React from 'react'

type HeadProps = {
    children?: React.ReactNode,
}

function HeadTable(props: HeadProps): React.ReactElement {
    return (
        <thead>
            {props.children}
        </thead>
    )
}

export default HeadTable