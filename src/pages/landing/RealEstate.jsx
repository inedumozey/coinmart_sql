import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import RealEstate_C from '../../components/landing/realEstate/RealEstate';

export default function RealEstate() {
    const navigate = useNavigate();

    useEffect(() => {
        if (Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])
    return <RealEstate_C />
}
