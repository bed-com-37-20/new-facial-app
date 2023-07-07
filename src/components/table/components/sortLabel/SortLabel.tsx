import React from 'react'
import { TableSortLabel } from '@material-ui/core';

type TableSortProps = {
    children?: React.ReactNode,
    active: boolean,
    direction: string,
    createSortHandler: (rowsPerPage: string) => void
}

function SortLabel(props: TableSortProps): React.ReactElement {
    return (
        <TableSortLabel
            active={props.active}
            direction={props.direction}
            onClick={props.createSortHandler}
        >
            {props.children}
        </TableSortLabel>
    )
}

export default SortLabel