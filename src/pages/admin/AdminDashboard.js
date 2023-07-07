import React, { useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('extratoken') || !Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
        navigate('/admin/home')
    }, [])
    return (
        <div></div>
    )
}
