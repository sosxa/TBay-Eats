'use client';
import React from 'react'

interface BreadCrumProps {
    textOne?: string,
    linkOne?: string,
    textTwo?: string,
    linkTwo?: string,
    textThree?: string,
    linkThree?: string,
    textFour?: string,
    linkFour?: string,
    textFive?: string,
    linkFive?: string,
    activeOne?: boolean,
    activeTwo?: boolean,
    activeThree?: boolean,
    activeFour?: boolean,
    activeFive?: boolean,
}

const BreadCrums: React.FC<BreadCrumProps> = ({
    textOne,
    linkOne,
    textTwo,
    linkTwo,
    textThree,
    linkThree,
    textFour,
    linkFour,
    textFive,
    linkFive,
    activeOne,
    activeTwo,
    activeThree,
    activeFour,
    activeFive,
}) => {
    return (
        <div>
            <center>
                <nav className="flex flex-wrap" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <a href={linkOne} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                                <p className={activeOne ? "text-custom-green" : ""}>{textOne}</p>
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                </svg>
                                <a href={linkTwo} className={activeTwo ? "ms-1 text-sm font-medium text-custom-green md:ms-2" : "ms-1 text-sm font-medium text-gray-700 md:ms-2"}>{textTwo}</a>
                            </div>
                        </li>
                        {textThree && linkThree && (
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <a href={linkThree} className={activeThree ? "ms-1 text-sm font-medium text-custom-green md:ms-2" : "ms-1 text-sm font-medium text-gray-500 md:ms-2"}>{textThree}</a>
                                </div>
                            </li>
                        )}
                        {textFour && linkFour && (
                            <li>
                                <div className="flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <a href={linkFour} className={activeFour ? "ms-1 text-sm font-medium text-custom-green md:ms-2" : "ms-1 text-sm font-medium text-gray-500 md:ms-2"}>{textFour}</a>
                                </div>
                            </li>
                        )}
                        {textFive && linkFive && (
                            <li>
                                <div className="flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                    </svg>
                                    <a onClick={() => window.location.reload()} className={activeFive ? "hover:cursor-pointer ms-1 text-sm font-medium text-custom-green md:ms-2" : "ms-1 text-sm font-medium text-gray-500 md:ms-2"}>{textFive}</a>
                                </div>
                            </li>
                        )}
                    </ol>
                </nav>
            </center>
        </div>
    )
}

export default BreadCrums
