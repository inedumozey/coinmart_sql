import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate, useParams } from 'react-router-dom';
import Notification_C from '../../components/user/notifications/Notification';

export default function Notification() {
    const navigate = useNavigate();
    const params = useParams()

    useEffect(() => {
        if (!Cookies.get('refreshtoken')) {
            navigate("/auth/signin")
        }
    }, [])
    return <Notification_C id={params.id} />
}
