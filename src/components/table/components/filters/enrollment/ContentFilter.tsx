/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Button } from '@material-ui/core';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import SelectBottom from '../../../selectBottom/SelectBottom.js'
import MenuFilters from './MenuFilters';
import { type CustomAttributeProps } from '../../../../../types/table/AttributeColumns.js';

interface ContentFilterProps {
    headers: CustomAttributeProps[]
}

type FiltersValuesProps = Record<string, any | { endDate: string } | { startDate: string }>;

function ContentFilter(props: ContentFilterProps) {
    const { headers } = props;
    const [filters, setFilters] = useState<FiltersValuesProps>({})
    const [filtersValues, setfiltersValues] = useState<FiltersValuesProps>({})
    const [localFilters, setlocalFilters] = useState<CustomAttributeProps[]>([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [resetValues, setresetValues] = useState("")
    let queryBuilder: any[][];

    useEffect(() => {
        const copyHeader = [...headers]
        setlocalFilters(copyHeader.slice(0, 4))
    }, [headers])

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const addSearchableHeaders = (e: CustomAttributeProps) => {
        const copyHeader = [...headers]
        const copyHeaderLocal = [...localFilters]

        const pos = copyHeader.findIndex(x => x.id === e.id)
        copyHeaderLocal.push(copyHeader[pos])
        setlocalFilters(copyHeaderLocal)
    }

    const onChangeFilters = (value: any, key: string, type: string, pos: string) => {
        const copyHeader = { ...filtersValues }
        if (type === 'DATE') {
            const date = copyHeader[key] as FiltersValuesProps
            if (pos === 'start') {
                (verifyIsFilled(value) ?? false) ? date.startDate = format(value, "yyyy-MM-dd") : delete date.startDate
            } else {
                (verifyIsFilled(value) ?? false) ? date.endDate = format(value, "yyyy-MM-dd") : delete date.endDate
            }
            copyHeader[key] = date
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        } else { (verifyIsFilled(value) ?? false) ? copyHeader[key] = value : delete copyHeader[key] }

        setfiltersValues(copyHeader);
    }

    function verifyIsFilled(value: string) {
        if (value != null) {
            return true
        } else if (value === "") {
            return false
        }
    }

    const onQuerySubmit = () => {
        const copyHeader = { ...filtersValues }
        for (const value of Object.keys(copyHeader)) {
            if (typeof copyHeader[value] === 'object') {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                queryBuilder.push([`${value}:ge:${copyHeader[value].startDate}:le:${copyHeader[value].endDate}`])
            } else {
                if (typeof value === 'boolean') {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    queryBuilder.push([`${value}:eq:${copyHeader[value]}`])
                } else
                    if (value.includes(',')) {
                        const newValue = copyHeader[value].replaceAll(",", ";")
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        queryBuilder.push([`${value}:in:${newValue}`])
                    } else {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        queryBuilder.push([`${value}:like:${copyHeader[value]}`])
                    }
            }
        }
        setFilters(copyHeader)
    }

    const onResetFilters = (id: string) => {
        const copyHeader = { ...filtersValues }
        const copyFilter = { ...filters }
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete copyHeader[id]
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete copyFilter[id]
        setfiltersValues(copyHeader)
        setresetValues(id)
    }

    useEffect(() => {
        if (resetValues.length > 0) {
            onQuerySubmit()
            setresetValues("")
        }
    }, [resetValues])

    return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: 10, marginTop: 10 }}>
            {
                localFilters.map((colums, index) => (
                    <SelectBottom key={index}
                        title={colums.displayName}
                        value={filtersValues[colums.id]}
                        colum={colums}
                        onQuerySubmit={onQuerySubmit}
                        onChange={onChangeFilters}
                        disabledReset={typeof filtersValues[colums.id] === "object" ? filtersValues[colums.id].startDate !== undefined && filtersValues[colums.id].endDate === undefined : filtersValues[colums.id] === undefined}
                        disableb={colums.valueType.DATE === "DATE"
                            ? Object.prototype.hasOwnProperty.call(filters, colums.id) ? filters[colums.id].startDate === filtersValues[colums.id].startDate && filters[colums.id].endDate === filtersValues[colums.id].endDate : !(Object.prototype.hasOwnProperty.call(filtersValues, colums.id) && Object.keys(filtersValues[colums.id]).length > 0)
                            : filters[colums.id] === filtersValues[colums.id]
                        }
                        filled={colums.valueType.DATE === "DATE"
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions
                            ? Object.keys(filters[colums.id]).length > 0 && `${filters[colums.id].startDate && filters[colums.id]?.startDate}${(filters[colums.id]?.endDate) && "- ".concat(filters[colums.id].endDate)})`
                            : filters[colums.id] && filters[colums.id]
                        }
                        onResetFilters={onResetFilters}
                    />
                ))
            }
            <div style={{ marginTop: 0 }}>
                {headers.filter(x => !localFilters.includes(x)).length > 0 &&
                    <Button style={{
                        color: "rgb(33, 41, 52)",
                        fontSize: 14,
                        textTransform: "none",
                        fontWeight: 400
                    }}

                        variant='outlined'
                        onClick={handleClick}
                    >
                        Mais filtros
                    </Button>
                }
                <MenuFilters
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    options={headers.filter(x => !localFilters.includes(x))}
                    addSearchableHeaders={addSearchableHeaders}
                />
            </div>

        </div>
    )
}

export default ContentFilter
