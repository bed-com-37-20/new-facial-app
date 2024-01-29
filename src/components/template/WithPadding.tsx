import React from 'react'
import { WithPaddingProps } from '../../types/common/components';

export default function WithPadding(props: WithPaddingProps): React.ReactElement {
    const { children, padding = "0.5rem" } = props;

    return (
        <div
            style={{ padding: padding }}
        >
            {children}
        </div>
    )
}