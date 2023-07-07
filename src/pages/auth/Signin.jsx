import Signin_C from '../../components/auth/Signin'
import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';


export default function Signin() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/")
        }
    }, [])

    return <Signin_C />
}
