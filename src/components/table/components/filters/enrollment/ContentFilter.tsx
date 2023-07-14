import { Button } from '@material-ui/core';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import MenuFilters from './MenuFilters';
import { type CustomAttributeProps } from '../../../../../types/table/attributeColumns';
import SelectButton from "../selectButton/SelectButton";

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
        let copyHeader = { ...filtersValues }
        if (type === 'DATE') {
            const date = copyHeader[key] as FiltersValuesProps

            if (pos === 'start') {
                (verifyIsFilled(value) ?? false)
                    ? date.startDate = format(value, "yyyy-MM-dd")
                    : delete date.startDate
            } else {
                (verifyIsFilled(value) ?? false)
                    ? date.endDate = format(value, "yyyy-MM-dd")
                    : delete date.endDate
            }

            copyHeader[key] = date
        } else {
            const { [key]: _, ...withoutKey } = copyHeader;
            (verifyIsFilled(value) ?? false)
                ? copyHeader[key] = value
                : copyHeader = withoutKey
        }

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
        // for (const value of Object.keys(copyHeader)) {
        //     if (typeof copyHeader[value] === 'object') {
        //         queryBuilder.push([`${value}:ge:${copyHeader[value].startDate}:le:${copyHeader[value].endDate}`])
        //     } else {
        //         if (typeof value === 'boolean') {
        //             queryBuilder.push([`${value}:eq:${copyHeader[value]}`])
        //         } else
        //             if (value.includes(',')) {
        //                 const newValue = copyHeader[value].replaceAll(",", ";")
        //                 queryBuilder.push([`${value}:in:${newValue}`])
        //             } else {
        //                 queryBuilder.push([`${value}:like:${copyHeader[value]}`])
        //             }
        //     }
        // }
        setFilters(copyHeader)
    }

    const onResetFilters = (id: string) => {
        const copyHeader = { ...filtersValues }
        // const copyFilter = { ...filters }

        const { [id]: _, ...withoutID } = copyHeader;
        setfiltersValues(withoutID)
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
                    <SelectButton key={index}
                        tooltipContent=''
                        title={colums.displayName}
                        value={filtersValues[colums.id]}
                        colum={colums}
                        onQuerySubmit={onQuerySubmit}
                        onChange={onChangeFilters}
                        disabledReset={
                            typeof filtersValues[colums.id] === "object"
                                ? filtersValues[colums.id].startDate !== undefined && filtersValues[colums.id].endDate === undefined
                                : filtersValues[colums.id] === undefined
                        }
                        disabled={false}
                        filled={""}
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
