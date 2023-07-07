import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Home_C from '../../components/admin/home/Home';

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('extratoken') || !Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])
    return <Home_C />
}
