import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image'

interface sectionLayoutProps {
    srcOne: StaticImageData,
    altOne: string,
    srcTwo: StaticImageData,
    altTwo: string,
    srcThree: StaticImageData,
    altThree: string,
    headerOne: string,
    paraOne: string,
    headerTwo: string,
    paraTwo: string,
    headerThree: string,
    paraThree: string,
    refDivOne?: any,
    refDivTwo?: any,
    refDivThree?: any,
    divClassOne?: any,
    divClassTwo?: any,
    divClassThree?: any
}

const sectionLayout: React.FC<sectionLayoutProps> = ({ srcOne, altOne, srcTwo, altTwo, srcThree, altThree, headerOne, paraOne, headerTwo, paraTwo, headerThree, paraThree, refDivOne, refDivTwo, refDivThree, divClassOne, divClassTwo, divClassThree }) => {
    return (
        <div className='text-center w-80 text-lg mx-auto mt-10 tracking-widest sm:w-[80%] md:flex md:flex-wrap md:justify-center lg:mt-[8rem] xl:flex-no-wrap'>

            <div ref={refDivOne} className={`md:w-[41.5%] md:mr-[3rem] lg:bg-white lg:rounded-lg lg:shadow-lg lg:flex lg:flex-col lg:justify-center lg:items-center ${divClassOne}`}>
                <h2 className='blocktext-semibold text-3xl lg:hidden'>{headerOne}</h2>
                <Image
                    src={srcOne}
                    alt={altOne}
                    width={500}
                    height={500}
                    className='hidden lg:block lg:rounded-t-lg lg:object-cover xl:w-[100%] xl:h-[100%] 2xl:w-[100%] 2xl:h-[100%]'
                />
                <h2 className='hidden lg:block lg:text-4xl lg:mt-6 xl:text-4xl 2xl:text-4xl'>{headerOne}</h2>
                <p className='mt-4 text-xl lg:w-[80%] lg:text-center xl:text-2xl 2xl:text-2xl lg:pb-10'>{paraOne}</p>
            </div>
            <div ref={refDivTwo} className={`mt-10 md:mt-0 md:w-[41.5%] md:ml-[3rem] lg:bg-white lg:rounded-lg lg:shadow-lg lg:flex lg:flex-col lg:justify-center lg:items-center ${divClassTwo}`}>
                <h2 className='blocktext-semibold text-3xl lg:hidden'>{headerTwo}</h2>
                <Image
                    src={srcTwo}
                    alt={altTwo}
                    width={500}
                    height={500}
                    className='hidden lg:block lg:rounded-t-lg lg:object-cover h-[17rem] xl:w-[100%] xl:h-[100%] 2xl:w-[100%] 2xl:h-[100%]'
                />
                <h2 className='hidden lg:block lg:text-4xl lg:mt-6 xl:text-4xl 2xl:text-4xl'>{headerTwo}</h2>
                <p className='mt-4 text-xl lg:w-[80%] lg:text-center xl:text-2xl 2xl:text-2xl lg:pb-10' >{paraTwo}</p>
            </div>
            <div ref={refDivThree} className={`mt-10 md:w-full lg:bg-white lg:rounded-lg lg:shadow-lg lg:flex lg:flex-col lg:w-[70%] lg:justify-center lg:items-center xl:w-[50%] ${divClassThree}`}>
                <h2 className='blocktext-semibold text-3xl lg:hidden'>{headerThree}</h2>
                <Image
                    src={srcThree}
                    alt={altThree}
                    width={500}
                    height={500}
                    className='hidden lg:block lg:rounded-t-lg lg:object-cover lg:w-[100%]'
                />
                <h2 className='hidden lg:block lg:text-4xl lg:mt-6 xl:text-4xl 2xl:text-4xl '>{headerThree}</h2>
                <p className='mt-4 text-xl lg:w-[80%] lg:text-center xl:text-2xl 2xl:text-2xl lg:pb-10'>{paraThree}</p>
            </div>


        </div>
    )

}

export default sectionLayout
