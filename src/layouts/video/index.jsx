import React from 'react'
import styled from 'styled-components'

export default function Certificate({ children }) {
    return (
        <Card>
            <video controls autoPlay>
                <source
                    src="/asd.mp4"
                    type='video/mp4'
                />
            </video>
        </Card>
    )
}


const Card = styled.div`
    width: 100vw;
    height: 100vh;
    transition: .2s;
    background: rgba(0,0,0);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
`