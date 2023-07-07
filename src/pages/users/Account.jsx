import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import UpdateAccount_C from '../../components/user/profile/UpdateAccount';

export default function UpdateAccount() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('refreshtoken')) {
            navigate("/auth/signin")
        }
    }, [])
    return <UpdateAccount_C />
}
