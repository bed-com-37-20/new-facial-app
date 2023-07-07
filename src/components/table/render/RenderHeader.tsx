import React from 'react'
import { HeadTable, RowTable, SortLabel } from '../components'
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { OptionSet } from '../../../types/generated';

type rowsHeaderProps = {
    id: string,
    header: string,
    optionSets?: Array<OptionSet>,
}

type renderHeaderProps = {
    rowsHeader: Array<rowsHeaderProps>,
    orderBy: string,
    order: string,
    //TODO resolve this bug.👇
    createSortHandler: (property: string) => any,
}

const useStyles = makeStyles({
    row: { width: "100%" },
    cell: (theme: Theme) => ({
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 7}px ${theme.spacing.unit /
            2}px ${theme.spacing.unit * 3}px`,
        '&:last-child': {
            paddingRight: theme.spacing.unit * 3,
        },
        borderBottomColor: "rgba(224, 224, 224, 1)",
    }),
    bodyCell: (theme: Theme) => ({
        fontSize: theme.typography.pxToRem(13),
        color: theme.palette.text.primary,
    }),
    headerCell: (theme: Theme) => ({
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        // $FlowFixMe
        fontWeight: theme.typography.fontWeightMedium,
    }),
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    }
});

function RenderHeader(props: renderHeaderProps): React.ReactElement {
    const { rowsHeader, order, orderBy, createSortHandler } = props
    const classes = useStyles()
    const columnHeaderInstances = []

    function setColumnWidth(columnInstance: any, index: any) {
        if (columnInstance) {
            columnHeaderInstances[index] = columnInstance;
        }
    }

    const headerCells = rowsHeader?.map((column, index) => (
        <HeadTable
            innerRef={(instance: any) => { setColumnWidth(instance, index) }}
            key={column.id}
            className={classNames(classes.cell, classes.headerCell)}
        >
            {/* TODO: the sortLabel must be optional 👇*/}
            <SortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                createSortHandler={createSortHandler(column.id)}
            >
                {column.header}
                {orderBy === column.id ? (
                    <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                ) : null}
            </SortLabel>
        </HeadTable>
    ))

    return (
        <RowTable
            className={classes.row}
        >
            {headerCells}
        </RowTable>
    )
}

export default RenderHeader