import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate, useParams } from 'react-router-dom';
import Notification_C from '../../components/admin/notifications/Notification';

export default function Notification() {
    const navigate = useNavigate();
    const params = useParams()

    useEffect(() => {
        if (!Cookies.get('extratoken') || !Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])
    return <Notification_C id={params.id} />
}
