import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom'
import FAQ_C from '../../components/landing/faq/FAQ';

export default function FAQ() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])
    return <FAQ_C />
}
