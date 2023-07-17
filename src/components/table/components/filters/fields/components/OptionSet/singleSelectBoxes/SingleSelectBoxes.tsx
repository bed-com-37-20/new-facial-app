import { Radio, spacersNum, colors } from '@dhis2/ui'
import { makeStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react'

const useStyle = makeStyles(() => ({
    iconDeselected: {
        fill: colors.grey700
    },
    checkbox: {
        marginTop: spacersNum.dp8,
        marginBottom: spacersNum.dp16
    }
}));

interface optionSetsProps {
    value: string
    label: string
}

interface SingleSelectBoxesProps {
    optionSets: optionSetsProps[]
    classes: any
    id: string
    onChange: (value: string, id: string) => void
    value?: string
}

function SingleSelectBoxes(props: SingleSelectBoxesProps) {
    const { optionSets, id, onChange, value = "" } = props;
    const classes = useStyle()

    const handleOptionChange = (e: any) => {
        onChange(e.value, id)
    }
    const isChecked = (localValue: string) => {
        return (value.length > 0 && value.includes(localValue));
    }

    return optionSets.map(({ value, label }, index) => (
        <Radio
            key={index}
            checked={isChecked(value)}
            label={label}
            name={`singleSelectBoxes-${index}`}
            onChange={(e) => { handleOptionChange(e); }}
            value={value}
            className={classes.checkbox}
            dense
        />
    ));
}

export default withStyles(styles)(SingleSelectBoxes)
