import React, { useMemo } from 'react'
import MultiSelectBoxes from '../multiSelectBoxes/MultiSelectBoxes';
import { multiOrientations } from '../multiSelectBoxes/multiSelectBoxes.const';
import SingleSelectBoxes from '../singleSelectBoxes/SingleSelectBoxes';
import { singleOrientations } from '../singleSelectBoxes/singleSelectBoxes.const';
import { orientations } from './selectBoxes.const';

function SelectBoxes(props) {
    const { singleSelect, options, optionSet, orientation, ...passOnProps } = props;

    // $FlowFixMe even with a cheat flow could not figure out this one
    const outputOptions = useMemo(() => {
        if (optionSet) {
            return optionSet.options
                .map(({ text, value }) => ({ text, value }));
        }
        return options;
    }, [optionSet, options]);

    const [SelectBoxesTypeComponent, typeOrientation] = singleSelect ?
        [SingleSelectBoxes, orientations.VERTICAL ? singleOrientations.VERTICAL : singleOrientations.HORIZONTAL] : 
        [MultiSelectBoxes, orientations.VERTICAL ? multiOrientations.VERTICAL : multiOrientations.HORIZONTAL];

    return (
        <SelectBoxesTypeComponent
            {...passOnProps}
            orientation={typeOrientation}
            options={outputOptions}
        />
    );
}

export default SelectBoxes