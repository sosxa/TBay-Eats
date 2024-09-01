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
    onBlur?: any

}

const Input: React.FC<InputProps> = ({ name, typeInfo, divClass, forgot, type, className, onChange, checked, inCorrectPassword, inCorrectPasswordClass, value, onClick, placeholder, readonly, required, pattern, labelClass, onBlur }) => {
    return (
        <div id="zzz" className={`w-full align-middle justify-center items-center content-center ${divClass}`}>
            <div className='w-full'>
                <label htmlFor={typeInfo} className={`w-3/4 sm:w-full text-custom-green block text-[1.05rem] font-medium leading-none sm:translate-x-0 text-left ${labelClass}`}>
                    {name}
                    <span className='text-custom-green block text-[1rem] font-medium leading-none float-right'>
                        {forgot}
                    </span>
                </label>
            </div>
            <p className={`text-red-500 text-[1rem] font-bold float-right ${inCorrectPasswordClass}`}>
                {inCorrectPassword}
            </p>
            <div className="mt-2">
                <input
                    onChange={onChange}
                    id={typeInfo}
                    name={typeInfo}
                    type={type}
                    value={value}
                    onClick={onClick}
                    placeholder={placeholder}
                    autoComplete="on"
                    required={required === undefined ? true : required}
                    className={`block w-3/4 sm:w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-custom-dark-green ring-inset placeholder:text-gray-400 outline-custom-green focus:ring-2 focus:ring-inset sm:text-[1rem] sm:leading-6 pl-3 ${className}`}
                    readOnly={readonly}
                    pattern={pattern}
                    onBlur={onBlur}
                />
            </div>
        </div>
    )
}

export default Input
