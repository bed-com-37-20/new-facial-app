import React from 'react'
import { TableComponent } from '../components'
import RenderHeader from './RenderHeader'
import RenderRows from './RenderRows'
import { makeStyles } from '@material-ui/core/styles';

const usetStyles = makeStyles({
    tableContainer: {
        overflowX: 'auto'
    }
});

function Table() {
    const classes = usetStyles()
    return (
        <div
            // eslint-disable-next-line react/prop-types
            className={classes.tableContainer}
        >
            <TableComponent>
                <>
                    <RenderHeader
                        createSortHandler={() => { }}
                        order='asc'
                        orderBy='desc'
                        rowsHeader={[]}
                    />
                    <RenderRows
                        headerData={[{
                            id: 'id',
                            header: 'ID',
                            optionSets: []
                        }]}
                        rowsData={[]}
                    />
                </>
            </TableComponent>
        </div>
    )
}

export default Table
