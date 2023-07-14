import { withStyles } from '@material-ui/core';
import React from 'react'
import SelectBoxes from './SelectBoxes/SelectBoxes';


const getStyles = () => ({
    selectBoxesContainer: {
        maxHeight: 250,
        overflowY: 'auto',
    },
    selectBoxesInnerContainer: {
        marginLeft: 12,
    },
});


function OptionSet(props) {
    const { onCommitValue, options, value, classes, singleSelect } = props;
    return (
        <div
            className={classes.selectBoxesContainer}
        >
            <div className={classes.selectBoxesInnerContainer}>
                { /* $FlowFixMe */}
                <SelectBoxes
                    options={options}
                    value={value}
                    onBlur={onCommitValue}
                    orientation={orientations.VERTICAL}
                    multiSelect={!singleSelect}
                    nullable
                />
            </div>
        </div>
    )
}

export default withStyles(getStyles)(OptionSet)