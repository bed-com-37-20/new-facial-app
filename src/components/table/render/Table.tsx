import React from 'react'
import { TableComponent } from '../components'
import RenderHeader from './RenderHeader'
import RenderRows from './RenderRows'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const usetStyles = makeStyles({
    tableContainer: {
        overflowX: 'auto'
    }
});

function Table() {
    const classes = usetStyles()
    return (
        <Paper>
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
                            rowsHeader={[
                                {
                                    id: 'id',
                                    header: 'ID',
                                    optionSets: []
                                },
                                {
                                    id: 'id2',
                                    header: 'ID2',
                                    optionSets: []
                                }
                            ]}
                        />
                        <RenderRows
                            headerData={[
                                {
                                    id: 'id',
                                    header: 'ID',
                                    optionSets: []
                                },
                                {
                                    id: 'id2',
                                    header: 'ID2',
                                    optionSets: []
                                }
                            ]}
                            rowsData={[
                                { id: "111", id2: "2222" },
                                { id: "222", id2: "2222" }
                            ]}
                        />
                    </>
                </TableComponent>
            </div>
        </Paper>
    )
}

export default Table
