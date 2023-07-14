import { Radio, spacersNum, colors } from '@dhis2/ui'
import { withStyles } from '@material-ui/styles';
import React from 'react'


const styles = () => ({
    iconDeselected: {
        fill: colors.grey700,
    },
    checkbox: {
        marginTop: spacersNum.dp8,
        marginBottom: spacersNum.dp16,
    },
});

function SingleSelectBoxes(props) {
    // eslint-disable-next-line react/prop-types
    const { optionSets, classes, id, onChange, value="", valueType } = props;

    const handleOptionChange = (e) => {
        onChange(e.value, id)
    }
    const isChecked = (localValue) => {
        return !!(value && value.includes(localValue));
    }

    return optionSets.map(({ code: value, displayName: label }, index) => (
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

export default withStyles(styles)(SingleSelectBoxes);