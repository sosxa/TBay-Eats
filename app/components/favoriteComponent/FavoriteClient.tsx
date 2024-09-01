'use client';
import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import FormHeader from '../forms/FormHeader'

interface FavoriteClientProps {
    classname?: string;
    searchParams?: { message: string };
}

const FavoriteClient = ({ classname, searchParams }: FavoriteClientProps) => {

    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(false);
    }, [])

    return (
        <div>
            < div className={`w-[100%] sm:w-[80%] sm:translate-x-[2rem] md:translate-x-[5rem] 2xl:w-[55%] 2xl:translate-x-[3rem] ${classname}`}>
                <div className='text-center w-full'>
                    {loading ? <Skeleton className='h-[5rem]' /> : <FormHeader classname='xl:text-5xl 2xl:text-5xl' textClass='text-custom-green' title="Your 
                Favorite Restaurants" />}
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit ab, nam voluptatum doloremque saepe ducimus aliquam! Dolorem quaerat facilis odio incidunt architecto fugit repellendus veniam animi, ex, fuga repellat aperiam.</p>
                </div>
            </div>
        </div>
    )
}

export default FavoriteClient
