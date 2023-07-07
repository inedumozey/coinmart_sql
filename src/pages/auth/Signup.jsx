import Signup_C from '../../components/auth/Signup';
import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/")
        }
    }, [])
    return <Signup_C />
}
