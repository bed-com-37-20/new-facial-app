import React from 'react'
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { RowCell, RowTable } from '../components';
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { OptionSet } from '../../../types/generated';

type headerDataProps = {
    id: string,
    header: string,
    optionSets?: Array<OptionSet>,
}

type RenderHeaderProps = {
    rowsData: Array<any>,
    headerData: Array<headerDataProps>,
}

const usetStyles = makeStyles({
    row: { width: "100%" },
    dataRow: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#F1FBFF',
        },
    },
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
    })
});

function RenderRows({ headerData, rowsData }: RenderHeaderProps): React.ReactElement {
    const classes = usetStyles()

    if (!rowsData || rowsData.length === 0) {
        return (
            <RowTable
                className={classes.row}
            >
                <RowCell
                    className={classNames(classes.cell, classes.bodyCell)}
                    colspan={headerData.length}
                >
                    {i18n.t('Nenhum dado para mostrar')}
                </RowCell>
            </RowTable>
        );
    }

    return (
        <React.Fragment>
            {
                rowsData?.map((row, index) => {
                    const cells = headerData.map(column => (
                        <RowCell
                            key={column.id}
                            className={classNames(classes.cell, classes.bodyCell)}
                        >
                            <div>
                                {getDisplayName({ attribute: column.id, headers: headerData, value: row[column.id] })}
                            </div>
                        </RowCell>
                    ));
                    return (
                        <RowTable
                            key={index}
                            className={classNames(classes.row, classes.dataRow)}
                        >
                            {cells}
                        </RowTable>
                    );
                })
            }
        </React.Fragment>
    )
}

export default RenderRows