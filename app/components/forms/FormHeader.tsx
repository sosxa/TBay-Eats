import React, { ReactNode } from 'react'

interface FormHeaderProps {
    title?: string,
    para?: string,
    textClass?: string,
    children? : ReactNode,
    classname?: string
}

const FormHeader: React.FC<FormHeaderProps> = ({title, para, textClass, children, classname}) => {
  return (
    <center className={textClass}>
          <h2 className={`sm:text-6xl sm:pb-8 text-4xl pb-2 font-bold ${classname}`}>{title}</h2>
          <p className='text-base sm:text-xl'>{para}</p>
          {children}
        </center>
  )
}

export default FormHeader
