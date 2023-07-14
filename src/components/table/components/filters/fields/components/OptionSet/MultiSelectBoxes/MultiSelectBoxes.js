import { Checkbox, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import React from 'react'


const styles = theme => ({
    label: theme.typography.formFieldTitle,
    checkbox: {
        marginTop: spacersNum.dp8,
        marginBottom: spacersNum.dp16,
    },
});

let checkedValues = "";
function MultiSelectBoxes(props) {
    const { optionSets, classes, id, onChange, value = "", valueType } = props;

    const handleOptionChange = (e) => {
        checkedValues = value;
        if (e.checked) {
            checkedValues = checkedValues + e.value + ","
        } else {
            const localValue = checkedValues.split(",")
            checkedValues = localValue.filter(x => x !== e.value).join(",");
        }
        onChange(checkedValues, id, valueType)
        checkedValues = ""
    }

    const isChecked = (localValue) => {
        if (value.length === 0) {
            return false;
        }
        return value.split(",").filter(x => x === localValue).length > 0;
    }

    return optionSets.map(({ text, code: value, displayName: header }, index) => (
        <Checkbox
            key={index}
            checked={isChecked(value)}
            label={header}
            name={`multiSelectBoxes-${index}`}
            onChange={(e) => { handleOptionChange(e); }}
            value={value}
            className={classes.checkbox}
            dense
        />
    ));
}

export default withStyles(styles)(MultiSelectBoxes)