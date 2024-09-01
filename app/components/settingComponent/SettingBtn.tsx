'use client';
import React from 'react'
import Image, { StaticImageData } from 'next/image';
import { useFormStatus } from 'react-dom';
import FormHeader from '../forms/FormHeader';

interface SettingBtnProps {
    className?: string,
    children?: React.ReactNode,
    pendingText?: string,
    formAction?: string, // Add this line
    alt: string,
    src: StaticImageData,
    value?: string,
}

const SettingBtn: React.FC<SettingBtnProps> = ({value, children, className, pendingText, formAction, alt, src, ...props }: SettingBtnProps) => {
    const { pending, action } = useFormStatus();

    const isPending = pending && action === formAction; // Use formAction instead of props.formAction

    return (
        <div className=''>
            <button {...props} value={value} type="submit" aria-disabled={pending} disabled className={`bg-green-400 h-[3rem] hover:bg-custom-dark-green flex align-center lg:w-full w-3/4 translate-x-[15%] sm:translate-x-0 justify-center rounded-md px-3 py-1.5 text-lg font-medium leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-600 pt-3 ${className}`}
            >
                <div className='w-10 h-10 -translate-y-[0.15rem] pr-2'>
                    <Image
                        src={src}
                        width={100}
                        height={100}
                        alt={alt}
                        layout="responsive"
                        className=''
                        loading="lazy"
                    />
                </div>
                {isPending ? pendingText : children}

            </button>
        </div>
    );
}

export default SettingBtn