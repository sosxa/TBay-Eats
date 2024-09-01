import React , {ReactNode} from 'react'
interface FormProps  {
    children?: ReactNode,
    action?: (value: any) => any,
    className: string,
    method: string,
    formClass?: string,
    onClick?: (value: any) => any,
}

const Form: React.FC<FormProps> = ({children, action, className, method, formClass, onClick}) => {
  return (
    <div className={formClass}>
    <form className={className} action={action} method={method} onClick={onClick}>
      {children}
    </form>
    </div>
  )
}

export default Form
