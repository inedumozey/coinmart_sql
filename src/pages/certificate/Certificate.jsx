import React from 'react'
import Image from 'react-bootstrap/Image';
import styled from 'styled-components'

export default function Certificate() {

    return (
        <Content>
            <Image src="/cert.jpg" alt="cert" fluid />
        </Content>
    )
}


const Content = styled.div`
    width: 90vw;
    display: flex;
    justify-content: center;
    align-items: center;
`