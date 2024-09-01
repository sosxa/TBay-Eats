import React, { ReactNode } from 'react'

interface InputProps {
    name: string,
    type: string,
    typeInfo: string,
    divClass?: string,
    className?: string,
    forgot?: ReactNode,
    inCorrectPassword?: string,
    inCorrectPasswordClass?: string,
    value?: string,
    checked?: (value: string) => string;
    onChange?: any,
    onClick?: any,
    placeholder?: string
    readonly?: boolean,
    required?: boolean,
    pattern?: string,
    labelClass?: string,

}

const TextArea: React.FC<InputProps> = ({ name, typeInfo, divClass, forgot, className, onChange, checked, inCorrectPassword, inCorrectPasswordClass, value, onClick, placeholder, readonly, required, labelClass }) => {



    return (
        <div className={divClass}>
            <label htmlFor={typeInfo} className={`text-custom-green block text-[1.05rem] font-medium leading-none${labelClass}`}>
                {name}
            </label>
            <div className='text-[1rem] float-right sm:translate-x-0'>
                {forgot}
            </div>
            <div className={`text-red-500 text-[1rem] font-bold float-right ${inCorrectPasswordClass}`}>
                {inCorrectPassword}
            </div>
            <div className="mt-2">
                <textarea
                    onChange={onChange}
                    id={typeInfo}
                    name={typeInfo}
                    value={value}
                    onClick={onClick}
                    placeholder={placeholder}
                    autoComplete="on"
                    required={required === undefined ? true : required}
                    className={`block w-3/4 sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-custom-dark-green ring-inset outline-custom-green placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6 pl-3 text-[1rem] ${className}`}
                    readOnly={readonly}
                />
            </div>
        </div>





    )
}

export default TextArea
