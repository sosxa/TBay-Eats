import React, { ChangeEvent, ReactNode } from 'react'

interface RadioInputProps {
    name: string,
    typeInfo: string,
    divClass?: string,
    className?: string,
    value: string,
    onChange?: any,
    checked?: boolean,
    labelName?: string
}

const RadioInput: React.FC<RadioInputProps> = ({ name, typeInfo, divClass, className, onChange, checked, value, labelName }) => {
    return (
        <div className={divClass}>
            <label htmlFor={typeInfo} className="text-custom-green block text-sm font-medium leading-none">
                {labelName}
            </label>
            <div className="mt-2">
                <input
                    id={typeInfo}
                    name={typeInfo}
                    type="radio"
                    value={value}
                    required
                    className={`w-4 h-4 text-custom-green bg-white border-white accent-custom-green ring-offset-white ${className}`}
                />
            </div>
        </div>
    )
}

export default RadioInput
