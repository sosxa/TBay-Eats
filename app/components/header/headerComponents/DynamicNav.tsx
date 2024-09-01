'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DynamicNav = () => {
    const supabase = createClient();
    const [activeSession, setActiveSession] = useState(false);

    useEffect(() => {

        supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setActiveSession(true);
            } else {
                setActiveSession(false);
            }
        });
    }, []);

    const onClickFunction = async () => {
        if (activeSession) {
            const { error } = await supabase.auth.signOut();
            if (error) console.log("Error signing out: ", error);
        } else {
            redirect("/login");
        }
    };

    return (
        <li>
            <a onClick={onClickFunction}>{activeSession ? "Sign Out" : "Log In"}</a>
        </li>
    );
};

export default DynamicNav;
