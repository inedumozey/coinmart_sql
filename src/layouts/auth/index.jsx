import React from 'react'
import styled from 'styled-components'
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Auth({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <div>
            {
                location.pathname.includes('/auth/verify-email') ? "" :

                    <Header>
                        <Link to="/" style={{ width: '100px' }}>
                            <img style={{ width: '100%' }} src="/logo.png" />
                        </Link>
                    </Header>
            }
            <div>{children}</div>
        </div>
    )
}

const Header = styled.div`
    display: flex;
    padding: 5px ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 5px ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 5px ${({ theme }) => theme.sm_padding};
    }
`