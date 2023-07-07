import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Plans_C from '../../components/landing/plans/Plans';

export default function Plans() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])
    return <Plans_C />
}
