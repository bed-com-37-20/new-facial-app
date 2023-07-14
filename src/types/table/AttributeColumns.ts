import { type Attribute } from "../generated"

interface OptionSetProps {
    value: string
    label: string
}

enum CustomValueType {
    LIST = "LIST"
}

export interface CustomAttributeProps {
    id: string
    displayName: string
    header: string
    required: string | boolean
    name: string
    labelName: string
    valueType: (typeof Attribute.valueType) & (typeof CustomValueType)
    options: {
        optionSet: [OptionSetProps]
    }
    visible: boolean
    disabled: boolean
    pattern?: string
    searchable?: boolean
    error?: boolean
    content?: string
}
