import React from 'react'
import { Pagination, TableComponent } from '../components'
import RenderHeader from './RenderHeader'
import RenderRows from './RenderRows'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import WithBorder from '../../template/WithBorder';
import WithPadding from '../../template/WithPadding';

const usetStyles = makeStyles({
    tableContainer: {
        overflowX: 'auto'
    }
});

function Table() {
    const classes = usetStyles()
    return (
        <Paper>
            <WithPadding>
                <WithBorder type='all' >
                    <WithPadding />
                    <div
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
                                            header: 'Id',
                                            optionSets: []
                                        },
                                        {
                                            id: 'id2',
                                            header: 'Id2',
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
                        <Pagination
                            loading={false}
                            page={1}
                            rowsPerPage={10}
                            onRowsPerPageChange={() => { }}
                            onPageChange={() => { }}
                            totalPerPage={10}
                            totalPages={10}
                        />
                    </div>
                </WithBorder>
            </WithPadding>
        </Paper>
    )
}

export default Table
