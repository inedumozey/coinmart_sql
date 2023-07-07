import VerifyForgotPassword_C from '../../components/auth/VerifyForgotPassword'
import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

export default function VerifyForgotPassword() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/")
        }
    }, [])
    return <VerifyForgotPassword_C />
}
