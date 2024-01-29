import React from 'react'
import { WithPaddingProps } from '../../types/common/components';

function WithPadding(props: WithPaddingProps): React.ReactElement {
    const { children, padding = "0.5rem" } = props;

    return (
        <div
            style={{ padding: padding }}
        >
            {children}
        </div>
    )
}

export default WithPadding
