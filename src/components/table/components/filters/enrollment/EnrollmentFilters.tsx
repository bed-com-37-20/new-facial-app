import React from 'react'
import { Button, IconChevronDown16 } from '@dhis2/ui';

function EnrollmentFilters() {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: 10, marginTop: 10, marginLeft: 10 }}>
            <div style={{ padding: "0.25em 0.5em 0.25em 0em" }}>
                <Button>
                    Enrollment status
                    <span style={{
                        fontSize: 20,
                        paddingLeft: 5
                    }}>
                        <IconChevronDown16 />
                    </span>
                </Button>
            </div>
            <div style={{ padding: "0.25em 0.5em 0.25em 0.25em" }}>
                <Button>
                    Enrollment date
                    <span style={{
                        fontSize: 20,
                        paddingLeft: 5
                    }}>
                        <IconChevronDown16 />
                    </span>
                </Button>
            </div>
            <div style={{ padding: "0.25em 0.5em 0.25em 0.25em" }}>
                <Button>
                    End Date
                    <span style={{
                        fontSize: 20,
                        paddingLeft: 5
                    }}>
                        <IconChevronDown16 />
                    </span>
                </Button>
            </div>
            <div style={{ padding: "0.25em 0.5em 0.25em 0.25em" }}>
                <Button>
                    More Filters
                    <span style={{
                        fontSize: 20,
                        paddingLeft: 5
                    }}>
                        <IconChevronDown16 />
                    </span>
                </Button>
            </div>
        </div>
    )
}

export default EnrollmentFilters
