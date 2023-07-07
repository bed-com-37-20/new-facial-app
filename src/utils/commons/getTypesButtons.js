export function getTypesOfButton(props) {
    const possibleTypes = ['primary', 'success', 'error', 'secondary', 'info', 'dark', 'warning']
    for (const type of possibleTypes) {
        // eslint-disable-next-line no-prototype-builtins, @typescript-eslint/strict-boolean-expressions
        if (props.hasOwnProperty(type)) {
            return type
        }
    }
}
