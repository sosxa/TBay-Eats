'use client';
import React, { useState } from 'react';
// import diliv from "../../diliv.png";
import Image from 'next/image';

interface ContactUsProps {
    className?: string;
}

// Defining the page component
const ContactUs: React.FC<ContactUsProps> = ({ className }) => {

    // Using React hooks to manage state for name, email, and message
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle form submission
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        // Sending a request to the server to send the email
        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        // Checking if the email was sent successfully
        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.error('Error sending email');
        }
    };



    // Rendering the page
    return (
        <>

            <div className={`flex pt-[10rem] pb-[5rem] ${className}`}>
                <div className='block text-center translate-x-[12.5%] w-[80%] lg:text-left lg:translate-x-[3rem] xl:translate-x-[8rem] 2xl:translate-x-[15rem]'>
                    <h4 className=' text-2xl tracking-wide sm:text-[2.5rem] lg:w-[60%] xl:w-1/2'>Do you have a question or want to become a seller?</h4>
                    <p className='pt-2 tracking-wide lg:w-[60%]'>Fill out this form and our manager will contact you within the next 48 hours</p>
                    <div className='flex justify-center lg:justify-start'>
                        {/* Form for user to fill out */}
                        <form onSubmit={handleSubmit}>
                            <div className='grid gap-4 pt-[2.5rem] justify-center grid-span-3 lg:justify-normal lg:grid-span-0'>
                                <div className='lg:grid lg:gap-[10rem] lg:grid-cols-2 lg:w-1/2 lg:translate-x-[0rem] xl:gap-[11rem] 2xl:gap-[11rem]'>
                                    {/* Input field for name */}
                                    <div className="pb-[1rem]">
                                        <input type="text" id="name" name="name" placeholder='Your Name' className='shadow-xl bg-white rounded-lg h-12 w-[17rem] pl-1 pt-1 sm:w-[30rem] md:w-[40rem] lg:w-[12rem] xl:w-[17rem]' value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    {/* Input field for email */}
                                    <div className=' lg:translate-x-[2rem] xl:translate-x-[3rem] 2xl:translate-x-[1rem]'>
                                        <input type="text" id="email" name="email" placeholder='Your Email' className='shadow-xl bg-white rounded-lg h-12 w-[17rem] pl-1 pt-1 sm:w-[30rem] md:w-[40rem] lg:w-[15rem] xl:w-[19rem] 2xl:w-[19rem]' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                {/* Textarea for message */}
                                <div className=''>
                                    <textarea name='message' placeholder='Your Message' className='shadow-xl bg-white rounded-lg h-[15rem] w-[17rem] pl-2 pt-2 sm:w-[30rem] md:w-[40rem] lg:w-[30rem] xl:w-[38rem] xl:h-[20rem]' value={message} onChange={(e) => setMessage(e.target.value)} />
                                </div>
                                {/* Submit button */}
                                <div className='flex justify-center xl:-translate-x-[2rem] 2xl:-translate-x-[6rem]'>
                                    <button className="bg-transparent hover:bg-custom-green text-custom-green font-semibold hover:text-white py-2 px-4 border border-custom-green hover:border-transparent rounded">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                        {/* Image */}
                        <div className='hidden lg:block lg:float-right lg:translate-x-[5rem] xl:translate-x-[3rem] 2xl:translate-x-[8rem]' >
                            {/* <Image
                                src={diliv}
                                width={600}
                                height={600}
                                alt="cartoon drawing of dilvery man on moped "
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUs;
