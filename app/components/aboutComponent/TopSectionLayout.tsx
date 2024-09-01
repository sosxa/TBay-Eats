import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface topSectionLayoutProps {
    firstText?: string,
    secondText?: string,
    firstImage: StaticImageData,
    secondImage: StaticImageData,
    firstAlt: string,
    secondAlt: string,
    firstHeader?: string,
    secondHeader?: string,
    firstHeaderRef?: any,
    secondHeaderRef?: any,
    firstTxtRef?: any,
    secondTxtRef?: any,
    firstImgRef?: any,
    secondImgRef?: any,
    firstHeaderClass?: any,
    seconHeaderClass?: any,
    firstImgClass?: any,
    secondImgClass?: any,
    firstTxtClass?: any,
    secondTxtClass?: any
}

// first header, first text, first img, second header, second text, second img

const topSectionLayout: React.FC<topSectionLayoutProps> = ({ firstText, secondText, firstImage, secondImage, firstAlt, secondAlt, firstHeader, secondHeader, firstHeaderRef, secondHeaderRef, firstTxtRef, secondTxtRef, firstImgRef, secondImgRef, firstHeaderClass, seconHeaderClass, firstImgClass, secondImgClass, firstTxtClass, secondTxtClass }) => {
    return (
        <div className='block lg:grid '>
            <div className='text-center w-80 text-lg mx-auto mt-10 tracking-widest sm:w-[80%] lg:place-items-center'>
                <h2 className={`blocktext-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-5xl ${firstHeaderClass}`} ref={firstHeaderRef}>
                    {firstHeader}
                </h2>
                <div className='lg:mt-10'>
                    <Image
                        ref={firstImgRef}
                        src={firstImage}
                        alt={firstAlt}
                        width={500}
                        height={350}
                        className={`hidden lg:block lg:object-cover lg:w-[19rem] lg:h-[20rem] lg:rounded-lg float-left xl:w-[25rem] xl:h-[25rem] 2xl:w-[35rem] 2xl:h-[35rem] ${firstImgClass}`}
                    />
                    <p ref={firstTxtRef} className={`mt-4 text-xl lg:w-1/2 lg:float-right lg:text-right xl:text-2xl 2xl:text-3xl ${firstTxtClass}`}>{firstText}</p>
                </div>
            </div>
            <div>
                <div className='text-center w-80 text-lg mx-auto mt-10 tracking-widest sm:w-[80%] lg:place-items-center'>
                    <h2 ref={secondHeaderRef} className={`blocktext-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-5xl ${seconHeaderClass}`}>
                        {secondHeader}
                    </h2>
                    <div className='lg:mt-10'>
                        <Image
                            ref={secondImgRef}
                            src={secondImage}
                            alt={secondAlt}
                            width={500}
                            height={500}
                            className={`hidden lg:block lg:object-cover lg:w-[19rem] lg:h-[20rem] lg:rounded-lg lg:float-right xl:w-[25rem] xl:h-[25rem] 2xl:w-[35rem] 2xl:h-[35rem] ${secondImgClass}`}
                        />
                        <p ref={secondTxtRef} className={`mt-4 text-xl lg:text-left lg:w-1/2 xl:text-2xl 2xl:text-3xl ${secondTxtClass}`}>{secondText}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default topSectionLayout
