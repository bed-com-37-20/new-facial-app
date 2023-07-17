// @flow

import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useState } from 'react';

const getStyles = () => ({
    fromToContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    inputContainer: {},
    toLabelContainer: {
        width: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0
    },
    logicErrorContainer: {
        paddingTop: 0
    }
});

const DateFilterManager = (props) => {
    const { classes, onChange, value, id } = props;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.fromToContainer}>
                <div className={classes.inputContainer}>
                    <KeyboardDatePicker
                        // disableToolbar
                        variant="inline"
                        format="yyyy/MM/dd"
                        style={{ width: 150 }}
                        label={"From"}
                        maxDate={value?.endDate}
                        value={value?.startDate ? value?.startDate : null}
                        onChange={(e) => onChange(e, id, "DATE", "start")}
                    />
                </div>
                <div className={classes.toLabelContainer} />
                <div className={classes.inputContainer}>
                    <KeyboardDatePicker
                        // disableToolbar
                        variant="inline"
                        format="yyyy/MM/dd"
                        style={{ width: 150 }}
                        minDate={value?.startDate}
                        label={"To"}
                        value={value?.endDate ? value?.endDate : null}
                        onChange={(e) => onChange(e, id, "DATE", "end")}
                    />
                </div>
            </div>
        </MuiPickersUtilsProvider>

    );
}

export default withStyles(getStyles)(DateFilterManager);