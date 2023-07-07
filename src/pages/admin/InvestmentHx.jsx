import React, { useEffect } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import History_C from '../../components/admin/investment/history/History';

export default function InvestoryHx() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('extratoken') || !Cookies.get('refreshtoken')) {
            navigate("/dashboard")
        }
    }, [])
    return <History_C />
}
