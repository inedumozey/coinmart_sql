import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export default function UserDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/dashboard/my-packages')
    }, [])
    return (
        <div></div>
    )
}
