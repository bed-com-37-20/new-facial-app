import React from 'react'
import DateFilterManager from './components/Date/DateFilterManager';
import SelectBoxes from './components/OptionSet/SelectBoxes/SelectBoxes';
import TextFilter from './components/Text/Text'
import TrueOnly from './components/TrueOnly/TrueOnly';
import { type CustomAttributeProps } from '../../../../../types/table/AttributeColumns';

interface FilterComponentProps {
    type: CustomAttributeProps["valueType"]
    column: CustomAttributeProps
    onChange: () => void
    value: any
}

function FilterComponents(props: FilterComponentProps) {
    // eslint-disable-next-line react/prop-types
    const { type, column, onChange, value } = props;

    switch (String(type)) {
        case type.LIST:
            return <SelectBoxes {...column}
                onChange={onChange}
                value={value}
                {...column}
            />
        case type.DATE:
            return <DateFilterManager
                onChange={onChange}
                value={value}
                {...column}
            />
        case type.TEXT:
            return <TextFilter
                onChange={onChange}
                value={value}
                {...column}
            />
        case type.TRUE_ONLY:
            return <TrueOnly
                onChange={onChange}
                value={value}
                {...column}
            />
        case type.INTEGER_ZERO_OR_POSITIVE:
            return <TrueOnly
                onChange={onChange}
                value={value}
                {...column}
            />
        default:
            return <div>not mapped</div>
    }
}

export default FilterComponents
