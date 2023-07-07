import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Ticket_C from '../../components/user/ticket/Ticket';

export default function Ticket() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('refreshtoken')) {
            navigate("/auth/signin")
        }
    }, [])
    return <Ticket_C />
}
