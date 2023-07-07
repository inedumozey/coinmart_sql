import React from 'react'
import styled from 'styled-components'

export default function Certificate({ children }) {
    return (
        <CertModal>
            {children}
        </CertModal>
    )
}


const CertModal = styled.div`
    width: 100vw;
    height: 100vh;
    transition: .2s;
    background: rgba(0,0,0, .7);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
`