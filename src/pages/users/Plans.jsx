import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Plans_C from '../../components/user/plans/Plans';

export default function Plans() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('refreshtoken')) {
            navigate("/auth/signin")
        }
    }, [])
    return <Plans_C />
}
