import ForgotPassword_C from '../../components/auth/ForgotPassword';
import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/")
        }
    }, [])
    return <ForgotPassword_C />
}
