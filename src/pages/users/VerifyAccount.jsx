import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import VerifyAccount_C from '../../components/user/profile/VerifyAccount';

export default function VerifyAccount() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('refreshtoken')) {
            navigate("/auth/signin")
        }
    }, [])
    return <VerifyAccount_C />
}
