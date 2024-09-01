'use client';
import React from 'react'
import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
type Props = ComponentProps<"button"> & {
    pendingText?: string,
    className?:string
};

export function FormSubmitBtn({ children, pendingText, className, ...props }: Props) {
    const { pending, action } = useFormStatus();

    const isPending = pending && action === props.formAction;

    return (
        <button {...props} type="submit" aria-disabled={pending} className={`bg-custom-green hover:bg-custom-dark-green flex sm:w-full w-3/4 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600 ${className}`}>
            {isPending ? pendingText : children}
        </button>
    );
}

export default FormSubmitBtn
