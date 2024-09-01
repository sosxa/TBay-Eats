'use client';
import React, { useRef, useState, useEffect } from 'react';
import TopSectionLayout from './TopSectionLayout'
import SectionLayout from './SectionLayout'
import manOnBike from "../../manOnBike.jpg"
import foodBag from "../../foodBag.jpg"
import restaurant from "../../restaurant.jpg";
import famEating from "../../famEating.jpg";
import joinUs from "../../joinUs.jpg";

const CombinedScroll = () => {
    // ref to refer to elements 
    const firstHeaderRef = useRef()
    const secondHeaderRef = useRef()
    const firstImgRef = useRef();
    const secondImgRef = useRef();
    const firstTxtRef = useRef();
    const secondTxtRef = useRef();
    const divOneRef = useRef();
    const divTwoRef = useRef();
    const divThreeRef = useRef();

    const [active, setActive] = useState({
        firstHeader: false,
        secondHeader: false,
        firstImg: false,
        secondImg: false,
        firstTxt: false,
        secondTxt: false,
        divOne: false,
        divTwo: false,
        divThree: false,

    });

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetRef = entry.target;
                const isIntersecting = entry.isIntersecting;

                if (targetRef === firstHeaderRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, firstHeader: true }));
                }
                if (targetRef === firstTxtRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, firstTxt: true }));
                }
                if (targetRef === firstImgRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, firstImg: true }));
                }
                if (targetRef === secondHeaderRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, secondHeader: true }));
                }
                if (targetRef === secondTxtRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, secondTxt: true }));
                }
                if (targetRef === secondImgRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, secondImg: true }));
                }
                if (targetRef === divOneRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, divOne: true }));
                }
                if (targetRef === divTwoRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, divTwo: true }));
                }
                if (targetRef === divThreeRef.current && isIntersecting) {
                    setActive(prevState => ({ ...prevState, divThree: true }));
                }
            });
        });

        if (firstHeaderRef.current) { observer.observe(firstHeaderRef.current); }
        if (secondHeaderRef.current) { observer.observe(secondHeaderRef.current); }
        if (firstImgRef.current) { observer.observe(firstImgRef.current); }
        if (secondImgRef.current) { observer.observe(secondImgRef.current); }
        if (firstTxtRef.current) { observer.observe(firstTxtRef.current); }
        if (secondTxtRef.current) { observer.observe(secondTxtRef.current); }
        if (divOneRef.current) { observer.observe(divOneRef.current); }
        if (divTwoRef.current) { observer.observe(divTwoRef.current); }
        if (divThreeRef.current) { observer.observe(divThreeRef.current); }

        return () => {
            observer.disconnect();
        };
    }, []); // Empty dependency array to run only once on component mount



    return (
        <div>
            <TopSectionLayout
                firstImage={manOnBike}
                // 
                firstHeaderRef={firstHeaderRef} secondHeaderRef={secondHeaderRef} firstImgRef={firstImgRef} secondImgRef={secondImgRef} firstTxtRef={firstTxtRef} secondTxtRef={secondTxtRef}
                firstHeaderClass={active.firstHeader && "animate__animated animate__slideInUp"} firstImgClass={active.firstImg && "animate__animated animate__slideInUp"} firstTxtClass={active.firstTxt && "animate__animated animate__slideInUp"} seconHeaderClass={active.secondHeader && "animate__animated animate__slideInUp"} secondImgClass={active.secondImg && "animate__animated animate__slideInUp"} secondTxtClass={active.secondTxt && "animate__animated animate__slideInUp"}
                // 
                firstAlt='Image of a man riding a bike with a delivery bag on his back, in the rain.'
                secondImage={foodBag}
                secondAlt='Image of a bag of food being scanned and prepared to go out for delivery.'
                firstText='We envision a world where every meal is a celebration of culture and community. TBay Eats aims to be the leading platform for food catering services, where convenience meets quality. Our goal is to create a space where food is more than sustenance; it’s a shared experience that brings people together.'
                secondText='Born from a love of food and community, TBay Eats started as a small idea in a bustling neighborhood kitchen. Our founders, food enthusiasts themselves, saw the need for a service that not only catered to the taste buds but also supported local restaurants. From those humble beginnings, TBay Eats has grown into a trusted platform that connects customers with the best culinary experiences in town.'
                firstHeader='Our Vision'
                secondHeader='Our Story'

            />
            <SectionLayout
                // 
                refDivOne={divOneRef}
                refDivTwo={divTwoRef}
                refDivThree={divThreeRef}
                divClassOne={active.divOne && "animate__animated animate__slideInUp"}
                divClassTwo={active.divTwo && "animate__animated animate__slideInUp"}
                divClassThree={active.divThree && "animate__animated animate__slideInUp"}
                // 
                srcOne={restaurant} altOne='Restaurant'
                srcTwo={famEating} altTwo='Family eating takout at home'
                srcThree={joinUs} altThree='A group of people putting there hands together'
                headerOne='For Restaurants'
                paraOne='TBay Eats is your partner in growth. We provide a digital storefront to showcase your culinary creations, connect with new customers, and build a loyal following. Our platform is designed to help your restaurant thrive in the digital age, with tools and insights that streamline operations and boost visibility.'
                headerTwo='For Customers'
                paraTwo='Your next memorable meal is just a few clicks away. TBay Eats offers a diverse selection of catering options to suit any occasion. With user-friendly features, you can easily find and order from local restaurants, customize your menu, and enjoy the convenience of having delicious food delivered right to your door.'
                headerThree='Join Us'
                paraThree='Whether you’re a restaurant looking to expand your reach or a customer in search of the perfect meal, TBay Eats welcomes you. Sign up today to start exploring, enjoying, and sharing the joy of food. Let’s make every meal a reason to celebrate!'
            />
        </div>
    )
}

export default CombinedScroll