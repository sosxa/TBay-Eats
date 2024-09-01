'use client';
import React, { useEffect, useState } from 'react'
import fetchUser from '../profileFunctions/fetchUser'
import RestaurantClient from '../../components/restaurantComponent/RestaurantClient';
import FavoriteClient from '../../components/favoriteComponent/FavoriteClient';

const decideAside = () => {

    const [userType, setUserType] = useState("");

    useEffect(() => {

        const fetchData = async () => {
            const user = await fetchUser();
            setUserType(user);
        };
        fetchData()


    }, [userType])

    return (
        <div>
            {userType === "owner" && (<RestaurantClient  searchParams={{ message: '' }} />)}
            {userType === "customer" && (<FavoriteClient searchParams={{ message: '' }}  />)}
        </div>
    )
} 

export default decideAside
