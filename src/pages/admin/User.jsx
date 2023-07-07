import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate, useParams } from 'react-router-dom';
import User_C from '../../components/admin/users/user/user';

export default function User() {
    const navigate = useNavigate();
    const params = useParams()

    useEffect(() => {
        if (!Cookies.get('extratoken') || !Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }

    }, [])
    return <User_C selectedUser={params.id} />
}
