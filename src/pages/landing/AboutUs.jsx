import React, { useEffect } from 'react'

import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom'
import AboutUs_C from '../../components/landing/aboutUs/AboutUs';

export default function AboutUs() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])

    return <AboutUs_C />
}
