import React, { useContext } from 'react'
import styled from 'styled-components'
import { Context } from '../context/Context'

export default function Copyright({ height = '98px', bg = 'var(--gray-light)' }) {
    const { contact } = useContext(Context)
    return (
        <Wrapper
            height={height}
            bg={bg}
            className="bottom"
        >
            &copy; {(new Date()).getFullYear() > 2022 ? `2022 - ${(new Date()).getFullYear()}` : (new Date()).getFullYear()} &nbsp; <span style={{ color: 'var(--yellow)' }}>{contact.name} </span>  &nbsp; All Right Reserved
        </Wrapper>
    )
}

const Wrapper = styled.div`
    height: ${({ height }) => height};
    width: 100%;
    background: ${({ bg }) => bg};
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .6rem;
    padding: 0 ${({ theme }) => theme.lg_padding};
    @media (max-width: ${({ theme }) => theme.md_screen}){
        padding: 0 ${({ theme }) => theme.md_padding};
    }
    @media (max-width: ${({ theme }) => theme.sm_screen}){
        padding: 0 ${({ theme }) => theme.sm_padding};
    }
`