import React, { useMemo } from 'react'
import MultiSelectBoxes from '../MultiSelectBoxes/MultiSelectBoxes';
import { multiOrientations } from '../MultiSelectBoxes/multiSelectBoxes.const';
import SingleSelectBoxes from '../SingleSelectBoxes/SingleSelectBoxes';
import { singleOrientations } from '../SingleSelectBoxes/singleSelectBoxes.const';
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