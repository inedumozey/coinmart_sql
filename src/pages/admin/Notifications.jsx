import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Notifications_C from '../../components/admin/notifications/Notifications';

export default function Notifications() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('extratoken') || !Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])
    return <Notifications_C />
}
