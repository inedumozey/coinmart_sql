import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/404')
    })

    return (
        <h2>404 | Page Not Found!  You'll be redirected to custome 404 page</h2>
    )
}
